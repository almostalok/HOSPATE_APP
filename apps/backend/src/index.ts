import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { dataStore } from './database/store';
import { HealthDataExtractor } from './extraction/extractor';
import { HealthAnalysisEngine } from './analysis/analysisEngine';
import { AssistantEngine } from './assistant/assistantEngine';
import { LabParameter, MedicalRecord, TimelineEvent } from '@hospate/types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hospate_jwt_secret_demo_2026';

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[HOSPATE API] ${req.method} ${req.path}`);
  next();
});

// Helper: Generate JWT
function generateToken(userId: string, email: string) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

// ----------------------------------------------------
// AUTH MODULE
// ----------------------------------------------------

// Demo Instant Login
app.post('/api/auth/demo-login', (req: Request, res: Response) => {
  const user = dataStore.users.get('user-alex-001');
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }
  const token = generateToken(user.id, user.email);
  return res.json({
    user,
    token,
    refreshToken: `ref_${uuidv4()}`,
    expiresIn: 604800
  });
});

// Standard Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Check demo user
  if (email.toLowerCase() === 'demo@hospate.app') {
    const user = dataStore.users.get('user-alex-001');
    const token = generateToken(user!.id, user!.email);
    return res.json({ user, token, refreshToken: `ref_${uuidv4()}`, expiresIn: 604800 });
  }

  // Look up user
  for (const [id, u] of dataStore.users.entries()) {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      const token = generateToken(u.id, u.email);
      return res.json({ user: u, token, refreshToken: `ref_${uuidv4()}`, expiresIn: 604800 });
    }
  }

  return res.status(401).json({ error: 'Invalid credentials. Use demo@hospate.app or register.' });
});

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, email, password, phone } = req.body;
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  const newId = `user-${uuidv4().substring(0, 8)}`;
  const newUser = {
    id: newId,
    email,
    fullName,
    phone: phone || '',
    role: 'patient' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataStore.users.set(newId, newUser);
  dataStore.userPasswords.set(email, password || 'Hospate123!');

  // Initial blank health profile
  dataStore.healthProfiles.set(newId, {
    id: `profile-${newId}`,
    userId: newId,
    dob: '1998-01-01',
    age: 28,
    gender: 'prefer_not_to_say',
    heightCm: 175,
    weightKg: 70,
    bmi: 22.8,
    bloodGroup: 'UNKNOWN',
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    smokingStatus: 'never',
    alcoholStatus: 'none',
    activityLevel: 'moderate',
    emergencyContact: { name: '', relationship: '', phone: '' },
    updatedAt: new Date().toISOString()
  });

  const token = generateToken(newId, email);
  return res.status(201).json({ user: newUser, token });
});

// Current User Profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = dataStore.users.get('user-alex-001');
  const profile = dataStore.healthProfiles.get('user-alex-001');
  return res.json({ user, profile });
});

// Update Health Profile
app.patch('/api/health/profile', (req: Request, res: Response) => {
  const current = dataStore.healthProfiles.get('user-alex-001');
  if (!current) return res.status(404).json({ error: 'Profile not found' });

  const updated = { ...current, ...req.body, updatedAt: new Date().toISOString() };
  dataStore.healthProfiles.set('user-alex-001', updated);
  return res.json(updated);
});

// ----------------------------------------------------
// HEALTH DASHBOARD & SCORE MODULE
// ----------------------------------------------------

app.get('/api/health/overview', (req: Request, res: Response) => {
  const params = Array.from(dataStore.parameters.values());
  const score = HealthAnalysisEngine.calculateHealthScore(params, 0.92, true);
  const insights = Array.from(dataStore.insights.values()).slice(0, 3);
  const todayLogs = dataStore.medicationLogs.get('2026-08-30') || [];
  const upcomingAppt = Array.from(dataStore.appointments.values()).find(a => a.status === 'UPCOMING');

  return res.json({
    score,
    criticalInsights: insights,
    todaySchedule: {
      medications: todayLogs,
      upcomingAppointment: upcomingAppt
    },
    quickMetrics: [
      { label: 'Hemoglobin', value: '14.2 g/dL', status: 'NORMAL', trend: 'Stable' },
      { label: 'Blood Glucose', value: '88 mg/dL', status: 'NORMAL', trend: 'Optimal' },
      { label: 'Vitamin D', value: '18 ng/mL', status: 'LOW', trend: 'Needs Sun / Rx' },
      { label: 'LDL Cholesterol', value: '142 mg/dL', status: 'HIGH', trend: 'Borderline' }
    ]
  });
});

app.get('/api/health/score', (req: Request, res: Response) => {
  const params = Array.from(dataStore.parameters.values());
  const score = HealthAnalysisEngine.calculateHealthScore(params, 0.92, true);
  return res.json(score);
});

app.get('/api/health/insights', (req: Request, res: Response) => {
  const insights = Array.from(dataStore.insights.values());
  return res.json(insights);
});

app.get('/api/health/timeline', (req: Request, res: Response) => {
  const events = Array.from(dataStore.timelineEvents.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return res.json(events);
});

// ----------------------------------------------------
// MEDICAL RECORDS & DOCUMENT INGESTION / OCR
// ----------------------------------------------------

app.get('/api/records', (req: Request, res: Response) => {
  const filterType = req.query.type as string;
  const search = (req.query.search as string || '').toLowerCase();

  let list = Array.from(dataStore.records.values());

  if (filterType && filterType !== 'ALL') {
    list = list.filter(r => r.type === filterType);
  }

  if (search) {
    list = list.filter(
      r =>
        r.title.toLowerCase().includes(search) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(search)) ||
        (r.source && r.source.toLowerCase().includes(search))
    );
  }

  list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  return res.json(list);
});

app.get('/api/records/:id', (req: Request, res: Response) => {
  const record = dataStore.records.get(req.params.id);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  return res.json(record);
});

// Sample OCR Texts for Demo Presets
const SAMPLE_REPORTS: Record<string, { title: string; type: any; text: string }> = {
  cbc_lipid: {
    title: 'Comprehensive CBC & Lipid Panel',
    type: 'LAB_REPORT',
    text: `APOLLO DIAGNOSTICS & RESEARCH CENTRE
