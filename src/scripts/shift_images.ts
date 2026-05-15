import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PracticalSchema = new mongoose.Schema({
  title: String,
  slug: String,
  practicalNumber: Number,
  diagrams: [String],
  medium: String
});

const Practical = mongoose.models.Practical || mongoose.model('Practical', PracticalSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  // We need to shift images:
  // P(21.1) <- Im(22)
  // P(22)   <- Im(23)
  // ...
  // P(42)   <- Im(43)
  
  // First, let's generate the Supabase URL pattern for each image number
  const getUrlForIm = (n: number) => `https://qjembodryavlooklbvae.supabase.co/storage/v1/object/public/Practical_images/thumbnails/im%20(${n}).png`;

  console.log('Starting image shift migration...');

  // Update 21.1 (and 21.2 if needed, but user didn't specify)
  const p21_1 = await Practical.find({ practicalNumber: 21.1 });
  for (const p of p21_1) {
    const newUrl = getUrlForIm(22);
    await Practical.findByIdAndUpdate(p._id, { $set: { "diagrams.0": newUrl } });
    console.log(`Updated 21.1 (${p.medium}): -> Im(22)`);
  }

  // Update 22 to 42
  for (let n = 22; n <= 42; n++) {
    const practicals = await Practical.find({ practicalNumber: n });
    const nextImUrl = getUrlForIm(n + 1);
    
    for (const p of practicals) {
      await Practical.findByIdAndUpdate(p._id, { $set: { "diagrams.0": nextImUrl } });
      console.log(`Updated Practical #${n} (${p.medium}): -> Im(${n+1})`);
    }
  }

  console.log('Image shift completed successfully.');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
