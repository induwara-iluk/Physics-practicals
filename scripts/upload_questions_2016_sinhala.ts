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
    "year": 2016,
    "type": "past",
    "questionText": "සමහර වස්තු භාජන තුළ අසුරන විට ඒවා භාජනයේ සම්පූර්ණ පරිමාවම අයත් කර නොගනී. මෙය වස්තුවල හැඩය නිසා සිදුවන අතර, එවැනි තත්ත්ව යටතේදී භාජනයේ පරිමාවෙන් කිසියම් භාගයක් සැමවිටම හිස්ව වාතයෙන් පිරී පවතී. (1) රූපයේ පෙනෙන පරිදි අරය r වූ සර්වසම ඝන ගෝල වලින් විධිමත් ආකාරයට සම්පූර්ණයෙන් අසුරා ඇති, පැත්තක දිග 8r වූ ඝනකාකාර පෙට්ටියක ආකාරයේ භාජනයක් සලකන්න.",
    "subparts": [
      "(a)",
      "(i)",
      "භාජනයේ අසුරා ඇති ගෝල ගණන සොයන්න.",
      "(ii)",
      "ගෝල මගින් භාජනයේ පරිමාවෙන් කොපමණ භාගයක් අත්පත් කර ගෙන ඇත්දැයි පෙන්වන්න.",
      "(iii)",
      "භාජනයේ පරිමාවෙන් කොපමණ භාගයක් වාතයෙන් පිරී පවතීදැයි පෙන්වන්න.",
      "(b)",
      "ඉහත (1) රූපයේ දැක්වෙන භාජනය තුළ, එකම අරය r වූ තවත් ගෝල ස්වල්පයක් පවතින බව සලකන්න. ඉහත (a)(i) හි ඔබ සොයාගත් ගෝල ගණනට අමතරව තවත් ගෝල කිහිපයක් අසුරා ඇති විට භාජනය තුළ වායු පීඩනය පාලනය කරන්නේ කෙසේද?",
      "(c)",
      "වෙනත් හැඩතල සහිත වස්තු භාජනයක අසුරන විට එහි පරිමාව අත්පත් කර ගැනීමේ शक्यता වැඩි කරගත හැක්කේ කෙසේද?",
      "(d)",
      "ඉහත සඳහන් කරන ලද ඝනකාකාර පෙට්ටියේ වස්තු ඇසිරීමේදී සිදු විය හැකි ප්රධාන දෝෂ දෙකක් සඳහන් කරන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "සමහර වස්තු භාජන තුළ අසුරන විට ඒවා භාජනයේ සම්පූර්ණ පරිමාවම අයත් කර නොගනී. මෙය වස්තුවල හැඩය නිසා සිදුවන අතර, එවැනි තත්ත්ව යටතේදී භාජනයේ පරිමාවෙන් කිසියම් භාගයක් සැමවිටම හිස්ව වාතයෙන් පිරී පවතී. (1) රූපයේ පෙනෙන පරිදි අරය r වූ සර්වසම ඝන ගෝල වලින් විධිමත් ආකාරයට සම්පූර්ණයෙන් අසුරා ඇති, පැත්තක දිග 8r වූ ඝනකාකාර පෙට්ටියක ආකාරයේ භාජනයක් සලකන්න.",
    "questionNumber": "1",
    "practicalNumber": 1, // Vernier caliper / shapes and density
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2016,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 1
    },
    "subQuestions": [
      {
        "id": "q1_a_i",
        "part": "(a)(i)",
        "text": "භාජනයේ අසුරා ඇති ගෝල ගණන සොයන්න.",
        "marks": 1,
        "answer": "ඝනකයේ පැත්තක දිග 8r වන අතර ගෝලයක විෂ්කම්භය 2r වේ. පැත්තක දිග ඔස්සේ අසුරන ගෝල ගණන = 8r / 2r = 4. එබැවින් මුළු ගෝල ගණන = 4 × 4 × 4 = 64."
      },
      {
        "id": "q1_a_ii",
        "part": "(a)(ii)",
        "text": "ගෝල මගින් භාජනයේ පරිමාවෙන් කොපමණ භාගයක් අත්පත් කර ගෙන ඇත්දැයි පෙන්වන්න.",
        "marks": 2,
        "answer": "ගෝල 64ක පරිමාව = $64 \\times \\frac{4}{3} \\pi r^3 = \\frac{256}{3} \\pi r^3$. භාජනයේ පරිමාව = $(8r)^3 = 512 r^3$. අත්පත් කර ගත් භාගය = $\\frac{\\frac{256}{3} \\pi r^3}{512 r^3} = \\frac{\\pi}{6} \\approx 0.52$."
      },
      {
        "id": "q1_a_iii",
        "part": "(a)(iii)",
        "text": "භාජනයේ පරිමාවෙන් කොපමණ භාගයක් වාතයෙන් පිරී පවතීදැයි පෙන්වන්න.",
        "marks": 1,
        "answer": "වාතයෙන් පිරුණු භාගය = $1 - \\frac{\\pi}{6} \\approx 1 - 0.52 = 0.48$."
      },
      {
        "id": "q1_b",
        "part": "(b)",
        "text": "ඉහත (1) රූපයේ දැක්වෙන භාජනය තුළ, එකම අරය r වූ තවත් ගෝල ස්වල්පයක් පවතින බව සලකන්න. ඉහත (a)(i) හි ඔබ සොයාගත් ගෝල ගණනට අමතරව තවත් ගෝල කිහිපයක් අසුරා ඇති විට භාජනය තුළ වායු පීඩනය පාලනය කරන්නේ කෙසේද?",
        "marks": 2,
        "answer": "භාජනයේ පරිමාව සහ උෂ්ණත්වය නියත නම්, බොයිල් නියමයට අනුව වායු පරිමාව අඩුවීම නිසා පීඩනය වැඩි වේ. පීඩනය පාලනය කිරීමට සිදුරු සහිත මූඩියක් හෝ පීඩන නිදහස් කර ගැනීමේ කපාටයක් භාවිත කළ හැක."
      },
      {
        "id": "q1_c",
        "part": "(c)",
        "text": "වෙනත් හැඩතල සහිත වස්තු භාජනයක අසුරන විට එහි පරිමාව අත්පත් කර ගැනීමේ शक्यता වැඩි කරගත හැක්කේ කෙසේද?",
        "marks": 2,
        "answer": "විවිධ ප්රමාණයේ වස්තු භාවිත කිරීමෙන් (විශාල වස්තු අතර හිස් තැන් කුඩා වස්තු වලින් පිරවීම) හෝ වඩා කාර්යක්ෂම ඇසුරුම් රටා භාවිත කිරීමෙන්."
      },
      {
        "id": "q1_d",
        "part": "(d)",
        "text": "ඉහත සඳහන් කරන ලද ඝනකාර පෙට්ටියේ වස්තු ඇසිරීමේදී සිදු විය හැකි ප්රධාන දෝෂ දෙකක් සඳහන් කරන්න.",
        "marks": 2,
        "answer": "1. අසුරන වස්තු අතර හිස් අවකාශය වැඩි වීම (අවකාශීය කාර්යක්ෂමතාව අඩු වීම).\n2. භාජනයේ බිත්ති වල අසමමිතික බල පැතිරීමක් ඇති වීම (හෝ භාජනයට හානි සිදුවීම)."
      }
    ],
    "tags": ["Mechanics", "Geometry", "Packing Efficiency"],
    "title": "ඝනකාකාර භාජනයක ගෝල ඇසිරීම 2016",
    "medium": "Sinhala"
  },
  {
    "year": 2016,
    "type": "past",
    "questionText": "සර්ල්ගේ ක්රමයෙන් ලෝහයක තාප සන්නායකතාව නිර්ණය කිරීම සඳහා ලබා දී ඇති උපකරණ භාවිතයෙන් පරීක්ෂණයක් සැලසුම් කරන්න.",
    "subparts": [
      "(a)",
      "මෙම පරීක්ෂණයේදී අනිවාර්යයෙන් තිබිය යුතු කොටස් නම් කරන්න.",
      "(b)",
      "තාප සන්නායකතාවය නිර්ණය සඳහා අවශ්ය සමීකරණය ලියා දක්වන්න.",
      "(c)",
      "අනවරත අවස්ථාව (steady state) යනු කුමක්ද?",
      "(d)",
      "මෙම පරීක්ෂණයේදී උෂ්ණත්ව අනුක්රමණය මැනීමට අවශ්ය මිනුම් උපකරණ මොනවාද?",
      "(e)",
      "මිනුම් ලබා ගැනීමේදී සැලකිලිමත් විය යුතු කරුණු දෙකක් ලියන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "සර්ල්ගේ ක්රමයෙන් ලෝහයක තාප සන්නායකතාව නිර්ණය කිරීම.",
    "questionNumber": "2",
    "practicalNumber": 30, // Searle's Method
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2016,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 2
    },
    "subQuestions": [
      {
        "id": "q2_a",
        "part": "(a)",
        "text": "මෙම පරීක්ෂණයේදී අනිවාර්යයෙන් තිබිය යුතු කොටස් නම් කරන්න.",
        "marks": 2,
        "answer": "ලෝහ දණ්ඩ, හුමාල ජනකය, ජල ජැකට්ටුව, උෂ්ණත්වමාන 4ක්, මිනුම් බඳුනක්."
      },
      {
        "id": "q2_b",
        "part": "(b)",
        "text": "තාප සන්නායකතාවය නිර්ණය සඳහා අවශ්ය සමීකරණය ලියා දක්වන්න.",
        "marks": 2,
        "answer": "$\\frac{Q}{t} = kA \\frac{\\Delta\\theta}{\\Delta x}$"
      },
      {
        "id": "q2_c",
        "part": "(c)",
        "text": "අනවරත අවස්ථාව (steady state) යනු කුමක්ද?",
        "marks": 2,
        "answer": "දණ්ඩේ සෑම ස්ථානයකම උෂ්ණත්වය කාලය සමග වෙනස් නොවී පවතින අවස්ථාව."
      },
      {
        "id": "q2_d",
        "part": "(d)",
        "text": "උෂ්ණත්ව අනුක්රමණය මැනීමට අවශ්ය මිනුම් උපකරණ මොනවාද?",
        "marks": 2,
        "answer": "උෂ්ණත්වමාන සහ මීටර් කෝදුව."
      },
      {
        "id": "q2_e",
        "part": "(e)",
        "text": "මිනුම් ලබා ගැනීමේදී සැලකිලිමත් විය යුතු කරුණු දෙකක් ලියන්න.",
        "marks": 2,
        "answer": "1. උෂ්ණත්වමාන නිවැරදිව අනවරත අවස්ථාවට පැමිණ ඇති බව තහවුරු කිරීම.\n2. දණ්ඩ සම්පූර්ණයෙන්ම පරිවරණය කර තිබීම."
      }
    ],
    "tags": ["Thermal Conductivity", "Searle's Method", "Heat"],
    "title": "සර්ල්ගේ ක්රමයෙන් තාප සන්නායකතාව සෙවීම 2016",
    "medium": "Sinhala"
  },
  {
    "year": 2016,
    "type": "past",
    "questionText": "වර්ණාවලිමානයක් භාවිතයෙන් ප්රිස්මයක වර්තනාංකය සෙවීම.",
    "subparts": [
      "(a)",
      "වර්ණාවලිමානයෙහි ප්රධාන කොටස් නම් කරන්න.",
      "(b)",
      "ප්රිස්මයේ වර්තනාංකය සෙවීමට අවශ්ය මූලික මිනුම් දෙක මොනවාද?",
      "(c)",
      "අවම අපගමන කෝණය (D) යනු කුමක්ද?",
      "(d)",
      "ප්රිස්ම කෝණය (A) සෙවීම සඳහා වන ක්රමවේදය කෙටියෙන් විස්තර කරන්න.",
      "(e)",
      "වර්තනාංකය සඳහා සමීකරණය ලියා දක්වන්න."
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "වර්ණාවලිමානයක් භාවිතයෙන් ප්රිස්මයක වර්තනාංකය සෙවීම.",
    "questionNumber": "3",
    "practicalNumber": 20, // Spectrometer
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2016,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 3
    },
    "subQuestions": [
      {
        "id": "q3_a",
        "part": "(a)",
        "text": "වර්ණාවලිමානයෙහි ප්රධාන කොටස් නම් කරන්න.",
        "marks": 2,
        "answer": "සමාන්තරකය (Collimator), ප්රිස්ම මේසය, දුරේක්ෂය."
      },
      {
        "id": "q3_b",
        "part": "(b)",
        "text": "ප්රිස්මයේ වර්තනාංකය සෙවීමට අවශ්ය මූලික මිනුම් දෙක මොනවාද?",
        "marks": 2,
        "answer": "1. ප්රිස්ම කෝණය (A).\n2. අවම අපගමන කෝණය (D)."
      },
      {
        "id": "q3_c",
        "part": "(c)",
        "text": "අවම අපගමන කෝණය (D) යනු කුමක්ද?",
        "marks": 2,
        "answer": "ප්රිස්මය තුළ කිරණය ප්රිස්මයේ පාදයට සමාන්තරව ගමන් කරන විට ලැබෙන අවම අපගමන කෝණයයි."
      },
      {
        "id": "q3_d",
        "part": "(d)",
        "text": "ප්රිස්ම කෝණය (A) සෙවීම සඳහා වන ක්රමවේදය කෙටියෙන් විස්තර කරන්න.",
        "marks": 2,
        "answer": "ප්රිස්මයේ මුහුණත් දෙකකින් පරාවර්තනය වන සමාන්තර ආලෝක කිරණවල මිනුම් දෙකක් ලබාගෙන ඒවායේ වෙනස 2A ට සමාන කිරීමෙන්."
      },
      {
        "id": "q3_e",
        "part": "(e)",
        "text": "වර්තනාංකය සඳහා සමීකරණය ලියා දක්වන්න.",
        "marks": 2,
        "answer": "$n = \\frac{\\sin((A+D)/2)}{\\sin(A/2)}$"
      }
    ],
    "tags": ["Spectrometer", "Refractive Index", "Prism", "Optics"],
    "title": "වර්ණාවලිමානය භාවිතයෙන් වර්තනාංකය සෙවීම 2016",
    "medium": "Sinhala"
  },
  {
    "year": 2016,
    "type": "past",
    "questionText": "මීටර සේතුවක් භාවිතයෙන් කෝෂයක වි.ගා.බ. සහ අභ්යන්තර ප්රතිරෝධය සෙවීම.",
    "subparts": [
      "(a)",
      "මීටර සේතුවේ පරිපථය අඳින්න.",
      "(b)",
      "මෙම පරීක්ෂණයේදී ගැල්වනෝමීටරය භාවිතා කරන ආකාරය පැහැදිලි කරන්න.",
      "(c)",
      "සංතුලන දිග ලබා ගැනීමේදී සිදුවන දෝෂාධික මිනුම් අවම කිරීමට පියවර දෙකක් යෝජනා කරන්න.",
      "(d)",
      "කෝෂයක අභ්යන්තර ප්රතිරෝධය සෙවීමට අදාළ සමීකරණය ලියා දක්වන්න.",
      "(e)",
      "ප්රස්ථාරික ක්රමයකින් අභ්යන්තර ප්රතිරෝධය සොයන්නේ කෙසේද?"
    ],
    "images": [],
    "marks": 20,
    "difficulty": "medium",
    "figures": [],
    "mainQuestionText": "මීටර සේතුවක් භාවිතයෙන් කෝෂයක වි.ගා.බ. සහ අභ්යන්තර ප්රතිරෝධය සෙවීම.",
    "questionNumber": "4",
    "practicalNumber": 31, // Dry cell internal resistance
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2016,
      "paper": 1,
      "variant": "Sinhala",
      "questionNumber": 4
    },
    "subQuestions": [
      {
        "id": "q4_a",
        "part": "(a)",
        "text": "මීටර සේතුවේ පරිපථය අඳින්න.",
        "marks": 2,
        "answer": "කෝෂය, ප්රතිරෝධ පෙට්ටිය, සහ මීටර සේතු කම්බිය සම්බන්ධ කරන පරිපථය."
      },
      {
        "id": "q4_b",
        "part": "(b)",
        "text": "මෙම පරීක්ෂණයේදී ගැල්වනෝමීටරය භාවිතා කරන ආකාරය පැහැදිලි කරන්න.",
        "marks": 2,
        "answer": "සංතුලන ලක්ෂ්යය ලබා ගැනීමට (ධාරාව ශුන්ය වන ලක්ෂ්යය) යොදා ගනී."
      },
      {
        "id": "q4_c",
        "part": "(c)",
        "text": "සංතුලන දිග ලබා ගැනීමේදී සිදුවන දෝෂාධික මිනුම් අවම කිරීමට පියවර දෙකක් යෝජනා කරන්න.",
        "marks": 2,
        "answer": "1. ආන්ත දෝෂ මග හැරීමට අග්ර දෙකෙන්ම මැනීම.\n2. විවිධ ප්රතිරෝධ අගයන් භාවිතා කර මධ්යන්ය අගයක් ගැනීම."
      },
      {
        "id": "q4_d",
        "part": "(d)",
        "text": "කෝෂයක අභ්යන්තර ප්රතිරෝධය සෙවීමට අදාළ සමීකරණය ලියා දක්වන්න.",
        "marks": 2,
        "answer": "$r = R(\\frac{l_0}{l} - 1)$"
      },
      {
        "id": "q4_e",
        "part": "(e)",
        "text": "ප්රස්ථාරික ක්රමයකින් අභ්යන්තර ප්රතිරෝධය සොයන්නේ කෙසේද?",
        "marks": 2,
        "answer": "$\\frac{l_0}{l} - 1$ එදිරියෙන් $\\frac{1}{R}$ ප්රස්ථාරයක් ඇඳීමෙන්."
      }
    ],
    "tags": ["Meter Bridge", "Electricity", "Internal Resistance"],
    "title": "මීටර සේතුවෙන් අභ්යන්තර ප්රතිරෝධය සෙවීම 2016",
    "medium": "Sinhala"
  }
];

async function seedSinhalaQuestions2016() {
  try {
    console.log('Connecting to MongoDB Atlas via Mongoose...');
    await mongoose.connect(MONGODB_URI!);
    
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is undefined');
    }
    
    const questionsCollection = db.collection('questions');
    const practicalsCollection = db.collection('practicals');

    console.log('Clearing existing 2016 Sinhala questions to prevent duplicates...');
    const delResult = await questionsCollection.deleteMany({
      "source.year": 2016,
      "source.exam": "GCE Advanced Level",
      "source.subject": "Physics",
      "medium": "Sinhala"
    });
    console.log(`Cleared ${delResult.deletedCount} existing questions.`);

    console.log('Mapping 2016 questions to Sinhala practicals and inserting...');
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
      console.log(`\n✅ Ingested ${result.insertedCount} Sinhala structured essay questions for 2016 G.C.E. Advanced Level!`);
    } else {
      console.log('No new questions inserted.');
    }
  } catch (error) {
    console.error('❌ Error during Sinhala 2016 questions upload:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedSinhalaQuestions2016();