Patient: Alex Morgan | Age: 28 Y | Sex: M
Date: 30-Aug-2026 | Ref By: Dr. Sarah Sharma

TEST PARAMETERS & RESULTS:
Hemoglobin: 14.2 g/dL (Ref: 13.0 - 17.0 g/dL)
Total WBC Count: 6800 cells/mcL (Ref: 4500 - 11000 cells/mcL)
Platelet Count: 245 10^3/mcL (Ref: 150 - 450 10^3/mcL)
Total Cholesterol: 215 mg/dL (Ref: 125 - 200 mg/dL)
LDL Cholesterol: 142 mg/dL (Ref: 0 - 100 mg/dL)
HDL Cholesterol: 48 mg/dL (Ref: 40 - 60 mg/dL)
Triglycerides: 165 mg/dL (Ref: 0 - 150 mg/dL)
Fasting Blood Glucose: 88 mg/dL (Ref: 70 - 99 mg/dL)
Serum Creatinine: 0.9 mg/dL (Ref: 0.6 - 1.2 mg/dL)
SGPT / ALT: 28 U/L (Ref: 7 - 45 U/L)
*** END OF REPORT ***`
  },
  vitamin_panel: {
    title: 'Vitamin & Micronutrient Profile',
    type: 'LAB_REPORT',
    text: `MAX LABS CENTRAL PATHOLOGY
Patient: Alex Morgan | Date: 20-Aug-2026
Test Name: Micronutrient Panel

Vitamin D (25-OH): 18 ng/mL (Ref: 30 - 100 ng/mL) - LOW
Vitamin B12: 420 pg/mL (Ref: 200 - 900 pg/mL) - NORMAL
Hemoglobin: 14.0 g/dL (Ref: 13.0 - 17.0 g/dL)
*** END OF REPORT ***`
  },
  metabolic_panel: {
    title: 'Comprehensive Metabolic Panel (CMP)',
    type: 'LAB_REPORT',
    text: `METROPOLIS HEALTHCARE LAB
