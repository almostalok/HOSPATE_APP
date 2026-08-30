export interface BiomarkerDefinition {
  canonicalName: string;
  category: 'Hematology' | 'Lipid' | 'Metabolic' | 'Vitamin' | 'Thyroid' | 'Renal' | 'Hepatic' | 'Electrolytes' | 'Other';
  aliases: string[];
  standardUnit: string;
  defaultLow: number;
  defaultHigh: number;
  dangerLow?: number;
  dangerHigh?: number;
  description: string;
  clinicalSignificance: {
    low: string;
    high: string;
    normal: string;
  };
}

export const BIOMARKER_DICTIONARY: BiomarkerDefinition[] = [
  // Hematology
  {
    canonicalName: 'Hemoglobin',
    category: 'Hematology',
    aliases: ['hb', 'hgb', 'haemoglobin', 'hemoglobin total', 'blood hemoglobin'],
    standardUnit: 'g/dL',
    defaultLow: 13.0,
    defaultHigh: 17.0,
    dangerLow: 9.0,
    dangerHigh: 19.0,
    description: 'Iron-containing oxygen-transport protein in red blood cells.',
    clinicalSignificance: {
      low: 'Below reference range; may indicate anemia, iron deficiency, or blood loss.',
      high: 'Above reference range; may indicate dehydration, chronic hypoxia, or polycythemia.',
      normal: 'Within optimal oxygen-carrying reference range.'
    }
  },
  {
    canonicalName: 'Total WBC Count',
    category: 'Hematology',
    aliases: ['wbc', 'white blood cells', 'leukocyte count', 'total leukocyte count', 'tlc'],
    standardUnit: 'cells/mcL',
    defaultLow: 4500,
    defaultHigh: 11000,
    dangerLow: 2500,
    dangerHigh: 20000,
    description: 'Total count of infection-fighting white blood cells.',
    clinicalSignificance: {
      low: 'Low leukocyte count; may suggest immune suppression or viral infection.',
      high: 'Elevated leukocyte count; often response to infection, inflammation, or physical stress.',
      normal: 'Within normal immune defense reference range.'
    }
  },
  {
    canonicalName: 'Platelet Count',
    category: 'Hematology',
    aliases: ['platelets', 'plt', 'thrombocyte count', 'platelet'],
    standardUnit: '10^3/mcL',
    defaultLow: 150,
    defaultHigh: 450,
    dangerLow: 50,
    dangerHigh: 600,
    description: 'Blood cells essential for normal blood clotting and vessel repair.',
    clinicalSignificance: {
      low: 'Thrombocytopenia; increased risk of bruising or bleeding.',
      high: 'Thrombocytosis; may be reactive to inflammation or marrow activity.',
      normal: 'Adequate clotting capacity within reference limits.'
    }
  },

  // Lipid Profile
  {
    canonicalName: 'Total Cholesterol',
    category: 'Lipid',
    aliases: ['cholesterol', 'total cholesterol', 'chol', 'serum cholesterol'],
    standardUnit: 'mg/dL',
    defaultLow: 125,
    defaultHigh: 200,
    dangerHigh: 240,
    description: 'Overall measure of circulating fats and sterols.',
    clinicalSignificance: {
      low: 'Low cholesterol level; rarely of clinical concern unless severely malnourished.',
      high: 'Elevated total cholesterol; may contribute to atherosclerotic cardiovascular risk.',
      normal: 'Desirable circulating lipid profile.'
    }
  },
  {
    canonicalName: 'LDL Cholesterol',
    category: 'Lipid',
    aliases: ['ldl', 'ldl-c', 'low density lipoprotein', 'bad cholesterol', 'ldl cholesterol (calculated)'],
    standardUnit: 'mg/dL',
    defaultLow: 0,
    defaultHigh: 100,
    dangerHigh: 160,
    description: 'Low-density lipoprotein often linked to arterial plaque buildup.',
    clinicalSignificance: {
      low: 'Optimal low-density lipoprotein levels.',
      high: 'Above recommended reference range; dietary modifications or clinical review recommended.',
      normal: 'Optimal lipid level within protective cardiovascular threshold.'
    }
  },
  {
    canonicalName: 'HDL Cholesterol',
    category: 'Lipid',
    aliases: ['hdl', 'hdl-c', 'high density lipoprotein', 'good cholesterol'],
    standardUnit: 'mg/dL',
    defaultLow: 40,
    defaultHigh: 60,
    dangerLow: 30,
    description: 'High-density lipoprotein that helps scavenge cholesterol from arteries.',
    clinicalSignificance: {
      low: 'Below protective reference threshold; regular aerobic exercise and healthy fats can help elevate HDL.',
      high: 'Protective cardiovascular profile.',
      normal: 'Normal protective lipid levels.'
    }
  },
  {
    canonicalName: 'Triglycerides',
    category: 'Lipid',
    aliases: ['triglyceride', 'tg', 'trigs', 'serum triglycerides'],
    standardUnit: 'mg/dL',
    defaultLow: 0,
    defaultHigh: 150,
    dangerHigh: 250,
    description: 'Main form of stored fat in the body from dietary calories.',
    clinicalSignificance: {
      low: 'Normal low triglyceride concentration.',
      high: 'Elevated levels; associated with refined carb intake, metabolic syndrome or sedentary lifestyle.',
      normal: 'Desirable fasting triglyceride levels.'
    }
  },

  // Vitamins & Minerals
  {
    canonicalName: 'Vitamin D (25-OH)',
    category: 'Vitamin',
    aliases: ['vitamin d', 'vit d', '25-hydroxy vitamin d', '25-oh vitamin d', 'calcidiol', 'cholecalciferol'],
    standardUnit: 'ng/mL',
    defaultLow: 30,
    defaultHigh: 100,
    dangerLow: 15,
    dangerHigh: 150,
    description: 'Fat-soluble secosteroid vital for calcium absorption, bone health, and immunity.',
    clinicalSignificance: {
      low: 'Below reference range; very common with low sun exposure; supplementation often beneficial upon doctor review.',
      high: 'Elevated vitamin D; check for excessive high-dose supplementation.',
      normal: 'Sufficient vitamin D levels for bone and immune support.'
    }
  },
  {
    canonicalName: 'Vitamin B12',
    category: 'Vitamin',
    aliases: ['vitamin b12', 'vit b12', 'cobalamin', 'b12', 'cyanocobalamin'],
    standardUnit: 'pg/mL',
    defaultLow: 200,
    defaultHigh: 900,
    dangerLow: 150,
    description: 'Crucial cofactor for nerve function, DNA synthesis, and red blood cell generation.',
    clinicalSignificance: {
      low: 'Below reference range; common in vegetarian/vegan diets or malabsorption.',
      high: 'Elevated B12; usually harmless from supplements.',
      normal: 'Optimal circulating B12 levels.'
    }
  },

  // Metabolic & Glycemic
  {
    canonicalName: 'Fasting Blood Glucose',
    category: 'Metabolic',
    aliases: ['glucose', 'blood sugar', 'fasting glucose', 'fbs', 'blood sugar fasting'],
    standardUnit: 'mg/dL',
    defaultLow: 70,
    defaultHigh: 99,
    dangerLow: 55,
    dangerHigh: 126,
    description: 'Concentration of glucose in the blood after an overnight fast.',
    clinicalSignificance: {
      low: 'Hypoglycemia; may cause shakiness or dizziness.',
      high: 'Impaired fasting glucose; worth discussing with your physician regarding glycemic control.',
      normal: 'Normal fasting glycemic baseline.'
    }
  },
  {
    canonicalName: 'HbA1c',
    category: 'Metabolic',
    aliases: ['hba1c', 'glycated hemoglobin', 'glycosylated hemoglobin', 'a1c'],
    standardUnit: '%',
    defaultLow: 4.0,
    defaultHigh: 5.6,
    dangerHigh: 6.5,
    description: 'Average blood sugar control over the past 2 to 3 months.',
    clinicalSignificance: {
      low: 'Normal or low glycated fraction.',
      high: 'Prediabetic or diabetic range; dietary moderation and clinical consultation recommended.',
      normal: 'Healthy long-term glucose management.'
    }
  },

  // Renal & Hepatic
  {
    canonicalName: 'Serum Creatinine',
    category: 'Renal',
    aliases: ['creatinine', 'serum creatinine', 'creat', 'cr'],
    standardUnit: 'mg/dL',
    defaultLow: 0.6,
    defaultHigh: 1.2,
    dangerHigh: 2.0,
    description: 'Waste product produced by muscle metabolism, filtered out by healthy kidneys.',
    clinicalSignificance: {
      low: 'Low creatinine; often relates to lower muscle mass.',
      high: 'Elevated creatinine; may reflect reduced glomerular filtration or dehydration.',
      normal: 'Normal renal clearance indicator.'
    }
  },
  {
    canonicalName: 'TSH',
    category: 'Thyroid',
    aliases: ['tsh', 'thyroid stimulating hormone', 'ultra sensitive tsh', 'serum tsh'],
    standardUnit: 'uIU/mL',
    defaultLow: 0.4,
    defaultHigh: 4.5,
    dangerLow: 0.1,
    dangerHigh: 10.0,
    description: 'Pituitary hormone regulating thyroid hormone production.',
    clinicalSignificance: {
      low: 'Suppressed TSH; may indicate hyperthyroid activity.',
      high: 'Elevated TSH; may indicate sluggish thyroid (hypothyroidism).',
      normal: 'Euthyroid balanced regulation.'
    }
  },
  {
    canonicalName: 'SGPT / ALT',
    category: 'Hepatic',
    aliases: ['alt', 'sgpt', 'alanine aminotransferase', 'alanine transaminase'],
    standardUnit: 'U/L',
    defaultLow: 7,
    defaultHigh: 45,
    dangerHigh: 90,
    description: 'Liver enzyme released when liver cells experience stress or inflammation.',
    clinicalSignificance: {
      low: 'Normal baseline.',
      high: 'Elevated ALT; may indicate hepatic irritation, fatty liver, or medication stress.',
      normal: 'Normal liver cell enzyme integrity.'
    }
  }
];
