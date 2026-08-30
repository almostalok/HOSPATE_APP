import {
  User,
  HealthProfile,
  MedicalRecord,
  LabParameter,
  HealthInsight,
  TimelineEvent,
  Medication,
  MedicationLog,
  Appointment,
  Hospital,
  EmergencyCard,
  HealthScore,
  AcademicDebugData,
  DietPlan,
  SleepData,
  MedicalBill,
  VaccinationRecord,
  DailyVitals
} from '@hospate/types';
import { HealthAnalysisEngine } from '../analysis/analysisEngine';

export class DataStore {
  public users: Map<string, User> = new Map();
  public userPasswords: Map<string, string> = new Map();
  public healthProfiles: Map<string, HealthProfile> = new Map();
  public records: Map<string, MedicalRecord> = new Map();
  public parameters: Map<string, LabParameter> = new Map();
  public insights: Map<string, HealthInsight> = new Map();
  public timelineEvents: Map<string, TimelineEvent> = new Map();
  public medications: Map<string, Medication> = new Map();
  public medicationLogs: Map<string, MedicationLog[]> = new Map();
  public appointments: Map<string, Appointment> = new Map();
  public hospitals: Map<string, Hospital> = new Map();
  public emergencyCards: Map<string, EmergencyCard> = new Map();
  public academicAudits: Map<string, AcademicDebugData> = new Map();
  public dietPlans: Map<string, DietPlan> = new Map();
  public sleepRecords: Map<string, SleepData> = new Map();
  public medicalBills: Map<string, MedicalBill> = new Map();
  public vaccinations: Map<string, VaccinationRecord[]> = new Map();
  public dailyVitals: Map<string, DailyVitals> = new Map();

  constructor() {
    this.seedInitialData();
  }

