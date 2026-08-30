import {
  User,
  HealthProfile,
  MedicalRecord,
  LabParameter,
  HealthInsight,
  HealthScore,
  TimelineEvent,
  Medication,
  MedicationLog,
  Appointment,
  Hospital,
  EmergencyCard,
  AcademicDebugData
} from '@hospate/types';
import { HealthAnalysisEngine } from '../analysis/analysisEngine';
import { v4 as uuidv4 } from 'uuid';

class HospateDataStore {
  public users: Map<string, User> = new Map();
  public userPasswords: Map<string, string> = new Map(); // email -> hash
  public healthProfiles: Map<string, HealthProfile> = new Map(); // userId -> HealthProfile
  public records: Map<string, MedicalRecord> = new Map(); // recordId -> MedicalRecord
  public parameters: Map<string, LabParameter> = new Map(); // paramId -> LabParameter
  public insights: Map<string, HealthInsight> = new Map(); // insightId -> HealthInsight
  public timelineEvents: Map<string, TimelineEvent> = new Map();
  public medications: Map<string, Medication> = new Map();
  public medicationLogs: Map<string, MedicationLog[]> = new Map(); // date -> logs
  public appointments: Map<string, Appointment> = new Map();
  public hospitals: Map<string, Hospital> = new Map();
  public emergencyCards: Map<string, EmergencyCard> = new Map(); // patientId -> EmergencyCard
  public academicAudits: Map<string, AcademicDebugData> = new Map();

  constructor() {
    this.seedInitialData();
  }

  public seedInitialData() {
    const demoUserId = 'user-alex-001';
    const demoEmail = 'demo@hospate.app';

    // 1. Demo User
    const demoUser: User = {
      id: demoUserId,
      email: demoEmail,
      fullName: 'Alok Kumar Singh',
      phone: '+91 98765 43210',
      role: 'patient',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-08-30T00:00:00.000Z'
    };
    this.users.set(demoUserId, demoUser);
    this.userPasswords.set(demoEmail, 'Hospate123!');

    // 2. Health Profile
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
      allergies: ['Penicillin', 'Sulfa Drugs'],
      chronicConditions: ['Mild Dyslipidemia (Managed)'],
      currentMedications: ['Metformin 500mg', 'Vitamin D3 60,000 IU', 'Omega-3 1000mg'],
      smokingStatus: 'never',
      alcoholStatus: 'occasional',
      activityLevel: 'moderate',
      emergencyContact: {
        name: 'Emma Singh',
        relationship: 'Family Contact',
        phone: '+1 (555) 019-2834'
      },
      updatedAt: '2026-08-30T10:00:00.000Z'
    };
    this.healthProfiles.set(demoUserId, profile);

