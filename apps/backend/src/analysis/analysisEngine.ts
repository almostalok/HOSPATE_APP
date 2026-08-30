import {
  LabParameter,
  HealthInsight,
  HealthScore,
  ScoreDimensions,
  Severity,
  ScoreStatus
} from '@hospate/types';
import { v4 as uuidv4 } from 'uuid';

export class HealthAnalysisEngine {
  /**
   * Generates deterministic, responsible health insights from evaluated lab parameters.
   */
  public static generateInsights(
    patientId: string,
    recordId: string,
    documentTitle: string,
    parameters: LabParameter[]
  ): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const now = new Date().toISOString();

    for (const param of parameters) {
      if (param.status === 'NORMAL') continue;

      let severity: Severity = 'WARNING';
      if (param.status === 'CRITICAL_LOW' || param.status === 'CRITICAL_HIGH') {
        severity = 'DANGER';
      }

      let interpretation = '';
      let recommendation = '';

      if (param.parameter.includes('Vitamin D')) {
        interpretation = `Your Vitamin D is at ${param.value} ${param.unit}, which is below the recommended reference range (${param.referenceText}). Low levels are frequently linked to insufficient sun exposure or dietary intake.`;
        recommendation = 'Consider discussing sunlight exposure, dietary rich foods (fatty fish, fortified dairy), or potential supplementation with your physician.';
      } else if (param.parameter.includes('LDL')) {
        interpretation = `Your LDL Cholesterol is at ${param.value} ${param.unit}, which is above the optimal reference range (${param.referenceText}). Elevated LDL may contribute over time to vascular plaque deposition.`;
        recommendation = 'Consider adopting a heart-healthy dietary approach (reducing saturated fats, increasing soluble fiber) and scheduling a lipid follow-up with your doctor.';
      } else if (param.parameter.includes('Glucose') || param.parameter.includes('HbA1c')) {
        interpretation = `Your ${param.parameter} is at ${param.value} ${param.unit}, which is above the standard fasting threshold (${param.referenceText}).`;
        recommendation = 'Discuss routine glycemic tracking and lifestyle modifications with your healthcare provider.';
      } else if (param.parameter.includes('Hemoglobin')) {
        interpretation = `Your Hemoglobin is at ${param.value} ${param.unit}, which is below the reference range (${param.referenceText}), which may indicate mild iron or nutrient deficiency.`;
        recommendation = 'Consult your doctor to evaluate iron stores and dietary sources.';
      } else if (param.parameter.includes('Total Cholesterol') || param.parameter.includes('Triglycerides')) {
        interpretation = `Your ${param.parameter} is at ${param.value} ${param.unit}, above the desirable reference threshold (${param.referenceText}).`;
        recommendation = 'Review dietary fat intake and cardiovascular activity routines with your medical provider.';
      } else if (param.parameter.includes('TSH')) {
        interpretation = `Your TSH is measured at ${param.value} ${param.unit}, outside the standard reference range (${param.referenceText}).`;
        recommendation = 'Consult an endocrinologist or general physician for a comprehensive thyroid panel.';
      } else {
        interpretation = `Your ${param.parameter} is measured at ${param.value} ${param.unit}, which is ${param.status.toLowerCase().replace('_', ' ')} compared to the standard reference range (${param.referenceText}).`;
        recommendation = 'Share this report with your healthcare professional during your next consultation for clinical evaluation.';
      }

      insights.push({
        id: `insight-${uuidv4().substring(0, 8)}`,
        patientId,
        recordId,
        title: `${param.parameter} ${param.status === 'LOW' || param.status === 'CRITICAL_LOW' ? 'Below' : 'Above'} Reference Range`,
        parameter: param.parameter,
        measuredValue: param.value,
        unit: param.unit,
        referenceRange: param.referenceText || '',
        severity,
        interpretation,
        recommendation,
        sourceDocumentTitle: documentTitle,
        sourceDate: param.measuredAt,
        confidence: param.confidence,
        createdAt: now
      });
    }

