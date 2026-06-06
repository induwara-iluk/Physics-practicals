import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not defined.');
  process.exit(1);
}

const initialData = [
  { year: 2024, q1: '2', q2: '28', q3: '20', q4: '32' },
  { year: 2023, q1: '10', q2: '27', q3: '21.1', q4: '32' },
  { year: 2022, q1: '5', q2: '28', q3: '14', q4: '33' },
  { year: 2021, q1: '11', q2: '29', q3: '16', q4: '32' },
  { year: 2020, q1: '11', q2: '22', q3: '', q4: '31' },
  { year: 2019, q1: '41', q2: '30', q3: '20', q4: '34' },
  { year: 2018, q1: '8', q2: '23', q3: '16', q4: '35' },
  { year: 2017, q1: '6', q2: '26', q3: '13', q4: '31' },
  { year: 2016, q1: '1', q2: '29', q3: '14', q4: '31' },
  { year: 2015, q1: '10', q2: '24', q3: '21.1', q4: '34' },
];

async function seedHistory() {
  const client = new MongoClient(MONGODB_URI!);
  try {
    console.log('Connecting to database using MongoClient...');
    await client.connect();
    
    const db = client.db();
    const historyCollection = db.collection('questionhistories'); // MongoDB collections are usually lowercase plurals of models
    
    console.log('Clearing existing history...');
    await historyCollection.deleteMany({});
    
    console.log('Seeding initial history data...');
    const result = await historyCollection.insertMany(initialData);
    
    console.log(`✅ History seeded successfully! Inserted ${result.insertedCount} records.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding history:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedHistory();