    // 3. Medical Records & Lab Parameters
    const rec1Id = 'rec-lipid-cbc-aug30';
    const rec1Date = '2026-08-30';
    const rec1Params: LabParameter[] = [
      {
        id: 'p-1',
        recordId: rec1Id,
        parameter: 'Hemoglobin',
        category: 'Hematology',
        value: 14.2,
        unit: 'g/dL',
        referenceLow: 13.0,
        referenceHigh: 17.0,
        referenceText: '13.0 - 17.0 g/dL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel',
        clinicalNote: 'Optimal oxygen-carrying reference range.'
      },
      {
        id: 'p-2',
        recordId: rec1Id,
        parameter: 'Total WBC Count',
        category: 'Hematology',
        value: 6800,
        unit: 'cells/mcL',
        referenceLow: 4500,
        referenceHigh: 11000,
        referenceText: '4500 - 11000 cells/mcL',
        status: 'NORMAL',
        confidence: 0.97,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel',
        clinicalNote: 'Normal immune baseline.'
      },
      {
        id: 'p-3',
        recordId: rec1Id,
        parameter: 'Platelet Count',
        category: 'Hematology',
        value: 245,
        unit: '10^3/mcL',
        referenceLow: 150,
        referenceHigh: 450,
        referenceText: '150 - 450 10^3/mcL',
        status: 'NORMAL',
        confidence: 0.99,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel'
      },
      {
        id: 'p-4',
        recordId: rec1Id,
        parameter: 'Total Cholesterol',
        category: 'Lipid',
        value: 215,
        unit: 'mg/dL',
        referenceLow: 125,
        referenceHigh: 200,
        referenceText: '125 - 200 mg/dL',
        status: 'HIGH',
        confidence: 0.96,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel',
        clinicalNote: 'Borderline elevated circulating cholesterol.'
      },
      {
        id: 'p-5',
        recordId: rec1Id,
        parameter: 'LDL Cholesterol',
        category: 'Lipid',
        value: 142,
        unit: 'mg/dL',
        referenceLow: 0,
        referenceHigh: 100,
        referenceText: '< 100 mg/dL',
        status: 'HIGH',
        confidence: 0.97,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel',
        clinicalNote: 'Above recommended reference range.'
      },
      {
        id: 'p-6',
        recordId: rec1Id,
        parameter: 'HDL Cholesterol',
        category: 'Lipid',
        value: 48,
        unit: 'mg/dL',
        referenceLow: 40,
        referenceHigh: 60,
        referenceText: '> 40 mg/dL',
        status: 'NORMAL',
        confidence: 0.95,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel'
      },
      {
        id: 'p-7',
        recordId: rec1Id,
        parameter: 'Triglycerides',
        category: 'Lipid',
        value: 165,
        unit: 'mg/dL',
        referenceLow: 0,
        referenceHigh: 150,
        referenceText: '< 150 mg/dL',
        status: 'HIGH',
        confidence: 0.94,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel'
      },
      {
        id: 'p-8',
        recordId: rec1Id,
        parameter: 'Fasting Blood Glucose',
        category: 'Metabolic',
        value: 88,
        unit: 'mg/dL',
        referenceLow: 70,
        referenceHigh: 99,
        referenceText: '70 - 99 mg/dL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel'
      },
      {
        id: 'p-9',
        recordId: rec1Id,
        parameter: 'Serum Creatinine',
        category: 'Renal',
        value: 0.9,
        unit: 'mg/dL',
        referenceLow: 0.6,
        referenceHigh: 1.2,
        referenceText: '0.6 - 1.2 mg/dL',
        status: 'NORMAL',
        confidence: 0.97,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel'
      },
      {
        id: 'p-10',
        recordId: rec1Id,
        parameter: 'SGPT / ALT',
        category: 'Hepatic',
        value: 28,
        unit: 'U/L',
        referenceLow: 7,
        referenceHigh: 45,
        referenceText: '7 - 45 U/L',
        status: 'NORMAL',
        confidence: 0.95,
        measuredAt: rec1Date,
        source: 'Comprehensive CBC & Lipid Panel'
      }
    ];

    for (const p of rec1Params) {
      this.parameters.set(p.id, p);
    }

    const rec1Insights = HealthAnalysisEngine.generateInsights(
      demoUserId,
      rec1Id,
      'Comprehensive CBC & Lipid Panel',
      rec1Params
    );

    for (const ins of rec1Insights) {
      this.insights.set(ins.id, ins);
    }

    const record1: MedicalRecord = {
      id: rec1Id,
      patientId: demoUserId,
      type: 'LAB_REPORT',
      title: 'Blood Test (CBC + Lipid Profile)',
      subtitle: '10 parameters analyzed by Hospate AI',
      category: 'Diagnostic Pathology',
      documentUrl: 'https://hospate.app/docs/sample_cbc_lipid.pdf',
      uploadedAt: '2026-08-30T09:30:00.000Z',
      source: 'Apollo Diagnostics Laboratory',
      status: 'COMPLETED',
      parametersCount: rec1Params.length,
      insightsCount: rec1Insights.length,
      extractedParameters: rec1Params,
      insights: rec1Insights,
      createdAt: '2026-08-30T09:30:00.000Z',
      updatedAt: '2026-08-30T09:31:15.000Z'
    };
    this.records.set(rec1Id, record1);

