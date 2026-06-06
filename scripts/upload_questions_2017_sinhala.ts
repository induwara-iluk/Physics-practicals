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
    "year": 2017,
    "type": "past",
    "questionText": "ඝූර්ණ මූලධර්මය භාවිත කරන පරීක්ෂණය සිදු කිරීම මගින්, අක්රමවත් හැඩයක් සහිත ස්කන්ධය 60 g ප්රමාණයේ ඇති ගල් කැබැල්ලක ස්කන්ධය M සෙවීමට ඔබට පවසා ඇත.",
    "subparts": [
      "(a)",
      "මෙම පරීක්ෂණයේ පළමු පියවර ලෙස, පිහිදාරය මත මීටර කෝදුව සංතුලනය කිරීමට ඔබට පවසා ඇත. මෙම පියවරෙහි අරමුණ කුමක්ද?",
      "(b)",
      "(i)",
      "මෙම පරීක්ෂණය සඳහා ගුරුත්ව කේන්ද්රය භාවිතා කරන ආකාරය කෙටියෙන් විස්තර කරන්න.",
      "(ii)",
      "ප්රතිඵල නිරවද්ය කිරීම සඳහා ඔබ ගන්නා පූර්වෝපායයන් දෙකක් ලියන්න.",
      "(c)",
      "ගල් කැබැල්ලේ ස්කන්ධය M සෙවීමට අවශ්ය මිනුම් සහ දත්ත ලබා ගැනීමට ඔබ අනුගමනය කරන පරීක්ෂණාත්මක ක්රියාපටිපාටිය පියවරෙන් පියවර ලියා දක්වන්න.",
      "(d)",
      "ප්රතිඵල විශ්ලේෂණය සඳහා භාවිතා කරන සමීකරණය ලියා දක්වන්න.",
      "(e)",
      "මෙම පරීක්ෂණය සඳහා මීටර කෝදුව සහ පිහිදාරය භාවිත කිරීමේ සීමාවන් දෙකක් ලියන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "ඝූර්ණ මූලධර්මය භාවිත කර ගල් කැබැල්ලක ස්කන්ධය සෙවීම.",
    "questionNumber": "1",
    "practicalNumber": 6, // Moments
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2017,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 1
    },
    "subQuestions": [
      {
        "id": "q1_a",
        "part": "(a)",
        "text": "පිහිදාරය මත මීටර කෝදුව සංතුලනය කිරීමේ අරමුණ.",
        "marks": 2,
        "answer": "මීටර කෝදුවේ ගුරුත්ව කේන්ද්රය සෙවීම සහ එහි බර මගින් ඇතිවන ඝූර්ණය අහෝසි කිරීම."
      },
      {
        "id": "q1_b",
        "part": "(b)",
        "text": "ගුරුත්ව කේන්ද්රය භාවිතා කරන ආකාරය සහ පූර්වෝපායයන්.",
        "marks": 4,
        "answer": "මීටර කෝදුව තිරස්ව රඳවා ගැනීම සහ කෝදුව පිහිදාරය මත ලිස්සා නොයන සේ සැලකීම."
      },
      {
        "id": "q1_c",
        "part": "(c)",
        "text": "පරීක්ෂණාත්මක ක්රියාපටිපාටිය.",
        "marks": 6,
        "answer": "ගල් කැබැල්ල සහ දන්නා පඩිය මීටර කෝදුවේ දෙපසින් එල්ලා, ඒවායේ දුරවල් මැනීම මගින් සංතුලන අවස්ථාව ලබා ගැනීම."
      },
      {
        "id": "q1_d",
        "part": "(d)",
        "text": "සමීකරණය ලියා දක්වන්න.",
        "marks": 4,
        "answer": "$M \\times d_1 = m \\times d_2$ (මෙහි $d_1, d_2$ යනු පිහිදාරයේ සිට දුරවල් වේ)."
      },
      {
        "id": "q1_e",
        "part": "(e)",
        "text": "සීමාවන් දෙකක් ලියන්න.",
        "marks": 4,
        "answer": "1. පිහිදාරයේ පිහිටීම නිවැරදිව තීරණය කිරීමේ අපහසුව. 2. මීටර කෝදුවේ ඒකාකාරී නොවීම."
      }
    ],
    "tags": ["Rotational Mechanics", "Principle of Moments", "Mechanics Practical"],
    "title": "ඝූර්ණ මූලධර්මය භාවිතයෙන් ස්කන්ධය සෙවීම 2017",
    "medium": "Sinhala"
  },
  {
    "year": 2017,
    "type": "past",
    "questionText": "විද්යුත් විච්ඡේදනය භාවිතයෙන් තඹ වල විද්යුත් රසායනික තුල්යාංකය (z) සෙවීමේ පරීක්ෂණයක් සඳහා අවශ්ය මූලික කරුණු පහත පරිදි වේ.",
    "subparts": [
      "(a)",
      "විද්යුත් විච්ඡේද්යය ලෙස භාවිතා කරන ද්රාවණය කුමක්ද?",
      "(b)",
      "මෙම පරීක්ෂණයේදී තඹ ඉලෙක්ට්රෝඩ පිරිසිදු කිරීම අත්යවශ්ය වන්නේ ඇයි?",
      "(c)",
      "ධාරාව නියතව පවත්වා ගැනීමට අවශ්ය අමතර උපකරණය කුමක්ද?",
      "(d)",
      "පරීක්ෂණයේදී මැනිය යුතු මිනුම් මොනවාද?",
      "(e)",
      "තඹ වල විද්යුත් රසායනික තුල්යාංකය (z) සඳහා සමීකරණය ගොඩනගන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "විද්යුත් විච්ඡේදනයෙන් තඹ වල විද්යුත් රසායනික තුල්යාංකය සෙවීම.",
    "questionNumber": "2",
    "practicalNumber": 26, // As matched in seedHistory.ts
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2017,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 2
    },
    "subQuestions": [
      {
        "id": "q2_a",
        "part": "(a)",
        "text": "විද්යුත් විච්ඡේද්යය ලෙස භාවිතා කරන ද්රාවණය කුමක්ද?",
        "marks": 2,
        "answer": "තනුක කොපර් සල්ෆේට් ($CuSO_4$) ද්රාවණය."
      },
      {
        "id": "q2_b",
        "part": "(b)",
        "text": "තඹ ඉලෙක්ට්රෝඩ පිරිසිදු කිරීමේ අවශ්යතාවය.",
        "marks": 4,
        "answer": "මතුපිට ඇති ඔක්සයිඩ් ස්ථර ඉවත් කර අයන හුවමාරුව නිවැරදිව සිදුවීම සහතික කිරීමට."
      },
      {
        "id": "q2_c",
        "part": "(c)",
        "text": "ධාරාව නියතව පවත්වා ගැනීමට අවශ්ය අමතර උපකරණය.",
        "marks": 4,
        "answer": "ධාරා නියාමකය (Rheostat)."
      },
      {
        "id": "q2_d",
        "part": "(d)",
        "text": "පරීක්ෂණයේදී මැනිය යුතු මිනුම්.",
        "marks": 5,
        "answer": "1. ඉලෙක්ට්රෝඩ වල ස්කන්ධ වෙනස ($\Delta m$).\n2. පරිපථය හරහා ගලා යන ධාරාව (I).\n3. කාලය (t)."
      },
      {
        "id": "q2_e",
        "part": "(e)",
        "text": "විද්යුත් රසායනික තුල්යාංකය (z) සඳහා සමීකරණය.",
        "marks": 5,
        "answer": "$m = zIt \\Rightarrow z = \\frac{m}{It}$"
      }
    ],
    "tags": ["Electrolysis", "Electrochemical Equivalent", "Electricity Practical"],
    "title": "තඹ වල විද්යුත් රසායනික තුල්යාංකය සෙවීම 2017",
    "medium": "Sinhala"
  },
  {
    "year": 2017,
    "type": "past",
    "questionText": "සමාන්තර තහඩු ධාරිත්රකයක ධාරිතාව (C) සහ තහඩු අතර පරතරය (d) අතර සම්බන්ධය සෙවීම.",
    "subparts": [
      "(a)",
      "ධාරිතාව (C) යනු කුමක්ද?",
      "(b)",
      "පරීක්ෂණාත්මක පරිපථය අඳින්න.",
      "(c)",
      "ධාරිතාවය සහ තහඩු අතර පරතරය අතර ඇති සම්බන්ධතාවය කුමක්ද?",
      "(d)",
      "මිනුම් ලබා ගැනීමේදී සැලකිලිමත් විය යුතු සාධක දෙකක් ලියන්න.",
      "(e)",
      "ප්රස්තාරික ක්රමයකින් සම්බන්ධතාවය තහවුරු කරන්නේ කෙසේද?"
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "ධාරිත්රකයක ධාරිතාව සහ තහඩු අතර පරතරය අතර සම්බන්ධය සෙවීම.",
    "questionNumber": "3",
    "practicalNumber": 13, // As matched in seedHistory.ts
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2017,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 3
    },
    "subQuestions": [
      {
        "id": "q3_a",
        "part": "(a)",
        "text": "ධාරිතාව (C) යනු කුමක්ද?",
        "marks": 2,
        "answer": "ධාරිත්රකයක විභවය ඒකකයකින් වැඩි කිරීමට අවශ්ය ආරෝපණ ප්රමාණය."
      },
      {
        "id": "q3_b",
        "part": "(b)",
        "text": "පරීක්ෂණාත්මක පරිපථය අඳින්න.",
        "marks": 4,
        "answer": "ධාරිත්රකය, කෝෂය, මීටරය හෝ ගැල්වනෝමීටරය අදාළ පරිදි සම්බන්ධ කිරීම."
      },
      {
        "id": "q3_c",
        "part": "(c)",
        "text": "ධාරිතාවය සහ තහඩු අතර පරතරය අතර ඇති සම්බන්ධතාවය.",
        "marks": 4,
        "answer": "$C \\propto \\frac{1}{d}$"
      },
      {
        "id": "q3_d",
        "part": "(d)",
        "text": "සැලකිලිමත් විය යුතු සාධක.",
        "marks": 5,
        "answer": "1. තහඩු සමාන්තරව තබා ගැනීම. 2. පරිසර උෂ්ණත්වය සහ ආර්ද්රතාව පාලනය කිරීම."
      },
      {
        "id": "q3_e",
        "part": "(e)",
        "text": "ප්රස්තාරික ක්රමයකින් සම්බන්ධතාවය තහවුරු කිරීම.",
        "marks": 5,
        "answer": "C එදිරියෙන් $1/d$ ප්රස්ථාරයක් ඇඳීමෙන්, එය මූල ලක්ෂ්යය හරහා යන සරල රේඛාවක් දැයි පරීක්ෂා කිරීම."
      }
    ],
    "tags": ["Capacitance", "Parallel Plate Capacitor", "Electricity Practical"],
    "title": "ධාරිත්රකයක ධාරිතාව සෙවීම 2017",
    "medium": "Sinhala"
  },
  {
    "year": 2017,
    "type": "past",
    "questionText": "කාචයක නාභීය දුර (f) සෙවීම සඳහා වන පරීක්ෂණය.",
    "subparts": [
      "(a)",
      "මෙහිදී භාවිතා කරන කාච වර්ගය කුමක්ද?",
      "(b)",
      "කාච සූත්රය ලියා එහි සංකේත අර්ථ දක්වන්න.",
      "(c)",
      "දුර මැනීමේදී සිදු විය හැකි දෝෂ අවම කර ගැනීමට පියවරක් දෙන්න.",
      "(d)",
      "ප්රතිබිම්බය තිරය මත ලබා ගැනීමේදී ඇතිවන අභියෝගයක් ලියන්න.",
      "(e)",
      "f සෙවීම සඳහා U සහ V භාවිත කර ඇඳිය හැකි ප්රස්තාර දෙකක් යෝජනා කරන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "කාචයක නාභීය දුර (f) සෙවීම.",
    "questionNumber": "4",
    "practicalNumber": 31, // As matched in seedHistory.ts
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2017,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 4
    },
    "subQuestions": [
      {
        "id": "q4_a",
        "part": "(a)",
        "text": "භාවිතා කරන කාච වර්ගය.",
        "marks": 2,
        "answer": "අභිසාරී කාචය (උත්තල කාච)."
      },
      {
        "id": "q4_b",
        "part": "(b)",
        "text": "කාච සූත්රය ලියා එහි සංකේත අර්ථ දක්වන්න.",
        "marks": 4,
        "answer": "$\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$ (f=නාභීය දුර, u=වස්තු දුර, v=ප්රතිබිම්බ දුර)"
      },
      {
        "id": "q4_c",
        "part": "(c)",
        "text": "දෝෂ අවම කර ගැනීමට පියවරක්.",
        "marks": 4,
        "answer": "මීටර කෝදුව සහ කාචයේ දෘශ්ය කේන්ද්රය එකම මට්ටමක තබා ගැනීම."
      },
      {
        "id": "q4_d",
        "part": "(d)",
        "text": "තිරය මත ප්රතිබිම්බය ලබා ගැනීමේ අභියෝගය.",
        "marks": 5,
        "answer": "ප්රතිබිම්බය ඉතා පැහැදිලි ලෙස තිරය මත ලබා ගැනීමට නාභිගත කිරීමේ අපහසුව."
      },
      {
        "id": "q4_e",
        "part": "(e)",
        "text": "ඇඳිය හැකි ප්රස්තාර දෙකක්.",
        "marks": 5,
        "answer": "1. $\\frac{1}{u}$ එදිරියෙන් $\\frac{1}{v}$ ප්රස්ථාරය.\n2. $(u+v)$ එදිරියෙන් $u$ ප්රස්ථාරය."
      }
    ],
    "tags": ["Optics", "Lenses", "Focal Length"],
    "title": "කාචයක නාභීය දුර සෙවීම 2017",
    "medium": "Sinhala"
  }
];

async function seedSinhalaQuestions2017() {
  try {
    console.log('Connecting to MongoDB Atlas via Mongoose...');
    await mongoose.connect(MONGODB_URI!);
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is undefined');
    }
    
    const questionsCollection = db.collection('questions');
    const practicalsCollection = db.collection('practicals');

    console.log('Clearing existing 2017 Sinhala questions to prevent duplicates...');
    const delResult = await questionsCollection.deleteMany({
      "source.year": 2017,
      "source.exam": "GCE Advanced Level",
      "source.subject": "Physics",
      "medium": "Sinhala"
    });
    console.log(`Cleared ${delResult.deletedCount} existing questions.`);

    console.log('Mapping 2017 questions to Sinhala practicals and inserting...');
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
      console.log(`\n✅ Ingested ${result.insertedCount} Sinhala structured essay questions for 2017 G.C.E. Advanced Level!`);
    } else {
      console.log('No new questions inserted.');
    }
  } catch (error) {
    console.error('❌ Error during Sinhala 2017 questions upload:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedSinhalaQuestions2017();
