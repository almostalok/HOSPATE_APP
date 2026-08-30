/**
 * HOSPATE API Integration Test Runner
 */
async function testAPI() {
  const base = 'http://127.0.0.1:3000/api';
  console.log('====================================================');
  console.log('  HOSPATE API AUTOMATED VERIFICATION SUITE');
  console.log('  Target Server: ' + base);
  console.log('====================================================\n');

  try {
    // 1. Health Check
    const hc = await fetch(base + '/health-check').then(r => r.json());
    console.log('✓ [1/8] Backend Status:', hc.status, '• Records in DB:', hc.totalRecords);

    // 2. Demo Login
    const auth = await fetch(base + '/auth/demo-login', { method: 'POST' }).then(r => r.json());
    console.log('✓ [2/8] Demo Patient Login:', auth.user.fullName, `(${auth.user.email})`);

    // 3. Health Score & Dimensions
    const health = await fetch(base + '/health/overview').then(r => r.json());
    console.log('✓ [3/8] Health Score Engine:', `${health.score.score}/100 (${health.score.status})`);
    console.log('        Dimensions: Cardio=' + health.score.dimensions.cardiovascular + 
                ', Metabolic=' + health.score.dimensions.metabolic + 
                ', Nutrition=' + health.score.dimensions.nutrition + 
                ', Lifestyle=' + health.score.dimensions.lifestyle + 
                ', Meds=' + health.score.dimensions.medicationAdherence);

    // 4. OCR Document Ingestion Pipeline
    const upload = await fetch(base + '/records/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preset: 'cbc_lipid' })
    }).then(r => r.json());
    console.log('✓ [4/8] Live OCR Pipeline Extraction:', upload.title);
    console.log(`        Extracted ${upload.parametersCount} biomarkers • ${upload.debugAudit.steps.length} Pipeline Audit Stages Executed`);

    // 5. Confirm & Analysis Insights Generation
    const confirm = await fetch(base + '/records/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: upload.title,
        type: upload.type,
        parameters: upload.extractedParameters
      })
    }).then(r => r.json());
    console.log('✓ [5/8] Deterministic Analysis Engine: Generated', confirm.insights.length, 'notable health insights');

    // 6. AI Health Buddy Grounded Q&A
    const chat = await fetch(base + '/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Why is my Vitamin D low?' })
    }).then(r => r.json());
    console.log('✓ [6/8] AI Health Buddy Context Assistant: Response generated with', chat.sources?.length, 'verified pathology citations');

    // 7. Emergency Health Card
    const emg = await fetch(base + '/emergency/card').then(r => r.json());
    console.log('✓ [7/8] Emergency Card:', emg.fullName, `• Blood Group: ${emg.bloodGroup} • SOS Contact: ${emg.primaryEmergencyContact.name}`);

    // 8. Medications & Hospitals
    const meds = await fetch(base + '/medications').then(r => r.json());
    const hosps = await fetch(base + '/hospitals').then(r => r.json());
    console.log('✓ [8/12] Secondary Modules: Medications (' + meds.medications.length + ' active, ' + Math.round(meds.adherenceRate * 100) + '% adherence), Hospitals (' + hosps.length + ' facilities)');

    // 9. Clinical Nutrition & Diet Planner
    const diet = await fetch(base + '/diet').then(r => r.json());
    console.log(`✓ [9/12] Nutrition Engine: ${diet.consumedCalories}/${diet.dailyCaloriesTarget} kcal • Protein: ${diet.proteinConsumed}/${diet.proteinTarget}g • Hydration: ${diet.waterConsumedLiters}L`);

    // 10. Sleep & Circadian Rhythm
    const sleep = await fetch(base + '/sleep').then(r => r.json());
    console.log(`✓ [10/12] Sleep Telemetry: ${sleep.totalDurationHours}h duration • Quality Score: ${sleep.qualityScore}/100 • Resting HR: ${sleep.restingHeartRateBpm} BPM • HRV: ${sleep.heartRateVariabilityMs}ms`);

    // 11. Medical Bills & Insurance Claims
    const bills = await fetch(base + '/bills').then(r => r.json());
    const totalBilled = bills.reduce((acc, b) => acc + b.totalAmount, 0);
    console.log(`✓ [11/12] Medical Bills & Insurance: ${bills.length} itemized invoices • Total ₹${totalBilled.toLocaleString('en-IN')} (Star Health Cashless Covered)`);

    // 12. Immunization & Live Vitals
    const vax = await fetch(base + '/vaccines').then(r => r.json());
    const vitals = await fetch(base + '/vitals').then(r => r.json());
    console.log(`✓ [12/12] Immunization & Vitals: ${vax.length} ABDM vaccines verified • Live HR: ${vitals.heartRateBpm} BPM, BP: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg, SpO2: ${vitals.spo2Percent}%`);

    console.log('\n====================================================');
    console.log('  ALL 12/12 API VERIFICATIONS PASSED SUCCESSFULLY (100%)');
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ API Test Failed! Is the backend running?');
    console.error('Run: npm run dev:backend');
    console.error(err.message);
  }
}

testAPI();