    // Record 2: Vitamin Panel (Aug 20, 2026)
    const rec2Id = 'rec-vit-aug20';
    const rec2Date = '2026-08-20';
    const rec2Params: LabParameter[] = [
      {
        id: 'p-11',
        recordId: rec2Id,
        parameter: 'Vitamin D (25-OH)',
        category: 'Vitamin',
        value: 18,
        unit: 'ng/mL',
        referenceLow: 30,
        referenceHigh: 100,
        referenceText: '30 - 100 ng/mL',
        status: 'LOW',
        confidence: 0.96,
        measuredAt: rec2Date,
        source: 'Comprehensive Vitamin Panel',
        clinicalNote: 'Below reference range; supplementation recommended upon physician advice.'
      },
      {
        id: 'p-12',
        recordId: rec2Id,
        parameter: 'Vitamin B12',
        category: 'Vitamin',
        value: 420,
        unit: 'pg/mL',
        referenceLow: 200,
        referenceHigh: 900,
        referenceText: '200 - 900 pg/mL',
        status: 'NORMAL',
        confidence: 0.98,
        measuredAt: rec2Date,
        source: 'Comprehensive Vitamin Panel'
      }
    ];

    for (const p of rec2Params) {
      this.parameters.set(p.id, p);
    }

    const rec2Insights = HealthAnalysisEngine.generateInsights(
      demoUserId,
      rec2Id,
      'Comprehensive Vitamin Panel',
      rec2Params
    );

    for (const ins of rec2Insights) {
      this.insights.set(ins.id, ins);
    }

    const record2: MedicalRecord = {
      id: rec2Id,
      patientId: demoUserId,
      type: 'LAB_REPORT',
      title: 'Comprehensive Vitamin Panel',
      subtitle: 'Vitamin D below reference range',
      category: 'Nutrition & Micronutrients',
      documentUrl: 'https://hospate.app/docs/sample_vitamin_panel.pdf',
      uploadedAt: '2026-08-20T14:15:00.000Z',
      source: 'Max Labs Central',
      status: 'COMPLETED',
      parametersCount: rec2Params.length,
      insightsCount: rec2Insights.length,
      extractedParameters: rec2Params,
      insights: rec2Insights,
      createdAt: '2026-08-20T14:15:00.000Z',
      updatedAt: '2026-08-20T14:16:00.000Z'
    };
    this.records.set(rec2Id, record2);

    // Record 3: Prescription
    const rec3Id = 'rec-rx-aug27';
    const record3: MedicalRecord = {
      id: rec3Id,
      patientId: demoUserId,
      type: 'PRESCRIPTION',
      title: 'Consultation & Prescription',
      subtitle: 'General Internal Medicine (3 medications prescribed)',
      category: 'Clinical Prescription',
      documentUrl: 'https://hospate.app/docs/rx_aug27.pdf',
      uploadedAt: '2026-08-27T16:00:00.000Z',
      source: 'Dr. Sarah Sharma Clinic',
      status: 'COMPLETED',
      parametersCount: 0,
      insightsCount: 0,
      notes: 'Prescribed Metformin 500mg BD for glycemic stability and Cholecalciferol weekly.',
      createdAt: '2026-08-27T16:00:00.000Z',
      updatedAt: '2026-08-27T16:00:00.000Z'
    };
    this.records.set(rec3Id, record3);

    // 4. Timeline Events
    this.timelineEvents.set('t-1', {
      id: 't-1',
      date: '2026-08-30T09:30:00.000Z',
      formattedDate: 'AUG 30, 2026',
      title: 'Blood Test (CBC + Lipid Profile)',
      subtitle: '10 parameters • 2 insights (LDL & Cholesterol above reference)',
      type: 'LAB',
      severity: 'WARNING',
      recordId: rec1Id,
      insights: ['LDL Cholesterol: 142 mg/dL', 'Total Cholesterol: 215 mg/dL']
    });

    this.timelineEvents.set('t-2', {
      id: 't-2',
      date: '2026-08-27T16:00:00.000Z',
      formattedDate: 'AUG 27, 2026',
      title: 'Doctor Consultation & Prescription',
      subtitle: 'Dr. Sarah Sharma • 3 active medications logged',
      type: 'PRESCRIPTION',
      severity: 'NORMAL',
      recordId: rec3Id
    });

