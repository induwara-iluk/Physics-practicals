import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const PracticalSchema = new mongoose.Schema({
  title: String,
  slug: String,
  practicalNumber: Number,
  difficulty: String,
  medium: String,
});

const Practical = mongoose.models.Practical || mongoose.model('Practical', PracticalSchema);

const practicalData = [
  { n: 1, title: "Usage of the vernier callipers", diff: "Easy" },
  { n: 2, title: "Usage of the micrometer screwgauge", diff: "Easy" },
  { n: 3, title: "Usage of the spherometer", diff: "Easy" },
  { n: 4, title: "Usage of the travelling microscope", diff: "Medium" },
  { n: 5, title: "Verification of the law of parallelogram of forces", diff: "Medium" },
  { n: 6, title: "Determination of the mass of a body using the principle of moments", diff: "Easy" },
  { n: 7, title: "Determination of the relative density of a liquid using the U tube", diff: "Medium" },
  { n: 8, title: "Determination of the relative density of a liquid using Hare’s apparatus", diff: "Medium" },
  { n: 9, title: "Determination of the density of a liquid using a weighted test tube", diff: "Easy" },
  { n: 10, title: "Determination of the acceleration due to gravity using the simple pendulum", diff: "Easy" },
  { n: 11, title: "Verification of the relationship between the mass of a body suspended from a helix spring", diff: "Medium" },
  { n: 12, title: "Determination of the frequency of a tuning fork using the sonometer", diff: "Medium" },
  { n: 13, title: "Verification of the relationship between the frequency of a stretched string", diff: "Medium" },
  { n: 14, title: "Determination of the velocity of sound using a closed resonance tube", diff: "Hard" },
  { n: 15, title: "Determination of the velocity of sound in air", diff: "Hard" },
  { n: 16, title: "Determination of the refractive index of glass", diff: "Medium" },
  { n: 17, title: "Determination of the angle of minimum deviation of a prism", diff: "Hard" },
  { n: 18, title: "Determination of the refractive index of the material of a prism", diff: "Hard" },
  { n: 19, title: "Adjustment of a spectometer", diff: "Hard" },
  { n: 20, title: "Determination of the angle of minimum deviation of a prism and the refractive index", diff: "Hard" },
  { n: 21.1, title: "Location of the images formed by a convex lens", diff: "Medium" },
  { n: 21.2, title: "Location of the images formed by concave lens", diff: "Hard" },
  { n: 22, title: "Determination of the atmospheric pressure using the quill tube", diff: "Medium" },
  { n: 23, title: "Verification of the relationship between the volume and the temperature", diff: "Medium" },
  { n: 24, title: "To verify the relationship between the pressure and the absolute temperature", diff: "Medium" },
  { n: 25, title: "Determination of the specific heat capacity of a solid substance", diff: "Medium" },
  { n: 26, title: "Determination of the specific heat capacity of a liquid by the method of cooling", diff: "Hard" },
  { n: 27, title: "Determination of specific latent heat of fusion of ice", diff: "Medium" },
  { n: 28, title: "Determination of the specific latent heat of vaporization of water", diff: "Hard" },
  { n: 29, title: "Determination of relative humidity of air", diff: "Hard" },
  { n: 30, title: "Determination of the thermal conductivity of a metal by Searle’s method", diff: "Hard" },
  { n: 31, title: "Determination of the internal resistance and the electromotive force of a dry cell", diff: "Medium" },
  { n: 32, title: "Determination of temperature coefficient of resistance of a metal (Cu)", diff: "Hard" },
  { n: 33, title: "Comparison of electromotive forces of two cells using the potentiometer", diff: "Medium" },
  { n: 34, title: "Determination of the internal resistance of a cell using the potentiometer", diff: "Hard" },
  { n: 35, title: "Construction of the I-V curve for a forward biased semiconductor diode", diff: "Medium" },
  { n: 36, title: "Construction of the transfer characteristic curve between IB and IC", diff: "Hard" },
  { n: 37, title: "Experimental investigation of the truth tables of simple fundamental logic gates", diff: "Easy" },
  { n: 38, title: "Determination of the Young’s modulus of a metal", diff: "Hard" },
  { n: 39, title: "Determination of the coefficient of viscosity of a liquid", diff: "Hard" },
  { n: 40, title: "Determination of the surface tension of water using a microscope slide", diff: "Medium" },
  { n: 41, title: "Determination of the surface tension of water by capillary rise method", diff: "Medium" },
  { n: 42, title: "Determination of the surface tension of a liquid by Jaeger’s method", diff: "Hard" },
];

async function updatePracticals() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const allPracticals = await Practical.find({});
    
    // Step 1: Update English practicals first to establish the baseline
    console.log('Updating English baseline...');
    const englishMap = new Map();

    for (const p of allPracticals.filter(x => x.medium !== 'Sinhala')) {
      const match = practicalData.find(pd => 
        p.title.toLowerCase().includes(pd.title.toLowerCase()) || 
        pd.title.toLowerCase().includes(p.title.toLowerCase())
      );

      if (match) {
        await Practical.findByIdAndUpdate(p._id, {
          practicalNumber: match.n,
          difficulty: match.diff
        });
        englishMap.set(p.slug, { n: match.n, diff: match.diff });
      }
    }

    // Step 2: Update Sinhala practicals by matching slugs with English counterparts
    console.log('Updating Sinhala practicals via slug mapping...');
    let sinhalaCount = 0;
    for (const p of allPracticals.filter(x => x.medium === 'Sinhala')) {
      const baseSlug = p.slug.replace('-sinhala', '');
      const match = englishMap.get(baseSlug);
      
      if (match) {
        await Practical.findByIdAndUpdate(p._id, {
          practicalNumber: match.n,
          difficulty: match.diff
        });
        sinhalaCount++;
      } else {
        // Fallback: search by partial slug
        const partialMatchKey = Array.from(englishMap.keys()).find(k => p.slug.startsWith(k));
        if (partialMatchKey) {
            const m = englishMap.get(partialMatchKey);
            await Practical.findByIdAndUpdate(p._id, {
                practicalNumber: m.n,
                difficulty: m.diff
            });
            sinhalaCount++;
        }
      }
    }

    console.log(`Finished. Updated Sinhala practicals: ${sinhalaCount}`);
  } catch (error) {
    console.error('Error during update:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updatePracticals();
