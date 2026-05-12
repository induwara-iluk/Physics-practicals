export type PracticalCategory = 'Q1) Mechanics and Properties of Matter' | 'Q2) Heat' | 'Q3) Waves and Optics' | 'Q4) Electricity and Electronics';

export interface PracticalItem {
  title: string;
  category: PracticalCategory;
}

export const practicalsList: PracticalItem[] = [
  { title: "Usage of the vernier callipers", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Usage of the micrometer screwgauge", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Usage of the spherometer", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Usage of the travelling microscope", category: "Q3) Waves and Optics" },
  { title: "Verification of the law of parallelogram of forces and using it to determine the mass of a body", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the mass of a body using the principle of moments", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the relative density of a liquid using the U tube", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the relative density of a liquid using Hare’s apparatus", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the density of a liquid using a weighted test tube", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the acceleration due to gravity using the simple pendulum", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Verification of the relationship between the mass of a body suspended from a helix spring and its period of oscillation", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the frequency of a tuning fork using the sonometer", category: "Q3) Waves and Optics" },
  { title: "Verification of the relationship between the frequency of a stretched string and its vibrating length using the sonometer", category: "Q3) Waves and Optics" },
  { title: "Determination of the velocity of sound using a closed resonance tube and a tuning fork and also determination of the end correction of the tube", category: "Q3) Waves and Optics" },
  { title: "Determination of the velocity of sound in air using a closed resonance tube and a set of tuning forks and also determination of the end correction of the tube", category: "Q3) Waves and Optics" },
  { title: "Determination of the refractive index of glass using the travelling microscope and a block of glass", category: "Q3) Waves and Optics" },
  { title: "Determination of the angle of minimum deviation of a prism by observing the variation of deviation in a ray caused by the prism", category: "Q3) Waves and Optics" },
  { title: "Determination of the refractive index of the material of a prism by the critical angle method", category: "Q3) Waves and Optics" },
  { title: "Adjustment of a spectometer and using it for determination of the refracting angle of a prism", category: "Q3) Waves and Optics" },
  { title: "Determination of the angle of minimum deviation of a prism and the refractive index of the material of the prism using the spectrometer", category: "Q3) Waves and Optics" },
  { title: "Location of the images formed by a convex lens by the method of no-parallax and hence determination of the focal length of the lens", category: "Q3) Waves and Optics" },
  { title: "Location of the images formed by concave lens by the method of no-parallax and hence determination of the focal length of the lens", category: "Q3) Waves and Optics" },
  { title: "Determination of the atmospheric pressure using the quill tube", category: "Q2) Heat" },
  { title: "Verification of the relationship between the volume and the temperature of a gas at constant pressure", category: "Q2) Heat" },
  { title: "To verify the relationship between the pressure and the absolute temperature of a gas at constant level", category: "Q2) Heat" },
  { title: "Determination of the specific heat capacity of a solid substance by the method of mixtures", category: "Q2) Heat" },
  { title: "Determination of the specific heat capacity of a liquid by the method of cooling", category: "Q2) Heat" },
  { title: "Determination of specific latent heat of fusion of ice by the method of mixtures", category: "Q2) Heat" },
  { title: "Determination of the specific latent heat of vaporization of water by the method of mixtures", category: "Q2) Heat" },
  { title: "Determination of relative humidity of air using a polished calorimeter", category: "Q2) Heat" },
  { title: "Determination of the thermal conductivity of a metal by Searle’s method", category: "Q2) Heat" },
  { title: "Determination of the internal resistance and the electromotive force of a dry cell", category: "Q4) Electricity and Electronics" },
  { title: "Determination of temperature coefficient of resistance of a metal (Cu) using the Metre Bridge", category: "Q4) Electricity and Electronics" },
  { title: "Comparison of electromotive forces of two cells using the potentiometer", category: "Q4) Electricity and Electronics" },
  { title: "Determination of the internal resistance of a cell using the potentiometer", category: "Q4) Electricity and Electronics" },
  { title: "Construction of the I-V curve for a forward biased semiconductor diode", category: "Q4) Electricity and Electronics" },
  { title: "Construction of the transfer characteristic curve between IB and IC of a transistor in common emitter configuration", category: "Q4) Electricity and Electronics" },
  { title: "Experimental investigation of the truth tables of simple fundamental logic gates and hence identification of the given gates", category: "Q4) Electricity and Electronics" },
  { title: "Determination of the Young’s modulus of a metal (steel) in the form of a wire", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the coefficient of viscosity of a liquid (water) by capillary flow method using Poiseuill’s formula", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the surface tension of water using a microscope slide", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the surface tension of water by capillary rise method", category: "Q1) Mechanics and Properties of Matter" },
  { title: "Determination of the surface tension of a liquid by Jaeger’s method", category: "Q1) Mechanics and Properties of Matter" }
];

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
