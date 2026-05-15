import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const PracticalSchema = new mongoose.Schema({
  title: String,
  slug: String,
  practicalNumber: Number,
  medium: String
});

const Practical = mongoose.models.Practical || mongoose.model('Practical', PracticalSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const p = await Practical.find({ practicalNumber: { $exists: false } }).select('title slug medium').lean();
  console.log(JSON.stringify(p, null, 2));
  process.exit(0);
}
run();
