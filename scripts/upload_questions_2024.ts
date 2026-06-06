import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Practical from '../src/models/Practical';

dotenv.config({ path: '.env.local' });

const mongodbUri = process.env.MONGODB_URI;

// Define the 2024 questions data
const questionsData = [
  {
    "questionNumber": "1",
    "mainQuestionText": "You are asked to determine the density of the material of a thin uniform wire of length about 15 cm and mass about 200 mg. You are provided with the micrometer screw gauge shown in figure (1) to measure the diameter of the wire.",
    "subparts": [
      "(a)",
      "Name the parts of the micrometer screw gauge marked as A, B (not the two scales) and C.",
      "(b)",
      "The main scale of the micrometer screw gauge is made by dividing 1 mm into two. The circular scale has 50 equal divisions. One complete turn of B will either increase or decrease the distance between the anvil and the spindle by a value which is equal to one division on the main scale.",
      "(i)",
      "What is the pitch of the micrometer screw gauge in mm?",
      "(ii)",
      "What is the least count of the micrometer screw gauge in mm?",
      "(c)",
      "Figure (2) shows the position of the circular scale when the anvil and the spindle touch each other. Determine the value of the zero error of the micrometer screw gauge in mm.",
      "(d)",
      "After determining the zero error, state how the micrometer screw gauge is used to measure the diameter of the wire.",
      "(e)",
      "What is the purpose of having part C in micrometer screw gauges?",
      "(f)",
      "(i)",
      "(1) What is the reading of the micrometer screw gauge in mm?",
      "(2) What is the correct value of the diameter of the wire in mm?",
      "(ii)",
      "Calculate the cross-sectional area (in mm²) of the wire using the value in (f) (i) (2) above. (Take π = 3.)",
      "(g)",
      "(i)",
      "What other measurements do you take to determine the density of the material of the wire?",
      "(ii)",
      "Name the most appropriate measuring instruments needed to obtain the measurements mentioned in (g) (i) above.",
      "(h)",
      "Figure (4) shows an electronic micrometer screw gauge used in industrial applications. What is the least count of this gauge in mm?"
    ],
    "subQuestions": [
      {
        "id": "a",
        "part": "(a)",
        "text": "Name the parts of the micrometer screw gauge marked as A, B (not the two scales) and C.",
        "marks": 3,
        "answer": "A: Sleeve\nB: Thimble\nC: Thimble head/Ratchet"
      },
      {
        "id": "b_i",
        "part": "(b)(i)",
        "text": "What is the pitch of the micrometer screw gauge in mm?",
        "marks": 1,
        "answer": "0.5 mm"
      },
      {
        "id": "b_ii",
        "part": "(b)(ii)",
        "text": "What is the least count of the micrometer screw gauge in mm?",
        "marks": 1,
        "answer": "0.01 mm"
      },
      {
        "id": "c",
        "part": "(c)",
        "text": "Figure (2) shows the position of the circular scale when the anvil and the spindle touch each other. Determine the value of the zero error of the micrometer screw gauge in mm.",
        "marks": 1,
        "answer": "-0.02 mm or 0.02 mm"
      },
      {
        "id": "d",
        "part": "(d)",
        "text": "After determining the zero error, state how the micrometer screw gauge is used to measure the diameter of the wire.",
        "marks": 2,
        "answer": "(1) Place the wire in between anvil and spindle by turning C/thimble head until C/thimble head slips OR starts rotating freely OR a clicking/ tick tick sound is heard.\n(2) (Rotate the wire by 90° and) measure the diameter at different/several places of the wire."
      },
      {
        "id": "e",
        "part": "(e)",
        "text": "What is the purpose of having part C in micrometer screw gauges?",
        "marks": 1,
        "answer": "Preventing the spindle from moving further OR avoid damaging the wire (measuring object) OR to avoid over pressing/pressurizing the wire (measuring object)"
      },
      {
        "id": "f_i_1",
        "part": "(f)(i)(1)",
        "text": "Figure (3) shows the position of the circular scale when the diameter of one place of the wire is measured using the micrometer screw gauge mentioned in (c) above. What is the reading of the micrometer screw gauge in mm?",
        "marks": 2,
        "answer": "0.58 mm"
      },
      {
        "id": "f_i_2",
        "part": "(f)(i)(2)",
        "text": "What is the correct value of the diameter of the wire in mm?",
        "marks": 2,
        "answer": "0.60 mm"
      },
      {
        "id": "f_ii",
        "part": "(f)(ii)",
        "text": "Calculate the cross-sectional area (in mm²) of the wire using the value in (f) (i) (2) above. (Take π = 3.)",
        "marks": 2,
        "answer": "3 * 0.3^2 = 0.27 mm²"
      },
      {
        "id": "g_i",
        "part": "(g)(i)",
        "text": "What other measurements do you take to determine the density of the material of the wire?",
        "marks": 2,
        "answer": "(1) Length (of the wire)\n(2) Mass (of the wire)"
      },
      {
        "id": "g_ii",
        "part": "(g)(ii)",
        "text": "Name the most appropriate measuring instruments needed to obtain the measurements mentioned in (g) (i) above.",
        "marks": 2,
        "answer": "(1) Meter ruler\n(2) Four beam balance OR (laboratory) electronic balance OR chemical balance"
      },
      {
        "id": "h",
        "part": "(h)",
        "text": "Figure (4) shows an electronic micrometer screw gauge used in industrial applications. What is the least count of this gauge in mm?",
        "marks": 1,
        "answer": "0.001 mm"
      }
    ],
    "tags": ["Micrometer Screw Gauge", "Density", "Error Analysis"],
    "title": "Micrometer Screw Gauge and Density 2024",
    "difficulty": "medium",
    "marks": 20,
    "practicalSearchTitle": "Usage of the micrometer screwgauge",
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2024,
      "paper": 1,
      "variant": "English",
      "questionNumber": 1
    }
  },
  {
    "questionNumber": "2",
    "mainQuestionText": "You are asked to determine the specific latent heat of vaporization (L) of water using the method of mixtures. Figure (1) shows an incomplete experimental setup. A rubber tube is used to take steam out. A well lagged copper calorimeter, water and a copper stirrer are also provided.",
    "subparts": [
      "(a)",
      "(i)",
      "Water has to be poured into the steam generator. Using a horizontal line, mark the appropriate level of water that must be filled inside the steam generator.",
      "(ii)",
      "A thermometer has to be inserted into the steam generator. Using a small cross (x) mark the appropriate position of the bulb of the thermometer that must be placed inside the steam generator.",
      "(iii)",
      "The accurately measured temperature of steam in this experiment is 99.0°C not 100.0°C. What can be the reason for this?",
      "(b)",
      "(i)",
      "Name the item that you use to avoid mixing condensed steam into water in the calorimeter.",
      "(ii)",
      "Draw the item mentioned in (b) (i) above in the appropriate place in figure (1) with the correct connection.",
      "(c)",
      "Two thermometers A and B are available for the experiment. The range of thermometer A: -10°C to 110°C. The range of thermometer B: -10°C to 60°C. Which thermometer must be used to measure temperature of water in the calorimeter?",
      "(d)",
      "What are the mass measurements that you would take in this experiment? Give them in order of measurements.",
      "(e)",
      "What are the experimental steps that you would take to measure the last temperature reading of water in this experiment?",
      "(f)",
      "The room temperature and the initial temperature of water are θ and θ₁ respectively. Write down an expression for the value of last temperature measurement θ₂ of water in terms of θ₁ and θ to minimize heat exchange with the surroundings.",
      "(g)",
      "(i)",
      "Is it possible to use a glass beaker instead of a copper calorimeter in this experiment?",
      "(ii)",
      "Give the reason for the above answer."
    ],
    "subQuestions": [
      {
        "id": "a_i",
        "part": "(a)(i)",
        "text": "Water has to be poured into the steam generator. Using a horizontal line, mark the appropriate level of water that must be filled inside the steam generator.",
        "marks": 2,
        "answer": "Any horizontal line between AB and CD"
      },
      {
        "id": "a_ii",
        "part": "(a)(ii)",
        "text": "A thermometer has to be inserted into the steam generator. Using a small cross (x) mark the appropriate position of the bulb of the thermometer that must be placed inside the steam generator.",
        "marks": 2,
        "answer": "Any indication of a cross above the drawn water level"
      },
      {
        "id": "a_iii",
        "part": "(a)(iii)",
        "text": "The accurately measured temperature of steam in this experiment is 99.0°C not 100.0°C. What can be the reason for this?",
        "marks": 2,
        "answer": "(The temperature of steam/boiling point of water) depends on atmospheric pressure/altitude/height (from sea level) OR the location of the experiment OR the location of the school"
      },
      {
        "id": "b_i",
        "part": "(b)(i)",
        "text": "Name the item that you use to avoid mixing condensed steam into water in the calorimeter.",
        "marks": 2,
        "answer": "A steam trap"
      },
      {
        "id": "b_ii",
        "part": "(b)(ii)",
        "text": "Draw the item mentioned in (b) (i) above in the appropriate place in figure (1) with the correct connection.",
        "marks": 3,
        "answer": "[01 mark for the correct diagram of steam trap; 01 mark for the correct connection to the rubber tube; 01 mark for lower end of the tube above the water level in the calorimeter]"
      },
      {
        "id": "c",
        "part": "(c)",
        "text": "Two thermometers A and B are available for the experiment. The range of thermometer A: -10°C to 110°C. The range of thermometer B: -10°C to 60°C. Which thermometer must be used to measure temperature of water in the calorimeter?",
        "marks": 1,
        "answer": "B OR temperature range (from -10°C to) 60°C"
      },
      {
        "id": "d",
        "part": "(d)",
        "text": "What are the mass measurements that you would take in this experiment? Give them in order of measurements.",
        "marks": 3,
        "answer": "(1) The mass of the empty calorimeter and stirrer/calorimeter with contents\n(2) The mass of the calorimeter, stirrer and water\n(3) The total/final mass of the system/mixture (after adding steam)"
      },
      {
        "id": "e",
        "part": "(e)",
        "text": "What are the experimental steps that you would take to measure the last temperature reading of water in this experiment?",
        "marks": 2,
        "answer": "(1) Stop passing steam into the water.\n(2) Stir well and record the highest/maximum temperature of the mixture."
      },
      {
        "id": "f",
        "part": "(f)",
        "text": "The room temperature and the initial temperature of water are θ and θ₁ respectively. Write down an expression for the value of last temperature measurement θ₂ of water in terms of θ₁ and θ to minimize heat exchange with the surroundings.",
        "marks": 1,
        "answer": "θ₂ = 2θ - θ₁"
      },
      {
        "id": "g_i",
        "part": "(g)(i)",
        "text": "Is it possible to use a glass beaker instead of a copper calorimeter in this experiment? Possible/Not possible (Underline the correct answer.)",
        "marks": 1,
        "answer": "Not possible"
      },
      {
        "id": "g_ii",
        "part": "(g)(ii)",
        "text": "Give the reason for the above answer.",
        "marks": 1,
        "answer": "The specific heat capacity of copper is very low/ The specific heat capacity of glass is higher compared to copper OR the absorption and liberation of heat will be more from a glass beaker compared to a copper calorimeter during the experiment OR the temperature will not be uniform on the walls of a glass beaker OR there will be a temperature gradient across the wall OR temperature of water will not be equal to the temperature of the glass beaker"
      }
    ],
    "tags": ["Latent Heat of Vaporization", "Calorimetry", "Method of Mixtures"],
    "title": "Latent Heat of Vaporization 2024",
    "difficulty": "medium",
    "marks": 20,
    "practicalSearchTitle": "Determination of the specific latent heat of vaporization of water by the method of mixtures",
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2024,
      "paper": 1,
      "variant": "English",
      "questionNumber": 2
    }
  },
  {
    "questionNumber": "3",
    "mainQuestionText": "You are required to determine the refractive index of material of a glass prism using a laboratory spectrometer.",
    "subparts": [
      "(a)",
      "Draw the path of a monochromatic ray incident on the surface AC undergoing minimum deviation through the prism shown in figure (1). Also mark the angle of incidence (i) and the angle of refraction (r) of the ray at the surface AC.",
      "(b)",
      "Mark the angle of minimum deviation (D) of the ray in the above figure (1).",
      "(c)",
      "Write down an expression for the refractive index (n) of material of prism in terms of angle of prism A and D.",
      "(d)",
      "Give the experimental steps needed for adjusting the telescope of the spectrometer.",
      "(e)",
      "A student argues that a beam of light from a bright filament bulb can be used for levelling the prism table. Do you agree? Give the reason.",
      "(f)",
      "After adjusting all the parts of the spectrometer how do you experimentally obtain the minimum deviation position for a monochromatic ray of light?",
      "(g)",
      "When the telescope is fixed to the minimum deviation position, the circular scale and the vernier scale positions are shown in figure (2). What is the reading of this position?",
      "(h)",
      "After removing the prism from the prism table, the direct reading of the telescope is measured as 104°55'. Find the value of D. The 360° mark of the circular scale has not crossed when taking measurements.",
      "(i)",
      "If the prism angle is A = 60°00', calculate the refractive index (n) of material of prism. (Use the natural sine table for your calculation.)"
    ],
    "subQuestions": [
      {
        "id": "a",
        "part": "(a)",
        "text": "Draw the path of a monochromatic ray incident on the surface AC undergoing minimum deviation through the prism shown in figure (1). Also mark the angle of incidence (i) and the angle of refraction (r) of the ray at the surface AC.",
        "marks": 2,
        "answer": "Path of a ray passing through the prism symmetrically (parallel to the surface CB) with at least drawing an arrow head (1 mark). Marking i and r on surface AC (1 mark)."
      },
      {
        "id": "b",
        "part": "(b)",
        "text": "Mark the angle of minimum deviation (D) of the ray in the above figure (1).",
        "marks": 1,
        "answer": "Marking the angle D correctly relative to the incident ray extension and emergent ray."
      },
      {
        "id": "c",
        "part": "(c)",
        "text": "Write down an expression for the refractive index (n) of material of prism in terms of angle of prism A and D.",
        "marks": 2,
        "answer": "n = sin((A+D)/2) / sin(A/2)"
      },
      {
        "id": "d",
        "part": "(d)",
        "text": "Give the experimental steps needed for adjusting the telescope of the spectrometer.",
        "marks": 2,
        "answer": "1. Move the eyepiece (back or forth) until a clear/sharp image of the cross-wires are clearly seen/observed through it.\n2. Direct the telescope on to a distant object and rotate the adjusting knob of the telescope until a clear image (with sharp edges) is seen."
      },
      {
        "id": "e",
        "part": "(e)",
        "text": "A student argues that a beam of light from a bright filament bulb can be used for levelling the prism table. Do you agree? Give the reason.",
        "marks": 2,
        "answer": "Yes/agree. Reason: Since reflection of light is used to level the prism table a bright filament bulb can be used."
      },
      {
        "id": "f",
        "part": "(f)",
        "text": "After adjusting all the parts of the spectrometer how do you experimentally obtain the minimum deviation position for a monochromatic ray of light?",
        "marks": 4,
        "answer": "1. Use a sodium lamp (OR mercury lamp).\n2. Keep the prism in the middle of the prism table so that the angle of incidence is small (about 10°).\n3. Rotate the prism table in the increasing direction of the angle of incidence while looking through the telescope.\n4. The position where the image of the slit (OR face of the collimator) returns/turns back is the minimum deviation position."
      },
      {
        "id": "g",
        "part": "(g)",
        "text": "When the telescope is fixed to the minimum deviation position, the circular scale and the vernier scale positions are shown in figure (2). What is the reading of this position?",
        "marks": 2,
        "answer": "144°15'"
      },
      {
        "id": "h",
        "part": "(h)",
        "text": "After removing the prism from the prism table, the direct reading of the telescope is measured as 104°55'. Find the value of D. The 360° mark of the circular scale has not crossed when taking measurements.",
        "marks": 2,
        "answer": "D = 144°15' - 104°55' = 39°20'"
      },
      {
        "id": "i",
        "part": "(i)",
        "text": "If the prism angle is A = 60°00', calculate the refractive index (n) of material of prism. (Use the natural sine table for your calculation.)",
        "marks": 3,
        "answer": "(D+A)/2 = (39°20' + 60°00')/2 = 49°40'\nn = sin(49°40') / sin(30°) = 1.52 (Accept 1.51 - 1.53)"
      }
    ],
    "tags": ["Spectrometer", "Refractive Index", "Prism", "Minimum Deviation"],
    "title": "Refractive Index of a Prism 2024",
    "difficulty": "medium",
    "marks": 20,
    "practicalSearchTitle": "Determination of the angle of minimum deviation of a prism and the refractive index of the material of the prism using the spectrometer",
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2024,
      "paper": 1,
      "variant": "English",
      "questionNumber": 3
    }
  },
  {
    "questionNumber": "4",
    "mainQuestionText": "Figure (1) shows an experimental setup that can be used to determine the temperature coefficient of resistance (α) of material of a thin wire using a metre bridge. An electrically insulated uniform wire of length 5.0 m and diameter 0.1 mm, is wound around a cylindrical piece of plastic rod to make a coil. The resistivity of the material of the wire is 1.5 × 10⁻⁸ Ω m at 30°C. A suitable resistance S is connected across the left gap of the bridge.",
    "subparts": [
      "(a)",
      "Find the resistance of the coil of wire at 30°C. (Take π = 3.)",
      "(b)",
      "What is the measuring instrument labelled as 'Y' in figure (1)?",
      "(c)",
      "(i)",
      "In the space given below, draw a diagram of the circuit that should be connected across the gap 'X' in figure (1).",
      "(ii)",
      "What is the purpose of the circuit that you have drawn in (c) (i) above?",
      "(d)",
      "Copper wires have to be used to connect the coil of wire to the metre bridge. What type of wires are suitable for this?",
      "(e)",
      "What are the other essential instrument and item needed in this experiment?",
      "(f)",
      "(i)",
      "If the resistance of the coil at a given temperature θ(°C) is R_θ, the corresponding balance length of the metre bridge wire is l (cm), write down an expression for R_θ/S in terms of l. Neglect end corrections of the metre bridge wire.",
      "(ii)",
      "Write down an expression for the resistance R_θ in terms of α, the resistance R₀ at θ = 0°C and θ.",
      "(iii)",
      "By combining expressions written in (f) (i) and (ii) above, obtain an expression needed to draw the straight line graph of (100/l - 1) versus θ.",
      "(iv)",
      "Using the parameters of the expression written in (f) (iii) above, write down expressions for the gradient (m) and intercept (c) of the graph.",
      "(v)",
      "Write down an expression for α in terms of m and c.",
      "(g)",
      "Calculate α using the graph shown in figure (2)."
    ],
    "subQuestions": [
      {
        "id": "a",
        "part": "(a)",
        "text": "Find the resistance of the coil of wire at 30°C. (Take π = 3.)",
        "marks": 3,
        "answer": "R = ρ * l / A = 1.5 × 10^-8 * 5 / (π * (0.0001 / 2)^2) = 10.0 Ω"
      },
      {
        "id": "b",
        "part": "(b)",
        "text": "What is the measuring instrument labelled as 'Y' in figure (1)?",
        "marks": 1,
        "answer": "Center zero galvanometer"
      },
      {
        "id": "c_i",
        "part": "(c)(i)",
        "text": "In the space given below, draw a diagram of the circuit that should be connected across the gap 'X' in figure (1).",
        "marks": 1,
        "answer": "[A high resistance resistor connected in parallel with a switch/plug key]"
      },
      {
        "id": "c_ii",
        "part": "(c)(ii)",
        "text": "What is the purpose of the circuit that you have drawn in (c) (i) above?",
        "marks": 1,
        "answer": "To protect the galvanometer (from high currents) OR to avoid passing high currents through the galvanometer OR to prevent burning of the galvanometer."
      },
      {
        "id": "d",
        "part": "(d)",
        "text": "Copper wires have to be used to connect the coil of wire to the metre bridge. What type of wires are suitable for this?",
        "marks": 2,
        "answer": "Short length (1 mark) and Large cross sectional area/thick wires (1 mark)."
      },
      {
        "id": "e",
        "part": "(e)",
        "text": "What are the other essential instrument and item needed in this experiment?",
        "marks": 2,
        "answer": "Instrument: Thermometer (1 mark)\nItem: Stirrer (1 mark)"
      },
      {
        "id": "f_i",
        "part": "(f)(i)",
        "text": "If the resistance of the coil at a given temperature θ(°C) is R_θ, the corresponding balance length of the metre bridge wire is l (cm), write down an expression for R_θ/S in terms of l. Neglect end corrections of the metre bridge wire.",
        "marks": 1,
        "answer": "R_θ / S = (100 - l) / l"
      },
      {
        "id": "f_ii",
        "part": "(f)(ii)",
        "text": "Write down an expression for the resistance R_θ in terms of α, the resistance R₀ at θ = 0°C and θ.",
        "marks": 1,
        "answer": "R_θ = R₀(1 + αθ)"
      },
      {
        "id": "f_iii",
        "part": "(f)(iii)",
        "text": "By combining expressions written in (f) (i) and (ii) above, obtain an expression needed to draw the straight line graph of (100/l - 1) versus θ.",
        "marks": 1,
        "answer": "100/l - 1 = (R₀α / S)θ + R₀ / S"
      },
      {
        "id": "f_iv",
        "part": "(f)(iv)",
        "text": "Using the parameters of the expression written in (f) (iii) above, write down expressions for the gradient (m) and intercept (c) of the graph.",
        "marks": 2,
        "answer": "m = α * R₀ / S\nc = R₀ / S"
      },
      {
        "id": "f_v",
        "part": "(f)(v)",
        "text": "Write down an expression for α in terms of m and c.",
        "marks": 1,
        "answer": "α = m / c"
      },
      {
        "id": "g",
        "part": "(g)",
        "text": "Calculate α using the graph shown in figure (2).",
        "marks": 5,
        "answer": "Selecting points: (29, 0.88) and (69, 1.06)\nGradient (m) = (1.06 - 0.88) / (69 - 29) = 0.18 / 40\nIntercept (c) = 0.75\nα = (0.18 / 40) / 0.75 = 6.0 × 10⁻³ °C⁻¹ (0.006 °C⁻¹)"
      }
    ],
    "tags": ["Metre Bridge", "Temperature Coefficient of Resistance", "Current Electricity"],
    "title": "Temperature Coefficient of Resistance 2024",
    "difficulty": "medium",
    "marks": 20,
    "practicalSearchTitle": "Determination of temperature coefficient of resistance of a metal (Cu) using the Metre Bridge",
    "source": {
      "type": "past_paper",
      "exam": "GCE Advanced Level",
      "subject": "Physics",
      "year": 2024,
      "paper": 1,
      "variant": "English",
      "questionNumber": 4
    }
  }
];