    this.timelineEvents.set('t-3', {
      id: 't-3',
      date: '2026-08-20T14:15:00.000Z',
      formattedDate: 'AUG 20, 2026',
      title: 'Vitamin & Micronutrient Panel',
      subtitle: 'Vitamin D: 18 ng/mL (Below reference range)',
      type: 'LAB',
      severity: 'WARNING',
      recordId: rec2Id,
      insights: ['Vitamin D (25-OH): 18 ng/mL [Low]']
    });

    this.timelineEvents.set('t-4', {
      id: 't-4',
      date: '2026-07-18T10:00:00.000Z',
      formattedDate: 'JUL 18, 2026',
      title: 'Baseline Complete Blood Count',
      subtitle: 'All 8 hematology parameters within normal ranges',
      type: 'LAB',
      severity: 'NORMAL'
    });

    // 5. Medications
    const med1: Medication = {
      id: 'med-1',
      patientId: demoUserId,
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      dosage: '500 mg',
      frequency: 'Twice daily',
      instructions: 'Take with or immediately after meals',
      scheduledTimes: ['08:00', '20:00'],
      startDate: '2026-08-27',
      prescribedBy: 'Dr. Sarah Sharma',
      active: true,
      adherenceRate: 0.94
    };

    const med2: Medication = {
      id: 'med-2',
      patientId: demoUserId,
      name: 'Cholecalciferol (Vitamin D3)',
      genericName: 'Vitamin D3 60K',
      dosage: '60,000 IU',
      frequency: 'Once weekly (Sundays)',
      instructions: 'Take with milk after breakfast',
      scheduledTimes: ['10:00'],
      startDate: '2026-08-21',
      prescribedBy: 'Dr. Sarah Sharma',
      active: true,
      adherenceRate: 1.0
    };

    const med3: Medication = {
      id: 'med-3',
      patientId: demoUserId,
      name: 'Omega-3 Fish Oil',
      genericName: 'EPA / DHA',
      dosage: '1000 mg',
      frequency: 'Once daily',
      instructions: 'Take after dinner',
      scheduledTimes: ['21:00'],
      startDate: '2026-08-01',
      prescribedBy: 'Self / Nutritionist',
      active: true,
      adherenceRate: 0.88
    };

    this.medications.set(med1.id, med1);
    this.medications.set(med2.id, med2);
    this.medications.set(med3.id, med3);

    // Medication logs for today
    const todayStr = '2026-08-30';
    const logs: MedicationLog[] = [
      {
        id: 'log-1',
        medicationId: med1.id,
        medicationName: med1.name,
        dosage: med1.dosage,
        scheduledTime: '08:00 AM',
        takenAt: '2026-08-30T08:12:00.000Z',
        status: 'TAKEN',
        date: todayStr
      },
      {
        id: 'log-2',
        medicationId: med1.id,
        medicationName: med1.name,
        dosage: med1.dosage,
        scheduledTime: '08:00 PM',
        status: 'PENDING',
        date: todayStr
      },
      {
        id: 'log-3',
        medicationId: med3.id,
        medicationName: med3.name,
        dosage: med3.dosage,
        scheduledTime: '09:00 PM',
        status: 'PENDING',
        date: todayStr
      }
    ];
    this.medicationLogs.set(todayStr, logs);

    // 6. Appointments
    const appt1: Appointment = {
      id: 'appt-1',
      patientId: demoUserId,
      doctorName: 'Dr. Sarah Sharma',
      doctorSpeciality: 'Internal Medicine & Cardiology',
      hospitalName: 'Apollo Health City',
      hospitalAddress: 'Road No. 72, Jubilee Hills, Hyderabad',
      date: '2026-09-05',
      time: '10:30 AM',
      status: 'UPCOMING',
      type: 'IN_PERSON',
      notes: 'Follow-up on Lipid profile and Vitamin D supplementation progress.'
    };