  public seedInitialData() {
    const demoUserId = 'user-alex-001';
    const demoEmail = 'demo@hospate.app';

    // 1. Demo User: Alok Kumar Singh
    const demoUser: User = {
      id: demoUserId,
      email: demoEmail,
      fullName: 'Alok Kumar Singh',
      phone: '+91 98765 43210',
      role: 'patient',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-08-30T00:00:00.000Z'
    };
    this.users.set(demoUserId, demoUser);
    this.userPasswords.set(demoEmail, 'Hospate123!');

    // 2. Health Profile: Alok Kumar Singh (184cm, 70kg, O+)
    const profile: HealthProfile = {
      id: 'profile-alex-001',
      userId: demoUserId,
      dob: '2000-05-15',
      age: 26,
      gender: 'male',
      heightCm: 184,
      weightKg: 70,
      bmi: 20.7,
      bloodGroup: 'O+',
      allergies: ['Dust Mites', 'Mild Penicillin Sensitivity'],
      chronicConditions: ['None (Active & Healthy)'],
      currentMedications: ['Vitamin D3 60,000 IU (Weekly)', 'Omega-3 Triple Strength 1000mg', 'Zinc + Vitamin C Complex'],
      smokingStatus: 'never',
      alcoholStatus: 'occasional',
      activityLevel: 'active',
      emergencyContact: {
        name: 'Emma Singh',
        relationship: 'Family Contact',
        phone: '+91 98765 43210'
      },
      updatedAt: '2026-08-30T10:00:00.000Z'
    };
    this.healthProfiles.set(demoUserId, profile);

    // 3. Medical Records & Lab Parameters
    // Record 1: Annual Executive Health Checkup & CBC + Lipid Profile (Aug 30, 2026)
    const rec1Id = 'rec-lipid-cbc-aug30';
    const rec1Date = '2026-08-30';
    const rec1Params: LabParameter[] = [
      {
        id: 'p-1',
        recordId: rec1Id,
        parameter: 'Hemoglobin',
        category: 'Hematology',
        value: 15.1,
        unit: 'g/dL',
        referenceLow: 13.0,
        referenceHigh: 17.0,
        referenceText: '13.0 - 17.0 g/dL',
        status: 'NORMAL',
        confidence: 0.99,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup',
        clinicalNote: 'Optimal oxygen-carrying capacity.'
      },
      {
        id: 'p-2',
        recordId: rec1Id,
        parameter: 'Total WBC Count',
        category: 'Hematology',
        value: 6400,
        unit: 'cells/mcL',
        referenceLow: 4500,
        referenceHigh: 11000,
        referenceText: '4500 - 11000 cells/mcL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup',
        clinicalNote: 'Healthy immune cell count.'
      },
      {
        id: 'p-3',
        recordId: rec1Id,
        parameter: 'Platelet Count',
        category: 'Hematology',
        value: 260,
        unit: '10^3/mcL',
        referenceLow: 150,
        referenceHigh: 450,
        referenceText: '150 - 450 10^3/mcL',
        status: 'NORMAL',
        confidence: 0.99,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup'
      },
      {
        id: 'p-4',
        recordId: rec1Id,
        parameter: 'Total Cholesterol',
        category: 'Lipid',
        value: 178,
        unit: 'mg/dL',
        referenceLow: 125,
        referenceHigh: 200,
        referenceText: '< 200 mg/dL',
        status: 'NORMAL',
        confidence: 0.97,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup',
        clinicalNote: 'Desirable circulating cholesterol level.'
      },
      {
        id: 'p-5',
        recordId: rec1Id,
        parameter: 'LDL Cholesterol',
        category: 'Lipid',
        value: 96,
        unit: 'mg/dL',
        referenceLow: 0,
        referenceHigh: 100,
        referenceText: '< 100 mg/dL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup',
        clinicalNote: 'Optimal cardiovascular threshold.'
      },
      {
        id: 'p-6',
        recordId: rec1Id,
        parameter: 'HDL Cholesterol',
        category: 'Lipid',
        value: 56,
        unit: 'mg/dL',
        referenceLow: 40,
        referenceHigh: 60,
        referenceText: '> 40 mg/dL',
        status: 'NORMAL',
        confidence: 0.96,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup',
        clinicalNote: 'Protective high-density lipoprotein level.'
      },
      {
        id: 'p-7',
        recordId: rec1Id,
        parameter: 'Triglycerides',
        category: 'Lipid',
        value: 110,
        unit: 'mg/dL',
        referenceLow: 0,
        referenceHigh: 150,
        referenceText: '< 150 mg/dL',
        status: 'NORMAL',
        confidence: 0.97,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup'
      },
      {
        id: 'p-8',
        recordId: rec1Id,
        parameter: 'Fasting Blood Glucose',
        category: 'Metabolic',
        value: 86,
        unit: 'mg/dL',
        referenceLow: 70,
        referenceHigh: 99,
        referenceText: '70 - 99 mg/dL',
        status: 'NORMAL',
        confidence: 0.99,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup',
        clinicalNote: 'Normal euglycemic fasting level.'
      },
      {
        id: 'p-9',
        recordId: rec1Id,
        parameter: 'Serum Creatinine',
        category: 'Renal',
        value: 0.95,
        unit: 'mg/dL',
        referenceLow: 0.6,
        referenceHigh: 1.2,
        referenceText: '0.6 - 1.2 mg/dL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup'
      },
      {
        id: 'p-10',
        recordId: rec1Id,
        parameter: 'SGPT / ALT',
        category: 'Hepatic',
        value: 22,
        unit: 'U/L',
        referenceLow: 7,
        referenceHigh: 45,
        referenceText: '7 - 45 U/L',
        status: 'NORMAL',
        confidence: 0.96,
        measuredAt: rec1Date,
        source: 'Annual Executive Health Checkup'
      }
    ];

    for (const p of rec1Params) {
      this.parameters.set(p.id, p);
    }

    const rec1Insights = HealthAnalysisEngine.generateInsights(
      demoUserId,
      rec1Id,
      'Annual Executive Health Checkup & CBC + Lipid Profile',
      rec1Params
    );

    for (const ins of rec1Insights) {
      this.insights.set(ins.id, ins);
    }

    const record1: MedicalRecord = {
      id: rec1Id,
      patientId: demoUserId,
      type: 'LAB_REPORT',
      title: 'Annual Health Checkup & Lipid Profile',
      subtitle: '10 biomarkers verified • All parameters in optimal reference ranges',
      category: 'Diagnostic Pathology',
      documentUrl: 'https://hospate.app/docs/sample_cbc_lipid.pdf',
      uploadedAt: '2026-08-30T09:30:00.000Z',
      source: 'Apollo Diagnostics Laboratory, Jubilee Hills',
      status: 'COMPLETED',
      parametersCount: rec1Params.length,
      insightsCount: rec1Insights.length,
      extractedParameters: rec1Params,
      insights: rec1Insights,
      createdAt: '2026-08-30T09:30:00.000Z',
      updatedAt: '2026-08-30T09:31:15.000Z'
    };
    this.records.set(rec1Id, record1);

    // Record 2: Vitamin & Micronutrient Profile (Aug 15, 2026)
    const rec2Id = 'rec-vit-aug15';
    const rec2Date = '2026-08-15';
    const rec2Params: LabParameter[] = [
      {
        id: 'p-11',
        recordId: rec2Id,
        parameter: 'Vitamin D (25-OH)',
        category: 'Vitamin',
        value: 24,
        unit: 'ng/mL',
        referenceLow: 30,
        referenceHigh: 100,
        referenceText: '30 - 100 ng/mL',
        status: 'LOW',
        confidence: 0.97,
        measuredAt: rec2Date,
        source: 'Micronutrient & Vitamin Panel',
        clinicalNote: 'Mild insufficiency; weekly 60K IU supplementation ongoing.'
      },
      {
        id: 'p-12',
        recordId: rec2Id,
        parameter: 'Vitamin B12',
        category: 'Vitamin',
        value: 480,
        unit: 'pg/mL',
        referenceLow: 200,
        referenceHigh: 900,
        referenceText: '200 - 900 pg/mL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec2Date,
        source: 'Micronutrient & Vitamin Panel'
      },
      {
        id: 'p-13',
        recordId: rec2Id,
        parameter: 'Serum Ferritin',
        category: 'Hematology',
        value: 145,
        unit: 'ng/mL',
        referenceLow: 30,
        referenceHigh: 400,
        referenceText: '30 - 400 ng/mL',
        status: 'NORMAL',
        confidence: 0.97,
        measuredAt: rec2Date,
        source: 'Micronutrient & Vitamin Panel'
      },
      {
        id: 'p-14',
        recordId: rec2Id,
        parameter: 'Serum Calcium',
        category: 'Electrolytes',
        value: 9.6,
        unit: 'mg/dL',
        referenceLow: 8.5,
        referenceHigh: 10.2,
        referenceText: '8.5 - 10.2 mg/dL',
        status: 'NORMAL',
        confidence: 0.99,
        measuredAt: rec2Date,
        source: 'Micronutrient & Vitamin Panel'
      }
    ];

    for (const p of rec2Params) {
      this.parameters.set(p.id, p);
    }

    const rec2Insights = HealthAnalysisEngine.generateInsights(
      demoUserId,
      rec2Id,
      'Micronutrient & Vitamin Panel',
      rec2Params
    );

    for (const ins of rec2Insights) {
      this.insights.set(ins.id, ins);
    }

    const record2: MedicalRecord = {
      id: rec2Id,
      patientId: demoUserId,
      type: 'LAB_REPORT',
      title: 'Vitamin & Micronutrient Profile',
      subtitle: 'Vitamin D3 improving on course • B12 & Calcium optimal',
      category: 'Nutrition & Micronutrients',
      documentUrl: 'https://hospate.app/docs/sample_vitamin_panel.pdf',
      uploadedAt: '2026-08-15T14:15:00.000Z',
      source: 'Max Diagnostics Central Laboratory',
      status: 'COMPLETED',
      parametersCount: rec2Params.length,
      insightsCount: rec2Insights.length,
      extractedParameters: rec2Params,
      insights: rec2Insights,
      createdAt: '2026-08-15T14:15:00.000Z',
      updatedAt: '2026-08-15T14:16:00.000Z'
    };
    this.records.set(rec2Id, record2);

    // Record 3: Clinical Prescription & Supplement Regimen (Aug 27, 2026)
    const rec3Id = 'rec-rx-aug27';
    const record3: MedicalRecord = {
      id: rec3Id,
      patientId: demoUserId,
      type: 'PRESCRIPTION',
      title: 'Preventive Wellness Prescription',
      subtitle: 'Dr. Sarah Sharma • Vitamin D3 60K weekly & Omega-3 daily',
      category: 'Clinical Prescription',
      documentUrl: 'https://hospate.app/docs/rx_aug27.pdf',
      uploadedAt: '2026-08-27T16:00:00.000Z',
      source: 'Apollo Health City, Internal Medicine',
      status: 'COMPLETED',
      parametersCount: 0,
      insightsCount: 0,
      notes: 'Prescribed Cholecalciferol 60K weekly for 8 weeks and Omega-3 1000mg daily. Follow-up review scheduled in 6 weeks.',
      createdAt: '2026-08-27T16:00:00.000Z',
      updatedAt: '2026-08-27T16:00:00.000Z'
    };
    this.records.set(rec3Id, record3);

    // Record 4: Comprehensive Metabolic & Thyroid Panel (Jun 10, 2026)
    const rec4Id = 'rec-cmp-jun10';
    const rec4Date = '2026-06-10';
    const rec4Params: LabParameter[] = [
      {
        id: 'p-15',
        recordId: rec4Id,
        parameter: 'Fasting Blood Glucose',
        category: 'Metabolic',
        value: 84,
        unit: 'mg/dL',
        referenceLow: 70,
        referenceHigh: 99,
        referenceText: '70 - 99 mg/dL',
        status: 'NORMAL',
        confidence: 0.99,
        measuredAt: rec4Date,
        source: 'Metabolic & Thyroid Panel'
      },
      {
        id: 'p-16',
        recordId: rec4Id,
        parameter: 'HbA1c',
        category: 'Metabolic',
        value: 5.2,
        unit: '%',
        referenceLow: 4.0,
        referenceHigh: 5.6,
        referenceText: '< 5.7 %',
        status: 'NORMAL',
        confidence: 0.99,
        measuredAt: rec4Date,
        source: 'Metabolic & Thyroid Panel',
        clinicalNote: 'Excellent glycemic control over 90 days.'
      },
      {
        id: 'p-17',
        recordId: rec4Id,
        parameter: 'TSH (Thyroid Stimulating Hormone)',
        category: 'Thyroid',
        value: 1.85,
        unit: 'uIU/mL',
        referenceLow: 0.4,
        referenceHigh: 4.5,
        referenceText: '0.40 - 4.50 uIU/mL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec4Date,
        source: 'Metabolic & Thyroid Panel'
      }
    ];

    for (const p of rec4Params) {
      this.parameters.set(p.id, p);
    }

    const record4: MedicalRecord = {
      id: rec4Id,
      patientId: demoUserId,
      type: 'LAB_REPORT',
      title: 'Comprehensive Metabolic & Thyroid Panel',
      subtitle: 'HbA1c: 5.2% (Optimal) • TSH: 1.85 uIU/mL',
      category: 'Metabolic & Endocrine',
      documentUrl: 'https://hospate.app/docs/cmp_jun10.pdf',
      uploadedAt: '2026-06-10T11:00:00.000Z',
      source: 'Metropolis Healthcare Diagnostics',
      status: 'COMPLETED',
      parametersCount: rec4Params.length,
      insightsCount: 1,
      extractedParameters: rec4Params,
      createdAt: '2026-06-10T11:00:00.000Z',
      updatedAt: '2026-06-10T11:00:00.000Z'
    };
    this.records.set(rec4Id, record4);

    // Record 5: Cardiology Stress Echo & ECG (Apr 05, 2026)
    const rec5Id = 'rec-echo-apr05';
    const record5: MedicalRecord = {
      id: rec5Id,
      patientId: demoUserId,
      type: 'SCAN',
      title: 'Resting ECG & 2D Echocardiography',
      subtitle: 'Normal Sinus Rhythm • Resting HR: 68 BPM • Ejection Fraction: 62%',
      category: 'Cardiovascular Imaging',
      documentUrl: 'https://hospate.app/docs/ecg_apr05.pdf',
      uploadedAt: '2026-04-05T15:30:00.000Z',
      source: 'MaxCure Heart Institute, Hitec City',
      status: 'COMPLETED',
      parametersCount: 0,
      insightsCount: 1,
      notes: 'Normal ventricular dimensions and wall motion. No valvular abnormalities. High athletic cardio reserve.',
      createdAt: '2026-04-05T15:30:00.000Z',
      updatedAt: '2026-04-05T15:30:00.000Z'
    };
    this.records.set(rec5Id, record5);

    // Record 6: Medical Bill & Insurance Settlement (Aug 30, 2026)
    const rec6Id = 'rec-bill-aug30';
    const record6: MedicalRecord = {
      id: rec6Id,
      patientId: demoUserId,
      type: 'BILL',
      title: 'Apollo Comprehensive Pathology Invoice',
      subtitle: 'Invoice #APL-2026-89412 • Total ₹6,500 (Star Health Covered 80%)',
      category: 'Hospital Invoice & Claims',
      documentUrl: 'https://hospate.app/docs/invoice_aug30.pdf',
      uploadedAt: '2026-08-30T10:15:00.000Z',
      source: 'Apollo Health City Billing Desk',
      status: 'COMPLETED',
      parametersCount: 0,
      insightsCount: 0,
      notes: 'Cashless claim processed directly under Star Health comprehensive plan.',
      createdAt: '2026-08-30T10:15:00.000Z',
      updatedAt: '2026-08-30T10:15:00.000Z'
    };
    this.records.set(rec6Id, record6);

    // Record 7: Digital Immunization Certificate (Feb 18, 2026)
    const rec7Id = 'rec-vax-feb18';
    const record7: MedicalRecord = {
      id: rec7Id,
      patientId: demoUserId,
      type: 'VACCINATION',
      title: 'Digital Immunization & Booster Certificate',
      subtitle: 'COVID-19 mRNA Precautionary Dose & Tdap Booster Verified',
      category: 'Preventive Immunization',
      documentUrl: 'https://hospate.app/docs/vaccine_cert.pdf',
      uploadedAt: '2026-02-18T09:00:00.000Z',
      source: 'National Digital Health Mission (ABDM)',
      status: 'COMPLETED',
      parametersCount: 0,
      insightsCount: 0,
      notes: 'Verified digitally via ABDM Health ID: 91-8921-7721-0042.',
      createdAt: '2026-02-18T09:00:00.000Z',
      updatedAt: '2026-02-18T09:00:00.000Z'
    };
    this.records.set(rec7Id, record7);

    // 4. Timeline Events
    this.timelineEvents.set('t-1', {
      id: 't-1',
      date: '2026-08-30T09:30:00.000Z',
      formattedDate: 'AUG 30, 2026',
      title: 'Annual Executive Health Checkup',
      subtitle: 'Apollo Diagnostics • 10 parameters (All within optimal target)',
      type: 'LAB',
      severity: 'NORMAL',
      recordId: rec1Id,
      insights: ['Hemoglobin: 15.1 g/dL', 'LDL Cholesterol: 96 mg/dL', 'Glucose: 86 mg/dL']
    });

    this.timelineEvents.set('t-2', {
      id: 't-2',
      date: '2026-08-30T10:15:00.000Z',
      formattedDate: 'AUG 30, 2026',
      title: 'Hospital Invoice & Insurance Claim',
      subtitle: 'Apollo Billing • ₹6,500 settled (Star Health Coverage ₹5,200)',
      type: 'BILL',
      severity: 'NORMAL',
      recordId: rec6Id
    });

    this.timelineEvents.set('t-3', {
      id: 't-3',
      date: '2026-08-27T16:00:00.000Z',
      formattedDate: 'AUG 27, 2026',
      title: 'Preventive Wellness Consultation',
      subtitle: 'Dr. Sarah Sharma (Apollo) • Vitamin D3 60K weekly & Omega-3',
      type: 'PRESCRIPTION',
      severity: 'NORMAL',
      recordId: rec3Id
    });

    this.timelineEvents.set('t-4', {
      id: 't-4',
      date: '2026-08-15T14:15:00.000Z',
      formattedDate: 'AUG 15, 2026',
      title: 'Vitamin & Micronutrient Panel',
      subtitle: 'Max Labs • Vitamin D3: 24 ng/mL (Supplementation active)',
      type: 'LAB',
      severity: 'WARNING',
      recordId: rec2Id,
      insights: ['Vitamin D (25-OH): 24 ng/mL [Mild Low]', 'B12: 480 pg/mL [Normal]']
    });

    this.timelineEvents.set('t-5', {
      id: 't-5',
      date: '2026-06-10T11:00:00.000Z',
      formattedDate: 'JUN 10, 2026',
      title: 'Comprehensive Metabolic & Thyroid Panel',
      subtitle: 'Metropolis Healthcare • HbA1c: 5.2% & TSH: 1.85 uIU/mL',
      type: 'LAB',
      severity: 'NORMAL',
      recordId: rec4Id,
      insights: ['HbA1c: 5.2% [Optimal]', 'TSH: 1.85 uIU/mL [Normal]']
    });

    this.timelineEvents.set('t-6', {
      id: 't-6',
      date: '2026-04-05T15:30:00.000Z',
      formattedDate: 'APR 05, 2026',
      title: 'Resting ECG & 2D Echocardiography',
      subtitle: 'MaxCure Heart Institute • Normal Sinus Rhythm (EF: 62%)',
      type: 'CONSULTATION',
      severity: 'NORMAL',
      recordId: rec5Id
    });

    this.timelineEvents.set('t-7', {
      id: 't-7',
      date: '2026-02-18T09:00:00.000Z',
      formattedDate: 'FEB 18, 2026',
      title: 'Digital Immunization & Booster',
      subtitle: 'National Health Mission • COVID-19 Booster & Tdap Verified',
      type: 'VACCINATION',
      severity: 'NORMAL',
      recordId: rec7Id
    });

    // 5. Medications
    const med1: Medication = {
      id: 'med-1',
      patientId: demoUserId,
      name: 'Cholecalciferol (Vitamin D3)',
      genericName: 'Vitamin D3 60,000 IU',
      dosage: '60,000 IU',
      frequency: 'Once weekly (Sundays)',
      instructions: 'Take 1 capsule with milk after breakfast',
      scheduledTimes: ['10:00'],
      startDate: '2026-08-27',
      prescribedBy: 'Dr. Sarah Sharma',
      active: true,
      adherenceRate: 1.0,
      remainingCount: 6,
      totalCount: 8,
      refillReminder: true
    };

    const med2: Medication = {
      id: 'med-2',
      patientId: demoUserId,
      name: 'Omega-3 Triple Strength',
      genericName: 'Fish Oil (EPA 500mg / DHA 400mg)',
      dosage: '1000 mg',
      frequency: 'Once daily (Mornings)',
      instructions: 'Take 1 softgel with water after breakfast',
      scheduledTimes: ['08:30'],
      startDate: '2026-08-27',
      prescribedBy: 'Dr. Sarah Sharma',
      active: true,
      adherenceRate: 0.96,
      remainingCount: 24,
      totalCount: 60,
      refillReminder: false
    };

    const med3: Medication = {
      id: 'med-3',
      patientId: demoUserId,
      name: 'Zinc + Vitamin C Complex',
      genericName: 'Immunity Chewable (Zinc 15mg + Vit C 500mg)',
      dosage: '1 Tablet',
      frequency: 'Once daily (Afternoons)',
      instructions: 'Chew 1 tablet after lunch',
      scheduledTimes: ['13:30'],
      startDate: '2026-08-27',
      prescribedBy: 'Dr. Sarah Sharma',
      active: true,
      adherenceRate: 0.94,
      remainingCount: 18,
      totalCount: 30,
      refillReminder: true
    };

    this.medications.set(med1.id, med1);
    this.medications.set(med2.id, med2);
    this.medications.set(med3.id, med3);

    // Today's Medication Logs
    const todayLogs: MedicationLog[] = [
      {
        id: 'log-1',
        medicationId: med2.id,
        medicationName: 'Omega-3 Triple Strength',
        dosage: '1000 mg',
        scheduledTime: '08:30 AM',
        status: 'TAKEN',
        date: '2026-08-30'
      },
      {
        id: 'log-2',
        medicationId: med3.id,
        medicationName: 'Zinc + Vitamin C Complex',
        dosage: '1 Tablet',
        scheduledTime: '01:30 PM',
        status: 'TAKEN',
        date: '2026-08-30'
      },
      {
        id: 'log-3',
        medicationId: med1.id,
        medicationName: 'Cholecalciferol (Vitamin D3)',
        dosage: '60,000 IU',
        scheduledTime: '10:00 AM (Sunday)',
        status: 'TAKEN',
        date: '2026-08-30'
      }
    ];
    this.medicationLogs.set(demoUserId, todayLogs);

    // 6. Appointments
    const appt1: Appointment = {
      id: 'appt-1',
      patientId: demoUserId,
      doctorName: 'Dr. Sarah Sharma',
      doctorSpeciality: 'Preventive Cardiology & Internal Medicine',
      hospitalName: 'Apollo Health City',
      hospitalAddress: 'Jubilee Hills, Road No. 72, Hyderabad',
      date: '2026-09-12',
      time: '11:00 AM',
      status: 'UPCOMING',
      type: 'IN_PERSON',
      notes: '6-week routine follow-up on Vitamin D3 levels and overall metabolic status.'
    };

    const appt2: Appointment = {
      id: 'appt-2',
      patientId: demoUserId,
      doctorName: 'Dr. Rajesh Varma',
      doctorSpeciality: 'Sports Medicine & Orthopedics',
      hospitalName: 'MaxCure Hospitals',
      hospitalAddress: 'Mindspace IT Park, Hitec City, Hyderabad',
      date: '2026-10-05',
      time: '04:30 PM',
      status: 'UPCOMING',
      type: 'IN_PERSON',
      notes: 'Postural posture evaluation & resistance training physical therapy clearance.'
    };

    const appt3: Appointment = {
      id: 'appt-3',
      patientId: demoUserId,
      doctorName: 'Dr. Ananya Sen',
      doctorSpeciality: 'Clinical Dermatology & Allergy Care',
      hospitalName: 'Apollo Clinic',
      hospitalAddress: 'Kondapur Main Road, Hyderabad',
      date: '2026-08-10',
      time: '03:00 PM',
      status: 'COMPLETED',
      type: 'IN_PERSON',
      notes: 'Routine seasonal dust allergy review. Prescribed antihistamine SOS.'
    };

    const appt4: Appointment = {
      id: 'appt-4',
      patientId: demoUserId,
      doctorName: 'Dr. Sarah Sharma',
      doctorSpeciality: 'Internal Medicine',
      hospitalName: 'Apollo Health City',
      hospitalAddress: 'Jubilee Hills, Hyderabad',
      date: '2026-06-10',
      time: '10:30 AM',
      status: 'COMPLETED',
      type: 'IN_PERSON',
      notes: 'Reviewed CMP & Thyroid results. Confirmed excellent cardiovascular markers.'
    };

    this.appointments.set(appt1.id, appt1);
    this.appointments.set(appt2.id, appt2);
    this.appointments.set(appt3.id, appt3);
    this.appointments.set(appt4.id, appt4);

    // 7. Verified Hospitals
    const hosp1: Hospital = {
      id: 'hosp-apollo-hyd',
      name: 'Apollo Health City',
      address: 'Road No. 72, Film Nagar, Jubilee Hills',
      city: 'Hyderabad',
      distanceKm: 2.8,
      rating: 4.9,
      reviewCount: 1420,
      contactPhone: '+91 40 2360 7777',
      availableBeds: 48,
      specialities: ['Cardiology', 'Internal Medicine', 'Neurology', 'Orthopedics', 'Emergency 24x7', 'Diagnostics'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Max Bupa', 'ICICI Lombard', 'Care Health', 'Medi Assist'],
      emergencyAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80',
      doctors: [
        {
          id: 'doc-1',
          name: 'Dr. Sarah Sharma',
          speciality: 'Cardiology & Internal Medicine',
          experienceYears: 14,
          availableSlot: '11:00 AM Today'
        },
        {
          id: 'doc-2',
          name: 'Dr. Srinivas Rao',
          speciality: 'Interventional Cardiology',
          experienceYears: 22,
          availableSlot: '02:30 PM Tomorrow'
        }
      ]
    };

    const hosp2: Hospital = {
      id: 'hosp-aig-hyd',
      name: 'AIG Hospitals (Asian Institute of Gastroenterology)',
      address: '1-66/AIG/1, Mindspace Road, Gachibowli',
      city: 'Hyderabad',
      distanceKm: 4.2,
      rating: 4.8,
      reviewCount: 980,
      contactPhone: '+91 40 4244 4222',
      availableBeds: 74,
      specialities: ['Gastroenterology', 'Hepatology', 'Organ Transplant', 'Internal Medicine', 'Emergency 24x7'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Max Bupa', 'Bajaj Allianz', 'Medi Assist'],
      emergencyAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
      doctors: [
        {
          id: 'doc-3',
          name: 'Dr. D. Nageshwar Reddy',
          speciality: 'Gastroenterology & Endoscopy',
          experienceYears: 30,
          availableSlot: '10:00 AM Thursday'
        }
      ]
    };

    const hosp3: Hospital = {
      id: 'hosp-maxcure-hyd',
      name: 'MaxCure Hospitals (Medicover)',
      address: 'Behind Cyber Towers, Hitec City, Madhapur',
      city: 'Hyderabad',
      distanceKm: 3.5,
      rating: 4.7,
      reviewCount: 650,
      contactPhone: '+91 40 6833 4455',
      availableBeds: 32,
      specialities: ['Sports Medicine', 'Cardiology', 'Critical Care', 'Orthopedics', 'Emergency 24x7'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Reliance General', 'Care Health'],
      emergencyAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
      doctors: [
        {
          id: 'doc-4',
          name: 'Dr. Rajesh Varma',
          speciality: 'Sports Medicine & Orthopedics',
          experienceYears: 16,
          availableSlot: '04:30 PM Today'
        }
      ]
    };

    const hosp4: Hospital = {
      id: 'hosp-care-hyd',
      name: 'CARE Hospitals',
      address: 'Road No. 1, Banjara Hills',
      city: 'Hyderabad',
      distanceKm: 5.1,
      rating: 4.8,
      reviewCount: 890,
      contactPhone: '+91 40 6165 6565',
      availableBeds: 41,
      specialities: ['Cardiology', 'Pulmonology', 'Nephrology', 'Emergency 24x7', 'Diagnostics'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Max Bupa', 'ICICI Lombard', 'Care Health'],
      emergencyAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
      doctors: [
        {
          id: 'doc-5',
          name: 'Dr. K. Somaraju',
          speciality: 'Chief Interventional Cardiologist',
          experienceYears: 25,
          availableSlot: '09:30 AM Tomorrow'
        }
      ]
    };

    this.hospitals.set(hosp1.id, hosp1);
    this.hospitals.set(hosp2.id, hosp2);
    this.hospitals.set(hosp3.id, hosp3);
    this.hospitals.set(hosp4.id, hosp4);

    // 8. Emergency Card
    const emgCard: EmergencyCard = {
      cardId: 'HOSP-EMG-8921',
      patientId: demoUserId,
      fullName: 'Alok Kumar Singh',
      age: 26,
      dob: '2000-05-15',
      gender: 'male',
      bloodGroup: 'O+',
      primaryEmergencyContact: {
        name: 'Emma Singh',
        relationship: 'Family Contact',
        phone: '+91 98765 43210'
      },
      secondaryEmergencyContact: {
        name: 'Dr. Sarah Sharma (Physician)',
        relationship: 'Primary Care Physician',
        phone: '+91 40 2360 7777'
      },
      allergies: ['Dust Mites', 'Mild Penicillin Sensitivity'],
      chronicConditions: ['None (Active & Healthy)'],
      activeMedications: ['Vitamin D3 60K weekly', 'Omega-3 Triple Strength 1000mg OD', 'Zinc + Vit C Complex OD'],
      criticalMedicalNotes: 'Active fitness enthusiast (Gym 4x/week). No cardiovascular abnormalities or chronic disease.',
      qrPayload: 'https://emergency.hospate.app/card/HOSP-EMG-8921?secToken=99a8b712',
      secureToken: '99a8b712',
      lastUpdated: '2026-08-30T10:00:00.000Z'
    };
    this.emergencyCards.set(demoUserId, emgCard);

    // 9. Personalized Clinical Nutrition & Diet Planner
    const dietPlan: DietPlan = {
      id: 'diet-alok-001',
      patientId: demoUserId,
      goal: 'Lean Muscle & Metabolic Performance (Active Fitness)',
      dailyCaloriesTarget: 2650,
      consumedCalories: 1980,
      proteinTarget: 160,
      proteinConsumed: 124,
      carbsTarget: 320,
      carbsConsumed: 235,
      fatTarget: 70,
      fatConsumed: 52,
      waterTargetLiters: 3.5,
      waterConsumedLiters: 2.8,
      clinicalHighlights: [
        'High bioavailability protein to support 4x weekly athletic recovery',
        'Rich in dietary Vitamin D3 precursors & Omega-3 anti-inflammatory fats',
        'Balanced complex carbohydrates maintaining steady glycemic control (HbA1c: 5.2%)'
      ],
      meals: [
        {
          category: 'Breakfast',
          recommendedTime: '08:00 AM',
          targetCalories: 580,
          items: [
            {
              id: 'm-1',
              name: 'High-Protein Rolled Oats with Chia & Blueberries',
              portion: '1 Large Bowl (80g oats, 150ml almond milk)',
              calories: 340,
              proteinGrams: 16,
              carbsGrams: 52,
              fatGrams: 8,
              micronutrientBoost: 'High Antioxidants & Soluble Fiber',
              isLogged: true,
              time: '08:15 AM'
            },
            {
              id: 'm-2',
              name: 'Organic Boiled Egg Whites with Spinach',
              portion: '4 Whites + Handful sautéed greens',
              calories: 140,
              proteinGrams: 22,
              carbsGrams: 2,
              fatGrams: 2,
              micronutrientBoost: 'Lutein & Complete Amino Acids',
              isLogged: true,
              time: '08:25 AM'
            },
            {
              id: 'm-3',
              name: 'Fresh Cold-Pressed Orange Juice',
              portion: '200 ml',
              calories: 100,
              proteinGrams: 2,
              carbsGrams: 22,
              fatGrams: 0,
              micronutrientBoost: 'Vitamin C Boost for Iron Absorption',
              isLogged: true,
              time: '08:30 AM'
            }
          ]
        },
        {
          category: 'Lunch',
          recommendedTime: '01:00 PM',
          targetCalories: 720,
          items: [
            {
              id: 'm-4',
              name: 'Herb Grilled Chicken Breast with Lemon',
              portion: '180 g fillet',
              calories: 320,
              proteinGrams: 42,
              carbsGrams: 0,
              fatGrams: 6,
              micronutrientBoost: 'High Leucine for Muscle Synthesis',
              isLogged: true,
              time: '01:15 PM'
            },
            {
              id: 'm-5',
              name: 'Organic Tricolor Quinoa & Roasted Vegetables',
              portion: '1 Cup cooked (Broccoli, Zucchini, Bell Pepper)',
              calories: 260,
              proteinGrams: 10,
              carbsGrams: 46,
              fatGrams: 5,
              micronutrientBoost: 'Magnesium & Complex Micronutrients',
              isLogged: true,
              time: '01:25 PM'
            },
            {
              id: 'm-6',
              name: 'Slow-Cooked Yellow Lentil (Dal) Tadka',
              portion: '1 Small Bowl',
              calories: 140,
              proteinGrams: 8,
              carbsGrams: 20,
              fatGrams: 3,
              micronutrientBoost: 'Plant Polyphenols & Prebiotics',
              isLogged: true,
              time: '01:30 PM'
            }
          ]
        },
        {
          category: 'Post-Workout',
          recommendedTime: '05:30 PM',
          targetCalories: 380,
          items: [
            {
              id: 'm-7',
              name: 'Hydrolyzed Whey Protein Shake with Banana',
              portion: '1 Scoop in water + 1 medium banana',
              calories: 260,
              proteinGrams: 27,
              carbsGrams: 32,
              fatGrams: 2,
              micronutrientBoost: 'Rapid Glycogen & Amino Restoration',
              isLogged: true,
              time: '05:45 PM'
            },
            {
              id: 'm-8',
              name: 'Roasted California Almonds & Walnuts',
              portion: '15 pieces (20g)',
              calories: 120,
              proteinGrams: 4,
              carbsGrams: 4,
              fatGrams: 10,
              micronutrientBoost: 'ALA Omega-3 & Vitamin E',
              isLogged: true,
              time: '05:50 PM'
            }
          ]
        },
        {
          category: 'Dinner',
          recommendedTime: '08:00 PM',
          targetCalories: 680,
          items: [
            {
              id: 'm-9',
              name: 'Pan-Seared Atlantic Salmon Fillet',
              portion: '160 g',
              calories: 340,
              proteinGrams: 34,
              carbsGrams: 0,
              fatGrams: 18,
              micronutrientBoost: 'Natural Vitamin D3 & EPA/DHA Omega-3',
              isLogged: false,
              time: '08:15 PM'
            },
            {
              id: 'm-10',
              name: 'Steamed Sweet Potato Mash & Asparagus',
              portion: '1 Cup with extra virgin olive oil drizzle',
              calories: 240,
              proteinGrams: 4,
              carbsGrams: 48,
              fatGrams: 4,
              micronutrientBoost: 'Beta Carotene & Potassium',
              isLogged: false,
              time: '08:25 PM'
            }
          ]
        },
        {
          category: 'Snacks',
          recommendedTime: '10:00 PM',
          targetCalories: 290,
          items: [
            {
              id: 'm-11',
              name: 'Probiotic Greek Yogurt with Wild Honey',
              portion: '1 Cup (150g)',
              calories: 150,
              proteinGrams: 15,
              carbsGrams: 14,
              fatGrams: 3,
              micronutrientBoost: 'Gut Microbiome & Overnight Casein',
              isLogged: false,
              time: '10:15 PM'
            }
          ]
        }
      ]
    };
    this.dietPlans.set(demoUserId, dietPlan);

    // 10. Sleep & Circadian Telemetry
    const sleepData: SleepData = {
      id: 'sleep-aug30',
      date: '2026-08-30',
      totalDurationHours: 7.75,
      totalMinutes: 465,
      qualityScore: 89,
      bedTime: '10:45 PM',
      wakeTime: '06:30 AM',
      restingHeartRateBpm: 56,
      heartRateVariabilityMs: 68,
      respiratoryRateBreathsPerMin: 14.5,
      stages: [
        { stage: 'DEEP', durationMinutes: 110, percentage: 24, color: '#0A84FF' },
        { stage: 'REM', durationMinutes: 125, percentage: 27, color: '#5E5CE6' },
        { stage: 'LIGHT', durationMinutes: 208, percentage: 45, color: '#64D2FF' },
        { stage: 'AWAKE', durationMinutes: 22, percentage: 4, color: '#FF453A' }
      ],
      insights: [
        'Deep sleep (1h 50m) was 18% above your 30-day baseline, indicating optimal athletic muscle recovery.',
        'Resting heart rate dipped to 52 BPM at 03:15 AM (excellent parasympathetic tone).',
        'Consistent bedtime alignment over the past 5 consecutive nights.'
      ],
      weeklyAverages: {
        avgHours: 7.6,
        avgScore: 87,
        deepSleepPct: 22.5
      }
    };
    this.sleepRecords.set(demoUserId, sleepData);

    // 11. Medical Bills & Claims
    const bill1: MedicalBill = {
      id: 'bill-1',
      invoiceNumber: 'APL-2026-89412',
      hospitalName: 'Apollo Health City',
      hospitalAddress: 'Jubilee Hills, Road No. 72, Hyderabad',
      date: '2026-08-30',
      totalAmount: 6500,
      insuranceClaimedAmount: 5200,
      patientPaidAmount: 1300,
      paymentStatus: 'PAID',
      insuranceProvider: 'Star Health Premier Comprehensive',
      claimId: 'CLM-SH-2026-7812',
      items: [
        {
          id: 'bi-1',
          description: 'Comprehensive Complete Blood Count (CBC) with Automated Differential',
          category: 'Diagnostics',
          amount: 1400,
          coveredByInsurance: 1120,
          patientPayable: 280
        },
        {
          id: 'bi-2',
          description: 'Expanded Lipid Profile (Direct LDL, HDL, Triglycerides, VLDL)',
          category: 'Diagnostics',
          amount: 1800,
          coveredByInsurance: 1440,
          patientPayable: 360
        },
        {
          id: 'bi-3',
          description: 'Renal & Hepatic Baseline Chemistry (Serum Creatinine, SGPT/ALT)',
          category: 'Diagnostics',
          amount: 1800,
          coveredByInsurance: 1440,
          patientPayable: 360
        },
        {
          id: 'bi-4',
          description: 'Senior Consultant Preventive Physician Review',
          category: 'Consultation',
          amount: 1500,
          coveredByInsurance: 1200,
          patientPayable: 300
        }
      ],
      receiptUrl: 'https://hospate.app/receipts/APL-2026-89412.pdf'
    };

    const bill2: MedicalBill = {
      id: 'bill-2',
      invoiceNumber: 'MXC-2026-44109',
      hospitalName: 'MaxCure Heart Institute',
      hospitalAddress: 'Mindspace IT Park, Hitec City, Hyderabad',
      date: '2026-04-05',
      totalAmount: 8200,
      insuranceClaimedAmount: 7000,
      patientPaidAmount: 1200,
      paymentStatus: 'PAID',
      insuranceProvider: 'Star Health Premier Comprehensive',
      claimId: 'CLM-SH-2026-3391',
      items: [
        {
          id: 'bi-5',
          description: '12-Lead Resting Digital Electrocardiogram (ECG)',
          category: 'Diagnostics',
          amount: 1200,
          coveredByInsurance: 1000,
          patientPayable: 200
        },
        {
          id: 'bi-6',
          description: 'High-Resolution 2D Doppler Echocardiography',
          category: 'Procedure',
          amount: 5500,
          coveredByInsurance: 4800,
          patientPayable: 700
        },
        {
          id: 'bi-7',
          description: 'Cardiology Specialist Consultation & Report Certification',
          category: 'Consultation',
          amount: 1500,
          coveredByInsurance: 1200,
          patientPayable: 300
        }
      ],
      receiptUrl: 'https://hospate.app/receipts/MXC-2026-44109.pdf'
    };

    this.medicalBills.set(bill1.id, bill1);
    this.medicalBills.set(bill2.id, bill2);

    // 12. Vaccinations
    const vaxList: VaccinationRecord[] = [
      {
        id: 'vax-1',
        vaccineName: 'COVID-19 mRNA Precautionary Booster',
        targetDisease: 'SARS-CoV-2 (COVID-19)',
        doseNumber: 3,
        totalDoses: 3,
        administeredDate: '2026-02-18',
        administeredBy: 'Apollo Vaccination Hub, Hyderabad',
        batchNumber: 'COV-BN-88912',
        status: 'COMPLETED',
        certificateUrl: 'https://cowin.gov.in/cert/998127'
      },
      {
        id: 'vax-2',
        vaccineName: 'Tdap (Tetanus, Diphtheria, Acellular Pertussis)',
        targetDisease: 'Tetanus & Pertussis',
        doseNumber: 1,
        totalDoses: 1,
        administeredDate: '2025-11-10',
        expiryOrBoosterDate: '2035-11-10',
        administeredBy: 'MaxCure Clinic',
        batchNumber: 'TDP-2025-091',
        status: 'COMPLETED'
      },
      {
        id: 'vax-3',
        vaccineName: 'Quadrivalent Influenza Vaccine (Flu Season)',
        targetDisease: 'Seasonal Influenza',
        doseNumber: 1,
        totalDoses: 1,
        administeredDate: '2025-10-15',
        expiryOrBoosterDate: '2026-10-15',
        administeredBy: 'Apollo Health City',
        batchNumber: 'FLU-4V-781',
        status: 'BOOSTER_DUE'
      }
    ];
    this.vaccinations.set(demoUserId, vaxList);

    // 13. Daily Live Vitals Telemetry
    const vitals: DailyVitals = {
      heartRateBpm: 72,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 76,
      spo2Percent: 98,
      bodyTemperatureFahrenheit: 98.6,
      dailySteps: 8640,
      activeBurnCalories: 540,
      lastSyncedAt: new Date().toISOString()
    };
    this.dailyVitals.set(demoUserId, vitals);
  }
}

export const dataStore = new DataStore();
