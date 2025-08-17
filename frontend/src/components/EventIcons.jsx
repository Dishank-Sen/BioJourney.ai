import React from 'react';

// 1. Import images with distinct variable names (e.g., adding 'Src')
import exerciseIconSrc from "../assets/exercise.png";
import allergyIconSrc from "../assets/allergies.png";
import dietIconSrc from "../assets/dietary_preference.png";
import diseaseIconSrc from "../assets/disease.png";
import healthIconSrc from "../assets/health_change.png";
import injuryIconSrc from "../assets/injury.png";
import medicationIconSrc from "../assets/medication.png";
import mobilityIconSrc from "../assets/mobility_rehab.png";
import progressIconSrc from "../assets/progress.png";
import defaultIconSrc from "../assets/default.png";
import testResultSrc from "../assets/test_result.png";


// 2. Define components with PascalCase names and use the correct image variable


export const DefaultIcon = () => (
  <img src={defaultIconSrc} alt="Diet Icon" className="w-6 h-6" />
);

export const TestIcon = () => (
  <img src={testResultSrc} alt="Diet Icon" className="w-6 h-6" />
);

export const DietIcon = () => (
  <img src={dietIconSrc} alt="Diet Icon" className="w-6 h-6" />
);

export const MedicationIcon = () => (
  <img src={medicationIconSrc} alt="Medication Icon" className="w-6 h-6" />
);

export const ExerciseIcon = () => (
  <img src={exerciseIconSrc} alt="Exercise Icon" className="w-6 h-6" />
);

export const AllergyIcon = () => (
  <img src={allergyIconSrc} alt="Allergy Icon" className="w-6 h-6" />
);

export const DiseaseIcon = () => (
  <img src={diseaseIconSrc} alt="Disease Icon" className="w-6 h-6" />
);

export const HealthIcon = () => (
  <img src={healthIconSrc} alt="Health Change Icon" className="w-6 h-6" />
);

export const InjuryIcon = () => (
  <img src={injuryIconSrc} alt="Injury Icon" className="w-6 h-6" />
);

export const MobilityIcon = () => (
  <img src={mobilityIconSrc} alt="Mobility/Rehab Icon" className="w-6 h-6" />
);

export const ProgressIcon = () => (
  <img src={progressIconSrc} alt="Progress Icon" className="w-6 h-6" />
);