    const appt2: Appointment = {
      id: 'appt-2',
      patientId: demoUserId,
      doctorName: 'Dr. Rajesh Mehta',
      doctorSpeciality: 'General Physician',
      hospitalName: 'Max Super Speciality Hospital',
      hospitalAddress: '1 Press Enclave Marg, Saket, New Delhi',
      date: '2026-08-27',
      time: '04:00 PM',
      status: 'COMPLETED',
      type: 'IN_PERSON'
    };

    this.appointments.set(appt1.id, appt1);
    this.appointments.set(appt2.id, appt2);

    // 7. Hospitals
    const hosp1: Hospital = {
      id: 'hosp-apollo',
      name: 'Apollo Health City',
      address: 'Road No. 72, Jubilee Hills, Hyderabad',
      city: 'Hyderabad',
      distanceKm: 2.4,
      rating: 4.8,
      reviewCount: 1420,
      specialities: ['Cardiology', 'Internal Medicine', 'Endocrinology', 'Diagnostics', 'Emergency 24x7'],
      availableBeds: 114,
      contactPhone: '+91 40 2360 7777',
      emergencyAvailable: true,
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Max Bupa', 'Care Health'],
      imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format&fit=crop&q=80',
      doctors: [
        {
          id: 'doc-sharma',
          name: 'Dr. Sarah Sharma',
          speciality: 'Cardiology & Internal Medicine',
          experienceYears: 14,
          availableSlot: 'Tomorrow at 10:30 AM'
        },
        {
          id: 'doc-rao',
          name: 'Dr. K. V. Rao',
          speciality: 'Endocrinology & Diabetology',
          experienceYears: 19,
          availableSlot: 'Friday at 02:00 PM'
        }
      ]
    };

    const hosp2: Hospital = {
      id: 'hosp-max',
      name: 'Max Super Speciality Hospital',
      address: '1 Press Enclave Marg, Saket',
      city: 'New Delhi',
      distanceKm: 4.1,
      rating: 4.7,
      reviewCount: 980,
      specialities: ['General Medicine', 'Neurology', 'Orthopedics', 'Pathology'],
      availableBeds: 82,
      contactPhone: '+91 11 2651 5050',
      emergencyAvailable: true,
      insuranceAccepted: ['All Major Third-Party Administrators (TPAs)'],
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=80',
      doctors: [
        {
          id: 'doc-mehta',
          name: 'Dr. Rajesh Mehta',
          speciality: 'General Medicine',
          experienceYears: 11,
          availableSlot: 'Today at 05:30 PM'
        }
      ]
    };

    const hosp3: Hospital = {
      id: 'hosp-fortis',
      name: 'Fortis Memorial Research Institute',
      address: 'Sector 44, Opposite HUDA City Centre',
      city: 'Gurugram',
      distanceKm: 6.8,
      rating: 4.6,
      reviewCount: 1150,
      specialities: ['Cardiology', 'Oncology', 'Organ Transplant', 'Emergency'],
      availableBeds: 95,
      contactPhone: '+91 124 496 2200',
      emergencyAvailable: true,
      insuranceAccepted: ['All Major Providers'],
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&auto=format&fit=crop&q=80',
      doctors: []
    };

    this.hospitals.set(hosp1.id, hosp1);
    this.hospitals.set(hosp2.id, hosp2);
    this.hospitals.set(hosp3.id, hosp3);

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
      allergies: ['Penicillin (Anaphylactoid Rash)', 'Sulfa Drugs'],
      chronicConditions: ['Mild Dyslipidemia (Managed with diet/statin)'],
      activeMedications: ['Metformin 500mg BD', 'Vitamin D3 60K weekly', 'Omega-3 1000mg OD'],
      criticalMedicalNotes: 'Patient wears contact lenses. No known cardiovascular incidents.',
      qrPayload: 'https://emergency.hospate.app/card/HOSP-EMG-8921?secToken=99a8b712',
      secureToken: '99a8b712',
      lastUpdated: '2026-08-30T10:00:00.000Z'
    };
    this.emergencyCards.set(demoUserId, emgCard);
  }
}

export const dataStore = new HospateDataStore();
