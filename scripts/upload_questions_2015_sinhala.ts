import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI environment variable is not defined.');
  process.exit(1);
}

const questionsData = [
  {
    "year": 2015,
    "type": "past",
    "questionText": "සරල අවලම්බයක් භාවිත කර ගුරුත්වජ ත්වරණය (g) සෙවීමේ පරීක්ෂණයක් සඳහා ලබා දී ඇති දත්ත සහ උපකරණ භාවිතයෙන් ප්රස්තාරික ක්රමයකින් g නිර්ණය කිරීමට ඔබට නියමව ඇත.",
    "subparts": [
      "(a)",
      "සරල අවලම්බයක දෝලන කාලාවර්තය T, අවලම්බයේ දිග l සහ ගුරුත්වජ ත්වරණය g ඇසුරෙන් ලියා දක්වන්න.",
      "(b)",
      "මෙම පරීක්ෂණයේ දී g නිර්ණය කිරීමට භාවිතා කළ හැකි සරල රේඛීය ප්රස්තාරයක් ඇඳීම සඳහා ඉහත (a) හි ඇති සමීකරණය නැවත සකස් කරන්න.",
      "(c)",
      "ගුරුත්වජ ත්වරණය නිර්ණය කිරීමේ පරීක්ෂණයේ දී පහත සඳහන් දෑ සිදු කරන්නේ මන්දැයි කෙටියෙන් විස්තර කරන්න.",
      "(i)",
      "අවලම්බය ඉතා කුඩා කෝණයකින් දෝලනය කිරීම.",
      "(ii)",
      "දෝලන දහයක් හෝ විස්සක් වැනි ප්රමාණයක් සඳහා කාලය මැනීම.",
      "(d)",
      "මෙම පරීක්ෂණයේ දී ඔබට අවශ්ය තවත් අත්යවශ්ය මිනුම් උපකරණ දෙකක් සහ එමගින් මැනිය හැකි මිනුම් ලියන්න.",
      "(e)",
      "ශිෂ්යයෙක් විවිධ දිගවල් L සඳහා දෝලන කාලාවර්ත T මැන ලබාගත් දත්ත පහත වගුවේ දැක්වේ.",
      "(i)",
      "වගුවේ ඉතිරි තීරුව සම්පූර්ණ කරන්න.",
      "(ii)",
      "ස්වායත්ත සහ පරායත්ත විචල්යයන් නම් කරමින් සුදුසු ප්රස්තාරයක් අඳින්න.",
      "(iii)",
      "ප්රස්තාරයේ අනුක්රමණය භාවිත කර g ගණනය කරන්න.",
      "(iv)",
      "ඔබ ලබා ගත් g හි අගයෙහි ප්රතිශත දෝෂය ගණනය කරන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "සරල අවලම්බයක් භාවිත කර ගුරුත්වජ ත්වරණය (g) සෙවීම.",
    "questionNumber": "1",
    "practicalNumber": 10, // Simple pendulum
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2015,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 1
    },
    "subQuestions": [
      {
        "id": "q1_a",
        "part": "(a)",
        "text": "සරල අවලම්බයක දෝලන කාලාවර්තය T, අවලම්බයේ දිග l සහ ගුරුත්වජ ත්වරණය g ඇසුරෙන් ලියා දක්වන්න.",
        "marks": 1,
        "answer": "$T = 2\\pi \\sqrt{\\frac{l}{g}}$"
      },
      {
        "id": "q1_b",
        "part": "(b)",
        "text": "සරල රේඛීය ප්රස්තාරයක් ඇඳීම සඳහා සමීකරණය නැවත සකස් කරන්න.",
        "marks": 1,
        "answer": "$T^2 = \\frac{4\\pi^2}{g} l$"
      },
      {
        "id": "q1_c_i",
        "part": "(c)(i)",
        "text": "අවලම්බය ඉතා කුඩා කෝණයකින් දෝලනය කිරීමේ අරමුණ.",
        "marks": 1,
        "answer": "සරල අනුවර්තීය චලිතයක් සඳහා වන සන්නිකර්ෂණය ($\\sin \\theta \\approx \\theta$) සත්ය වීම සඳහා."
      },
      {
        "id": "q1_c_ii",
        "part": "(c)(ii)",
        "text": "දෝලන දහයක් හෝ විස්සක් වැනි ප්රමාණයක් සඳහා කාලය මැනීමේ අරමුණ.",
        "marks": 1,
        "answer": "කාලය මැනීමේදී සිදුවන ප්රතිශත දෝෂය අවම කර ගැනීමට."
      },
      {
        "id": "q1_d",
        "part": "(d)",
        "text": "අත්යවශ්ය මිනුම් උපකරණ දෙකක් සහ එමගින් මැනිය හැකි මිනුම් ලියන්න.",
        "marks": 2,
        "answer": "1. මීටර් කෝදුව - අවලම්බයේ දිග (l) මැනීමට.\n2. විරාම ඝටිකාව - කාලාවර්තය (T) මැනීමට."
      },
      {
        "id": "q1_e",
        "part": "(e)",
        "text": "ගණනය කිරීම් සහ ප්රස්තාරය ඇඳීම.",
        "marks": 14,
        "answer": "අනුක්රමණය භාවිතයෙන් g නිර්ණය කිරීම සහ දෝෂය ගණනය කිරීම."
      }
    ],
    "tags": ["Simple Pendulum", "Gravity", "Mechanics Practical"],
    "title": "ගුරුත්වජ ත්වරණය සෙවීම 2015",
    "medium": "Sinhala"
  },
  {
    "year": 2015,
    "type": "past",
    "questionText": "මීටර සේතුවක් භාවිතයෙන් කම්බියක ප්රතිරෝධය සහ ද්රව්යයක ප්රතිරෝධකතාවය නිර්ණය කිරීම.",
    "subparts": [
      "(a)",
      "මීටර සේතුවේ මූලධර්මය ලියා දක්වන්න.",
      "(b)",
      "මෙම පරීක්ෂණයේදී ගල්වනෝමීටරය ආරක්ෂා කිරීම සඳහා ඔබ අනුගමනය කරන පියවර කුමක්ද?",
      "(c)",
      "කම්බියේ විෂ්කම්භය මැනීම සඳහා වඩාත් සුදුසු උපකරණය කුමක්ද? එය මැනිය යුත්තේ කෙසේද?",
      "(d)",
      "මිනුම් ලබා ගැනීමේදී සිදු විය හැකි දෝෂ දෙකක් සඳහන් කර ඒවා අවම කර ගන්නා ක්රම ලියන්න.",
      "(e)",
      "ප්රතිරෝධකතාව (ρ) ගණනය කිරීම සඳහා සමීකරණය ලියා දක්වන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "මීටර සේතුවක් භාවිතයෙන් කම්බියක ප්රතිරෝධය සෙවීම.",
    "questionNumber": "2",
    "practicalNumber": 32, // Metre Bridge
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2015,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 2
    },
    "subQuestions": [
      {
        "id": "q2_a",
        "part": "(a)",
        "text": "මීටර සේතුවේ මූලධර්මය ලියා දක්වන්න.",
        "marks": 2,
        "answer": "වීට්ස්ටන් සේතු මූලධර්මය මත පදනම්ව, සංතුලන අවස්ථාවේදී අනුරූප ප්රතිරෝධ අනුපාත සමාන වේ."
      },
      {
        "id": "q2_b",
        "part": "(b)",
        "text": "ගල්වනෝමීටරය ආරක්ෂා කිරීම සඳහා ඔබ අනුගමනය කරන පියවර.",
        "marks": 2,
        "answer": "පේනු යතුරක් හෝ ඉහළ ප්රතිරෝධයක් ශ්රේණිගතව සම්බන්ධ කිරීම."
      },
      {
        "id": "q2_c",
        "part": "(c)",
        "text": "කම්බියේ විෂ්කම්භය මැනීම සඳහා වඩාත් සුදුසු උපකරණය කුමක්ද?",
        "marks": 2,
        "answer": "මයික්රොමීටර ඉස්කුරුප්පු ආමානය. විවිධ ස්ථානවලින් මැන මධ්යන්ය අගය ගැනීම."
      },
      {
        "id": "q2_d",
        "part": "(d)",
        "text": "සිදු විය හැකි දෝෂ දෙකක් සහ අවම කර ගන්නා ක්රම.",
        "marks": 2,
        "answer": "1. ආන්ත දෝෂ - මධ්යන්ය අගය ගැනීම.\n2. කම්බි රත් වීම - කෙටි කාලයකදී මිනුම් ගැනීම."
      },
      {
        "id": "q2_e",
        "part": "(e)",
        "text": "ප්රතිරෝධකතාව (ρ) ගණනය කිරීම සඳහා සමීකරණය.",
        "marks": 2,
        "answer": "$\\rho = \\frac{RA}{l}$"
      }
    ],
    "tags": ["Meter Bridge", "Resistance", "Resistivity", "Electricity Practical"],
    "title": "මීටර සේතුව භාවිතය 2015",
    "medium": "Sinhala"
  },
  {
    "year": 2015,
    "type": "past",
    "questionText": "අවධි කෝණය මගින් වීදුරු ප්රිස්මයක වර්තනාංකය සෙවීම.",
    "subparts": [
      "(a)",
      "අවධි කෝණයක් යනු කුමක්ද?",
      "(b)",
      "මෙම පරීක්ෂණයේදී පූර්ණ අභ්යන්තර පරාවර්තනය සිදුවීම සඳහා කොන්දේසි දෙකක් ලියන්න.",
      "(c)",
      "ප්රිස්මයක වර්තනාංකය n සහ අවධි කෝණය c අතර සම්බන්ධය කුමක්ද?",
      "(d)",
      "මෙම පරීක්ෂණයේදී කිරණ රටාව ඇඳීමේදී මැනිය යුතු කෝණ මොනවාද?",
      "(e)",
      "වර්තනාංකය සෙවීම සඳහා වන පියවර ලියන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "අවධි කෝණය මගින් වීදුරු ප්රිස්මයක වර්තනාංකය සෙවීම.",
    "questionNumber": "3",
    "practicalNumber": 18, // Critical angle
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2015,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 3
    },
    "subQuestions": [
      {
        "id": "q3_a",
        "part": "(a)",
        "text": "අවධි කෝණයක් යනු කුමක්ද?",
        "marks": 2,
        "answer": "අධික වර්තනාංක මාධ්යයක සිට අඩු වර්තනාංක මාධ්යයකට ආලෝකය ගමන් කරන විට, වර්තන කෝණය 90° වන පතන කෝණය."
      },
      {
        "id": "q3_b",
        "part": "(b)",
        "text": "පූර්ණ අභ්යන්තර පරාවර්තනය සිදුවීම සඳහා කොන්දේසි.",
        "marks": 2,
        "answer": "1. ආලෝකය අධික වර්තනාංක මාධ්යයක සිට අඩු වර්තනාංක මාධ්යයකට ගමන් කිරීම.\n2. පතන කෝණය අවධි කෝණයට වඩා වැඩි වීම."
      },
      {
        "id": "q3_c",
        "part": "(c)",
        "text": "වර්තනාංකය n සහ අවධි කෝණය c අතර සම්බන්ධය.",
        "marks": 1,
        "answer": "$n = 1 / \\sin c$"
      },
      {
        "id": "q3_d",
        "part": "(d)",
        "text": "කිරණ රටාව ඇඳීමේදී මැනිය යුතු කෝණ.",
        "marks": 2,
        "answer": "අපගමන කෝණය (d) සහ අවධි කෝණය (c) නිර්ණය කිරීමට අවශ්ය කෝණ මැනීම."
      },
      {
        "id": "q3_e",
        "part": "(e)",
        "text": "වර්තනාංකය සෙවීම සඳහා වන පියවර.",
        "marks": 3,
        "answer": "ප්රිස්මය තබා කිරණ රටාව ඇඳීම, අවධි කෝණය සෙවීම සහ වර්තනාංකය ගණනය කිරීම."
      }
    ],
    "tags": ["Critical Angle", "Refractive Index", "Optics Practical"],
    "title": "අවධි කෝණයෙන් වර්තනාංකය සෙවීම 2015",
    "medium": "Sinhala"
  },
  {
    "year": 2015,
    "type": "past",
    "questionText": "විද්යුත් ගාමක බලය (E) සහ අභ්යන්තර ප්රතිරෝධය (r) සෙවීම.",
    "subparts": [
      "(a)",
      "විද්යුත් ගාමක බලය යනු කුමක්ද?",
      "(b)",
      "අභ්යන්තර ප්රතිරෝධය යනු කුමක්ද?",
      "(c)",
      "පරීක්ෂණ පරිපථය අඳින්න.",
      "(d)",
      "ප්රස්තාරිකව E සහ r සෙවීමට සමීකරණය ගොඩනගන්න.",
      "(e)",
      "ප්රස්තාරයේ අනුක්රමණය සහ අන්තඃඛණ්ඩය මගින් E සහ r සොයන්නේ කෙසේද?"
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "විද්යුත් ගාමක බලය (E) සහ අභ්යන්තර ප්රතිරෝධය (r) සෙවීම.",
    "questionNumber": "4",
    "practicalNumber": 31, // Dry cell internal resistance
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2015,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 4
    },
    "subQuestions": [
      {
        "id": "q4_a",
        "part": "(a)",
        "text": "විද්යුත් ගාමක බලය යනු කුමක්ද?",
        "marks": 2,
        "answer": "කෝෂයක අග්ර විවෘතව පවතින විට අග්ර අතර ඇති විභව අන්තරය."
      },
      {
        "id": "q4_b",
        "part": "(b)",
        "text": "අභ්යන්තර ප්රතිරෝධය යනු කුමක්ද?",
        "marks": 2,
        "answer": "කෝෂය තුළ ධාරාව ගමන් කිරීමේදී කෝෂයේ ද්රව්ය මගින් ඇති කරන ප්රතිරෝධය."
      },
      {
        "id": "q4_c",
        "part": "(c)",
        "text": "පරීක්ෂණ පරිපථය අඳින්න.",
        "marks": 2,
        "answer": "කෝෂය, ප්රතිරෝධ පෙට්ටිය, ඇමීටරය සහ වෝල්ටීයතා මීටරය අදාළ පරිදි පරිපථයට සම්බන්ධ කිරීම."
      },
      {
        "id": "q4_d",
        "part": "(d)",
        "text": "ප්රස්තාරිකව E සහ r සෙවීමට සමීකරණය ගොඩනගන්න.",
        "marks": 2,
        "answer": "$V = E - Ir$"
      },
      {
        "id": "q4_e",
        "part": "(e)",
        "text": "ප්රස්තාරයේ අනුක්රමණය සහ අන්තඃඛණ්ඩය මගින් E සහ r සොයන්නේ කෙසේද?",
        "marks": 2,
        "answer": "y-අන්තඃඛණ්ඩය E වේ. අනුක්රමණය (-r) වේ."
      }
    ],
    "tags": ["Emf", "Internal Resistance", "Electricity Practical"],
    "title": "කෝෂයක වි.ගා.බ සහ අභ්යන්තර ප්රතිරෝධය 2015",
    "medium": "Sinhala"
  }
];