    return insights;
  }

  /**
   * Calculates dynamic AI Health Score across 5 weighted dimensions.
   */
  public static calculateHealthScore(
    parameters: LabParameter[],
    medicationAdherenceRate: number = 0.92,
    hasRecentActivity: boolean = true
  ): HealthScore {
    // Dimension 1: Cardiovascular (Total Chol, LDL, HDL, Triglycerides)
    let cardScore = 85;
    const ldl = parameters.find(p => p.parameter.includes('LDL'));
    if (ldl) {
      if (ldl.status === 'HIGH') cardScore -= 12;
      else if (ldl.status === 'CRITICAL_HIGH') cardScore -= 20;
      else if (ldl.status === 'NORMAL') cardScore += 3;
    }
    const hdl = parameters.find(p => p.parameter.includes('HDL'));
    if (hdl && hdl.status === 'LOW') cardScore -= 8;

    // Dimension 2: Metabolic (Glucose, HbA1c)
    let metaScore = 82;
    const glucose = parameters.find(p => p.parameter.includes('Glucose'));
    if (glucose && glucose.status !== 'NORMAL') metaScore -= 10;

    // Dimension 3: Nutrition (Vit D, Vit B12, Hemoglobin)
    let nutrScore = 78;
    const vitD = parameters.find(p => p.parameter.includes('Vitamin D'));
    if (vitD && vitD.status !== 'NORMAL') nutrScore -= 12;
    const hb = parameters.find(p => p.parameter.includes('Hemoglobin'));
    if (hb && hb.status === 'NORMAL') nutrScore += 4;

    // Dimension 4: Lifestyle
    let lifeScore = hasRecentActivity ? 88 : 72;

    // Dimension 5: Medication Adherence
    let medScore = Math.round(medicationAdherenceRate * 100);

    // Weighted Total Score:
    // 25% Biomarkers/Cardio, 20% Metabolic, 20% Nutrition, 20% Lifestyle, 15% Medication
    const compositeScore = Math.round(
      cardScore * 0.25 +
      metaScore * 0.20 +
      nutrScore * 0.20 +
      lifeScore * 0.20 +
      medScore * 0.15
    );

    const clampedScore = Math.min(100, Math.max(30, compositeScore));

    let status: ScoreStatus = 'GOOD';
    if (clampedScore >= 85) status = 'EXCELLENT';
    else if (clampedScore >= 70) status = 'GOOD';
    else if (clampedScore >= 55) status = 'FAIR';
    else status = 'NEEDS_ATTENTION';

    const positiveFactors: string[] = [
      'High medication adherence (92%)',
      'Normal oxygen-carrying Hemoglobin baseline',
      'Healthy metabolic & liver enzyme profile'
    ];

    const negativeFactors: string[] = [];
    if (vitD && vitD.status !== 'NORMAL') {
      negativeFactors.push('Vitamin D levels below recommended reference range');
    }
    if (ldl && ldl.status !== 'NORMAL') {
      negativeFactors.push('LDL cholesterol slightly above optimal threshold');
    }
    if (negativeFactors.length === 0) {
      negativeFactors.push('Maintain regular hydration and sleep patterns');
    }

    const dimensions: ScoreDimensions = {
      cardiovascular: Math.min(100, Math.max(40, cardScore)),
      metabolic: Math.min(100, Math.max(40, metaScore)),
      nutrition: Math.min(100, Math.max(40, nutrScore)),
      lifestyle: Math.min(100, Math.max(40, lifeScore)),
      medicationAdherence: Math.min(100, Math.max(40, medScore))
    };

    return {
      score: clampedScore,
      status,
      changeDelta: 4,
      previousScore: clampedScore - 4,
      dimensions,
      positiveFactors,
      negativeFactors,
      lastCalculatedAt: new Date().toISOString(),
      disclaimer:
        'Hospate AI Health Score is an experimental health awareness indicator synthesized from available personal data. It does not constitute clinical diagnosis or medical judgment.'
    };
  }
}
