import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = 'Practical_images';

if (!MONGODB_URI || !supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables in .env.local');
  process.exit(1);
}

// Define Schema
const PracticalSchema = new mongoose.Schema({
  title: String,
  slug: String,
  practicalNumber: Number,
  difficulty: String,
  diagrams: [String],
  medium: String,
});

const Practical = mongoose.models.Practical || mongoose.model('Practical', PracticalSchema);

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const thumbnailsDir = path.join(process.cwd(), 'thumbnails');
    if (!fs.existsSync(thumbnailsDir)) {
      console.error('Thumbnails directory not found');
      return;
    }

    const files = fs.readdirSync(thumbnailsDir);
    console.log(`Found ${files.length} thumbnails.`);

    // 1. Establish English metadata mapping for sync
    console.log('Fetching English practicals metadata...');
    const englishPracticals = await Practical.find({ medium: 'English' }).lean();
    const metadataMap = new Map();
    englishPracticals.forEach(p => {
      if (p.practicalNumber) {
        metadataMap.set(p.practicalNumber, { 
          diff: p.difficulty, 
          baseSlug: p.slug 
        });
      }
    });

    for (const file of files) {
      // Extract number from "im (X).png"
      const match = file.match(/im\s*\((\d+(\.\d+)?)\)\.png/);
      if (!match) continue;

      const pNumStr = match[1];
      const pNum = parseFloat(pNumStr);

      const filePath = path.join(thumbnailsDir, file);
      const fileBuffer = fs.readFileSync(filePath);

      console.log(`Uploading ${file} for Practical #${pNum}...`);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(`thumbnails/${file}`, fileBuffer, {
          upsert: true,
          contentType: 'image/png'
        });

      if (error) {
        console.error(`Error uploading ${file}:`, error.message);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`thumbnails/${file}`);

      console.log(`Successfully uploaded. Public URL: ${publicUrl}`);

      // Update Database
      // Find both English and Sinhala versions
      // Note: 21.1 matches 21.1, etc.
      const practicalsToUpdate = await Practical.find({ practicalNumber: pNum });
      
      for (const p of practicalsToUpdate) {
        // Prepend to diagrams if not already there
        let newDiagrams = [...(p.diagrams || [])];
        if (!newDiagrams.includes(publicUrl)) {
          newDiagrams = [publicUrl, ...newDiagrams];
        }

        const updateData: any = { diagrams: newDiagrams };

        // If it's Sinhala and missing metadata, sync from English map if possible
        if (p.medium === 'Sinhala') {
            const meta = metadataMap.get(pNum);
            if (meta) {
                updateData.difficulty = meta.diff;
                // Double check practicalNumber just in case
                updateData.practicalNumber = pNum;
            }
        }

        await Practical.findByIdAndUpdate(p._id, updateData);
        console.log(`Updated ${p.medium} practical: ${p.title} (Slug: ${p.slug})`);
      }
    }

    console.log('Thumbnail migration and sync completed.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