async function seedSinhalaQuestions2015() {
  try {
    console.log('Connecting to MongoDB Atlas via Mongoose...');
    await mongoose.connect(MONGODB_URI!);
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is undefined');
    }
    
    const questionsCollection = db.collection('questions');
    const practicalsCollection = db.collection('practicals');

    console.log('Clearing existing 2015 Sinhala questions to prevent duplicates...');
    const delResult = await questionsCollection.deleteMany({
      "source.year": 2015,
      "source.exam": "GCE Advanced Level",
      "source.subject": "Physics",
      "medium": "Sinhala"
    });
    console.log(`Cleared ${delResult.deletedCount} existing questions.`);

    console.log('Mapping 2015 questions to Sinhala practicals and inserting...');
    const insertDocs = [];

    for (const q of questionsData) {
      // Find corresponding Sinhala practical by practicalNumber
      let practical = await practicalsCollection.findOne({
        practicalNumber: q.practicalNumber,
        medium: 'Sinhala'
      });

      if (!practical) {
        // Fallback: search as string
        practical = await practicalsCollection.findOne({
          practicalNumber: String(q.practicalNumber),
          medium: 'Sinhala'
        });
      }

      if (!practical) {
        console.error(`Error: Could not find Sinhala practical for question ${q.questionNumber} (practicalNumber: ${q.practicalNumber}).`);
        continue;
      }

      console.log(`Matched Q${q.questionNumber} ("${q.title}") to Practical "${practical.title}" (ID: ${practical._id})`);

      const markingScheme = q.subQuestions.map(sq => ({
        subQuestionId: sq.id,
        answer: sq.answer
      }));

      const answers = q.subQuestions.map(sq => ({
        subQuestionId: sq.id,
        latex: ''
      }));

      const doc = {
        practicalId: practical._id,
        questionNumber: q.questionNumber,
        title: q.title,
        source: q.source,
        tags: q.tags,
        difficulty: q.difficulty,
        mainQuestionText: q.mainQuestionText,
        figures: [],
        answer: "",
        subQuestions: q.subQuestions,
        markingScheme: markingScheme,
        answers: answers,
        medium: "Sinhala",
        type: "past",
        subparts: q.subparts,
        marks: q.marks,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      insertDocs.push(doc);
    }

    if (insertDocs.length > 0) {
      const result = await questionsCollection.insertMany(insertDocs);
      console.log(`\n✅ Ingested ${result.insertedCount} Sinhala structured essay questions for 2015 G.C.E. Advanced Level!`);
    } else {
      console.log('No new questions inserted.');
    }
  } catch (error) {
    console.error('❌ Error during Sinhala 2015 questions upload:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedSinhalaQuestions2015();