async function uploadQuestions() {
  if (!mongodbUri) {
    console.error('Missing MONGODB_URI in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB successfully!');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is undefined');
    }
    const questionsCollection = db.collection('questions');

    // 1. Delete existing GCE Advanced Level Physics 2024 questions to avoid duplicates
    const deleteResult = await questionsCollection.deleteMany({
      "source.year": 2024,
      "source.exam": "GCE Advanced Level",
      "source.subject": "Physics",
      "medium": "English"
    });
    console.log(`Deleted ${deleteResult.deletedCount} existing 2024 English GCE AL physics questions.`);

    const questionsToInsert = [];

    for (const qData of questionsData) {
      // Find the corresponding practical in English medium
      const practical = await Practical.findOne({
        title: qData.practicalSearchTitle,
        medium: 'English'
      });

      if (!practical) {
        console.error(`ERROR: Practical titled "${qData.practicalSearchTitle}" in English was not found in the database.`);
        console.log('Skipping this question. Please ensure your practicals are fully seeded.');
        continue;
      }

      console.log(`Matched question "${qData.title}" to Practical "${practical.title}" (ID: ${practical._id})`);

      // Build marking scheme and answers formats from the subQuestions
      const markingScheme = qData.subQuestions.map(sq => ({
        subQuestionId: sq.id,
        answer: sq.answer
      }));

      const answers = qData.subQuestions.map(sq => ({
        subQuestionId: sq.id,
        latex: '' // Default latex representation
      }));

      // Construct the database document
      const doc = {
        practicalId: practical._id,
        questionNumber: qData.questionNumber,
        title: qData.title,
        source: qData.source,
        tags: qData.tags,
        difficulty: qData.difficulty,
        mainQuestionText: qData.mainQuestionText,
        figures: [], // Ready for images
        answer: "", // Main answer if any
        subQuestions: qData.subQuestions,
        markingScheme: markingScheme,
        answers: answers,
        medium: "English",
        type: "past",
        subparts: qData.subparts, // Safe native mongo insertion includes this custom field
        marks: qData.marks,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      questionsToInsert.push(doc);
    }

    if (questionsToInsert.length > 0) {
      const insertResult = await questionsCollection.insertMany(questionsToInsert);
      console.log(`Successfully uploaded ${insertResult.insertedCount} questions to the database.`);
      
      // Let's verify by printing inserted documents
      const inserted = await questionsCollection.find({ "source.year": 2024 }).toArray();
      console.log('\nUploaded questions verified in DB:');
      inserted.forEach((q: any) => {
        console.log(`- Q${q.questionNumber}: "${q.title}" (ID: ${q._id}) linked to practical ID: ${q.practicalId}`);
      });
    } else {
      console.log('No new questions were uploaded.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error during questions upload:', error);
    process.exit(1);
  }
}

uploadQuestions();
