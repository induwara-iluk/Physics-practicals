import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import dbConnect from '../lib/mongodb';
import Practical from '../models/Practical';

async function migratePracticalNumbers() {
  try {
    await dbConnect();
    const practicals = await Practical.find({});
    console.log(`Checking ${practicals.length} practicals...`);
    
    for (const p of practicals) {
      if (typeof p.practicalNumber === 'number') {
        p.practicalNumber = p.practicalNumber.toString();
        await p.save();
        console.log(`✅ Updated ${p.title} to string: ${p.practicalNumber}`);
      }
    }
    console.log('✅ Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migratePracticalNumbers();