Patient: Alex Morgan | Date: 30-Aug-2026
Fasting Blood Glucose: 92 mg/dL (Ref: 70 - 99 mg/dL)
HbA1c: 5.4 % (Ref: 4.0 - 5.6 %)
Serum Creatinine: 0.85 mg/dL (Ref: 0.6 - 1.2 mg/dL)
SGPT / ALT: 24 U/L (Ref: 7 - 45 U/L)
TSH: 2.1 uIU/mL (Ref: 0.4 - 4.5 uIU/mL)`
  }
};

// Document Upload & Live OCR Extraction API
app.post('/api/records/upload', (req: Request, res: Response) => {
  const { preset, rawText, title, documentType, fileName } = req.body;

  let reportTitle = title || 'Laboratory Investigation Report';
  let reportContent = rawText || '';
  let docType = documentType || 'LAB_REPORT';

  if (preset && SAMPLE_REPORTS[preset]) {
    reportTitle = SAMPLE_REPORTS[preset].title;
    reportContent = SAMPLE_REPORTS[preset].text;
    docType = SAMPLE_REPORTS[preset].type;
  } else if (!reportContent) {
    reportContent = SAMPLE_REPORTS.cbc_lipid.text;
    reportTitle = 'Laboratory Blood Test Report';
  }

  // Run AI Health Data Extractor
  const extractionResult = HealthDataExtractor.processDocument(
    fileName || reportTitle,
    reportContent
  );

  // Store academic debug audit session
  dataStore.academicAudits.set(extractionResult.debugAudit.pipelineSessionId, extractionResult.debugAudit);

  // Temporary staging ID
  const tempRecordId = `rec-staging-${uuidv4().substring(0, 8)}`;

  return res.json({
    temporaryRecordId: tempRecordId,
    title: reportTitle,
    type: docType,
    extractedParameters: extractionResult.parameters,
    parametersCount: extractionResult.parameters.length,
    rawText: extractionResult.rawText,
    debugAudit: extractionResult.debugAudit
  });
});

// Extraction Confirmation & Analysis Generation API
app.post('/api/records/confirm', (req: Request, res: Response) => {
  const { title, type, parameters, rawText, source } = req.body;

  const recordId = `rec-${uuidv4().substring(0, 8)}`;
  const patientId = 'user-alex-001';
  const now = new Date().toISOString();

  const validatedParams: LabParameter[] = (parameters || []).map((p: any) => ({
    ...p,
    recordId,
    id: p.id || `param-${uuidv4().substring(0, 8)}`,
    measuredAt: p.measuredAt || now.split('T')[0]
  }));

  // Store parameters
  for (const param of validatedParams) {
    dataStore.parameters.set(param.id, param);
  }

  // Generate deterministic insights
  const newInsights = HealthAnalysisEngine.generateInsights(
    patientId,
    recordId,
    title || 'Diagnostic Report',
    validatedParams
  );

  for (const ins of newInsights) {
    dataStore.insights.set(ins.id, ins);
  }

  // Recalculate Health Score
  const allParams = Array.from(dataStore.parameters.values());
  const updatedScore = HealthAnalysisEngine.calculateHealthScore(allParams, 0.94, true);

  // Create Record
  const newRecord: MedicalRecord = {
    id: recordId,
    patientId,
    type: type || 'LAB_REPORT',
    title: title || 'Medical Diagnostic Report',
    subtitle: `${validatedParams.length} parameters • ${newInsights.length} insights generated`,
    category: 'Diagnostic Health Report',
    documentUrl: 'https://hospate.app/docs/uploaded_report.pdf',
    uploadedAt: now,
    source: source || 'Uploaded Medical Document',
    status: 'COMPLETED',
    parametersCount: validatedParams.length,
    insightsCount: newInsights.length,
    extractedParameters: validatedParams,
    insights: newInsights,
    ocrRawText: rawText,
    createdAt: now,
    updatedAt: now
  };

  dataStore.records.set(recordId, newRecord);

  // Add to Timeline
  const hasAbnormal = validatedParams.some(p => p.status !== 'NORMAL');
  const timelineEvent: TimelineEvent = {
    id: `t-${uuidv4().substring(0, 6)}`,
    date: now,
    formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
    title: newRecord.title,
    subtitle: `${validatedParams.length} parameters analyzed • ${newInsights.length} insights`,
    type: 'LAB',
    severity: hasAbnormal ? 'WARNING' : 'NORMAL',
    recordId,
    insights: newInsights.map(i => `${i.parameter}: ${i.measuredValue} ${i.unit}`)
  };

  dataStore.timelineEvents.set(timelineEvent.id, timelineEvent);

  return res.status(201).json({
    record: newRecord,
    insights: newInsights,
    updatedHealthScore: updatedScore,
    timelineEvent
  });
});

app.delete('/api/records/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  if (dataStore.records.has(id)) {
    dataStore.records.delete(id);
    return res.json({ success: true, message: 'Record deleted' });
  }
  return res.status(404).json({ error: 'Record not found' });
});

// ----------------------------------------------------
// AI HEALTH BUDDY CONVERSATION MODULE
// ----------------------------------------------------

app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const profile = dataStore.healthProfiles.get('user-alex-001')!;
  const records = Array.from(dataStore.records.values());
  const parameters = Array.from(dataStore.parameters.values());
  const insights = Array.from(dataStore.insights.values());
  const medications = Array.from(dataStore.medications.values());

  const context = AssistantEngine.buildContext(profile, records, parameters, insights, medications);
  const responseMessage = await AssistantEngine.answerQuestion(message, context);

  return res.json(responseMessage);
});

// ----------------------------------------------------
// MEDICATIONS MODULE
// ----------------------------------------------------

app.get('/api/medications', (req: Request, res: Response) => {
  const meds = Array.from(dataStore.medications.values());
  const todayLogs = dataStore.medicationLogs.get('2026-08-30') || [];
  return res.json({ medications: meds, todayLogs, adherenceRate: 0.94 });
});

app.post('/api/medications', (req: Request, res: Response) => {
  const { name, dosage, frequency, instructions, scheduledTimes } = req.body;
  const newMed: any = {
    id: `med-${uuidv4().substring(0, 6)}`,
    patientId: 'user-alex-001',
    name,
    dosage,
    frequency,
    instructions: instructions || '',
    scheduledTimes: scheduledTimes || ['08:00 AM'],
    startDate: new Date().toISOString().split('T')[0],
    active: true,
    adherenceRate: 1.0
  };
  dataStore.medications.set(newMed.id, newMed);
  return res.status(201).json(newMed);
});

app.patch('/api/medications/:id/log', (req: Request, res: Response) => {
  const { status } = req.body;
  const todayStr = '2026-08-30';
  const logs = dataStore.medicationLogs.get(todayStr) || [];
  const logItem = logs.find(l => l.id === req.params.id || l.medicationId === req.params.id);

  if (logItem) {
    logItem.status = status || 'TAKEN';
    logItem.takenAt = new Date().toISOString();
  }

  return res.json({ success: true, logs });
});

// ----------------------------------------------------
// APPOINTMENTS MODULE
// ----------------------------------------------------

app.get('/api/appointments', (req: Request, res: Response) => {
  const list = Array.from(dataStore.appointments.values());
  return res.json(list);
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const { doctorName, doctorSpeciality, hospitalName, hospitalAddress, date, time, type } = req.body;
  const appt: any = {
    id: `appt-${uuidv4().substring(0, 6)}`,
    patientId: 'user-alex-001',
    doctorName,
    doctorSpeciality,
    hospitalName,
    hospitalAddress,
    date,
    time,
    status: 'UPCOMING',
    type: type || 'IN_PERSON'
  };
  dataStore.appointments.set(appt.id, appt);
  return res.status(201).json(appt);
});

// ----------------------------------------------------
// HOSPITALS MODULE
// ----------------------------------------------------

app.get('/api/hospitals', (req: Request, res: Response) => {
  const search = (req.query.search as string || '').toLowerCase();
  const speciality = req.query.speciality as string;

  let list = Array.from(dataStore.hospitals.values());
  if (search) {
    list = list.filter(h => h.name.toLowerCase().includes(search) || h.city.toLowerCase().includes(search));
  }
  if (speciality && speciality !== 'All') {
    list = list.filter(h => h.specialities.some(s => s.toLowerCase().includes(speciality.toLowerCase())));
  }
  return res.json(list);
});

app.get('/api/hospitals/:id', (req: Request, res: Response) => {
  const hospital = dataStore.hospitals.get(req.params.id);
  if (!hospital) return res.status(404).json({ error: 'Hospital not found' });
  return res.json(hospital);
});

// ----------------------------------------------------
// EMERGENCY HEALTH CARD MODULE
// ----------------------------------------------------

app.get('/api/emergency/card', (req: Request, res: Response) => {
  const card = dataStore.emergencyCards.get('user-alex-001');
  if (!card) return res.status(404).json({ error: 'Emergency card not found' });
  return res.json(card);
});

// ----------------------------------------------------
// ACADEMIC AUDIT / VIVA INSPECTOR MODULE
// ----------------------------------------------------

app.get('/api/debug/audit/:sessionId', (req: Request, res: Response) => {
  const audit = dataStore.academicAudits.get(req.params.sessionId);
  if (!audit) return res.status(404).json({ error: 'Audit session not found' });
  return res.json(audit);
});

// Health check endpoint
app.get('/api/health-check', (req: Request, res: Response) => {
  return res.json({
    status: 'ONLINE',
    app: 'Hospate AI Health Intelligence Platform',
    version: '0.1.0-mvp',
    timestamp: new Date().toISOString(),
    totalRecords: dataStore.records.size,
    totalParameters: dataStore.parameters.size,
    totalInsights: dataStore.insights.size
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  HOSPATE - AI Health Buddy Backend API Server`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Demo Account: demo@hospate.app / Hospate123!`);
  console.log(`====================================================`);
});
