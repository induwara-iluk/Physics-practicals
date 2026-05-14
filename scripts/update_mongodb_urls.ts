import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Practical from '../src/models/Practical';
import Question from '../src/models/Question';

dotenv.config({ path: '.env.local' });

const mongodbUri = process.env.MONGODB_URI;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const bucketName = 'Practical_images';

if (!mongodbUri || !supabaseUrl) {
  console.error('Missing MONGODB_URI or NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

const supabaseBaseUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/`;
const wrongBucketUrl = `${supabaseUrl}/storage/v1/object/public/practicals/`;

async function updateUrls() {
  try {
    await mongoose.connect(mongodbUri!);
    console.log('Connected to MongoDB');

    // 1. Update Practicals
    const practicals = await Practical.find({});
    console.log(`Checking ${practicals.length} practicals...`);
    
    for (const p of practicals) {
      let updated = false;
      
      // Update theory field (Markdown)
      if (p.theory) {
        if (p.theory.includes('/uploads/')) {
          p.theory = p.theory.split('/uploads/').join(supabaseBaseUrl);
          updated = true;
        }
        if (p.theory.includes(wrongBucketUrl)) {
          p.theory = p.theory.split(wrongBucketUrl).join(supabaseBaseUrl);
          updated = true;
        }
      }
      
      // Update method field (Markdown)
      if (p.method) {
        if (p.method.includes('/uploads/')) {
          p.method = p.method.split('/uploads/').join(supabaseBaseUrl);
          updated = true;
        }
        if (p.method.includes(wrongBucketUrl)) {
          p.method = p.method.split(wrongBucketUrl).join(supabaseBaseUrl);
          updated = true;
        }
      }
      
      // Update diagrams array
      if (p.diagrams && p.diagrams.length > 0) {
        const originalCount = p.diagrams.length;
        p.diagrams = p.diagrams.map((d: string) => {
          if (d.startsWith('/uploads/')) return d.replace('/uploads/', supabaseBaseUrl);
          if (d.includes('/public/practicals/')) return d.replace('/public/practicals/', '/public/Practical_images/');
          return d;
        });
        updated = true; 
      }

      if (updated) {
        await p.save();
        console.log(`Updated practical: ${p.title}`);
      }
    }

    // 2. Update Questions
    const questions = await Question.find({});
    console.log(`Checking ${questions.length} questions...`);

    for (const q of questions) {
      let updated = false;

      // Update mainQuestionText (Markdown)
      if (q.mainQuestionText) {
        if (q.mainQuestionText.includes('/uploads/')) {
          q.mainQuestionText = q.mainQuestionText.split('/uploads/').join(supabaseBaseUrl);
          updated = true;
        }
        if (q.mainQuestionText.includes(wrongBucketUrl)) {
          q.mainQuestionText = q.mainQuestionText.split(wrongBucketUrl).join(supabaseBaseUrl);
          updated = true;
        }
      }

      // Update figures
      if (q.figures && q.figures.length > 0) {
        q.figures = q.figures.map((f: any) => {
          if (f.imageUrl) {
            if (f.imageUrl.startsWith('/uploads/')) {
              f.imageUrl = f.imageUrl.replace('/uploads/', supabaseBaseUrl);
              updated = true;
            }
            if (f.imageUrl.includes('/public/practicals/')) {
              f.imageUrl = f.imageUrl.replace('/public/practicals/', '/public/Practical_images/');
              updated = true;
            }
          }
          return f;
        });
      }

      // Update subQuestions
      if (q.subQuestions && q.subQuestions.length > 0) {
        q.subQuestions = q.subQuestions.map((sq: any) => {
          if (sq.imageUrl) {
            if (sq.imageUrl.startsWith('/uploads/')) {
              sq.imageUrl = sq.imageUrl.replace('/uploads/', supabaseBaseUrl);
              updated = true;
            }
            if (sq.imageUrl.includes('/public/practicals/')) {
              sq.imageUrl = sq.imageUrl.replace('/public/practicals/', '/public/Practical_images/');
              updated = true;
            }
          }
          return sq;
        });
      }

      if (updated) {
        await q.save();
        console.log(`Updated question: ${q.title}`);
      }
    }

    console.log('Migration finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
}

updateUrls();
