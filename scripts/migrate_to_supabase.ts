import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const bucketName = 'Practical_images'; // Correct bucket name

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateImages() {
  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found.');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(file => {
    const contentType = getContentType(file);
    return contentType.startsWith('image/');
  });

  console.log(`Found ${files.length} files total, ${imageFiles.length} are images.`);

  for (const file of imageFiles) {
    const filePath = path.join(uploadsDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(file);
    
    console.log(`Uploading image ${file} (${contentType})...`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(file, fileBuffer, {
        upsert: true,
        contentType: contentType
      });

    if (error) {
      console.error(`Error uploading ${file}:`, error.message);
    } else {
      console.log(`Successfully uploaded ${file}`);
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(file);
      
      // Here you could update your database records
      // await updateDatabaseUrls(`/uploads/${file}`, publicUrl);
    }
  }
}

function getContentType(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

// Optional: Function to update database URLs
// This requires connecting to MongoDB
async function updateDatabaseUrls(oldPath: string, newUrl: string) {
  // Logic to update Practical and Question models
  // Example:
  // await Practical.updateMany({ diagrams: oldPath }, { $set: { "diagrams.$": newUrl } });
}

migrateImages().catch(console.error);
