const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found!");
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");

    const db = mongoose.connection.db;
    const questionsCollection = db.collection('questions');

    const allQuestions = await questionsCollection.find({}).toArray();
    console.log(`Total questions: ${allQuestions.length}`);

    let modelCount = 0;
    let pastCount = 0;

    allQuestions.forEach((q) => {
      const isModel = q.type === 'model' || q.source?.type === 'model_paper';
      if (isModel) {
        modelCount++;
      } else {
        pastCount++;
      }
    });

    console.log(`Classified Model Questions: ${modelCount}`);
    console.log(`Classified Past Papers: ${pastCount}`);

    // Print the model questions
    console.log("\nModel Questions details:");
    allQuestions.filter(q => q.type === 'model' || q.source?.type === 'model_paper').forEach((q, idx) => {
      console.log(`${idx + 1}. Title: "${q.title}"`);
      console.log(`   Root Type: "${q.type}"`);
      console.log(`   Source Type: "${q.source?.type}"`);
      console.log(`   Year: ${q.source?.year}`);
      console.log(`   Exam: "${q.source?.exam}"`);
    });

  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected");
  }
}

run();
