import mongoose from 'mongoose';
import Practical from '../src/models/Practical';
import * as dotenv from 'dotenv';
import path from 'path';
import { practicalsList, slugify } from '../src/data/practicals';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/physics_practicals';

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@')}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully!');

    // Clear existing practicals and questions
    await Practical.deleteMany({});
    console.log('Cleared existing practicals');
    
    // Attempt to clear Questions if model exists
    try {
      const Question = require('../src/models/Question').default;
      await Question.deleteMany({});
      console.log('Cleared existing questions');
    } catch (e) {
      console.log('Question model not fully setup or no questions to clear.');
    }

    const practicalObjects = practicalsList.map((p, index) => ({
      title: p.title,
      slug: slugify(p.title),
      category: p.category,
      shortText: `Explore the fundamental concepts and experimental methods for ${p.title.toLowerCase().replace('determination of ', '').replace('verification of ', '')}.`,
      theory: `This section details the underlying scientific principles for ${p.title}. 

According to established physical laws, this phenomenon can be modeled mathematically. The theoretical framework requires understanding the relationship between the primary variables being measured. 

Key Equation:
y = mx + c

Where 'm' represents the gradient which corresponds to the physical constant we are trying to determine. It is crucial to ensure all measurements are taken in SI units to maintain dimensional consistency.`,
      apparatus: [
        'Main measuring instrument (e.g., Vernier calliper / Micrometer / Spectrometer)',
        'Retort stand and clamp',
        'Set of standard weights or masses',
        'Connecting wires and power supply (if applicable)',
        'Beakers and relevant glassware (if applicable)'
      ],
      method: `1. Set up the apparatus exactly as shown in the provided diagram, ensuring all connections are secure and stable.
2. Calibrate the measuring instruments and record any zero errors before beginning data collection.
3. Take the first set of readings by adjusting the independent variable to its minimum practical value.
4. Carefully measure and record the corresponding dependent variable.
5. Repeat the measurement for at least 6 different values of the independent variable, taking multiple readings at each point to calculate an average.
6. Tabulate the recorded data and plot a graph of the dependent variable against the independent variable.
7. Determine the gradient of the graph to calculate the final physical quantity.`,
      importantPoints: [
        'Ensure the eye is level with the reading mark to avoid parallax error.',
        'Wait for the system to reach thermal/mechanical equilibrium before taking readings.',
        'Take repeated measurements and calculate the mean to reduce random errors.',
        'Check for and apply zero-error corrections to all instruments.'
      ],
      diagrams: []
    }));

    const insertedPracticals = await Practical.insertMany(practicalObjects);
    console.log(`Successfully seeded ${insertedPracticals.length} practicals into the database.`);

    // Seed some questions for the first few practicals
    try {
      const Question = require('../src/models/Question').default;
      const questionsToInsert = [];
      
      for (let i = 0; i < Math.min(5, insertedPracticals.length); i++) {
        const prac = insertedPracticals[i];
        questionsToInsert.push({
          practicalId: prac._id,
          type: 'past',
          questionText: `Describe the primary sources of error when performing the experiment: ${prac.title}.`,
          subparts: ['What precautions can minimize these errors?', 'How do these errors affect the final calculation?'],
          marks: 10
        });
      }
      
      await Question.insertMany(questionsToInsert);
      console.log(`Successfully seeded ${questionsToInsert.length} sample questions.`);
    } catch (e) {
      console.log('Skipping question seeding due to error:', e);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
