/**
 * HOSPATE - Shared Types & Clinical Data Models
 * Apple Health HIG & FHIR-oriented health models
 */

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN';

export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarUrl?: string;
  role: 'patient' | 'doctor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfile {
  id: string;
  userId: string;
  dob: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bloodGroup: BloodGroup;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  smokingStatus: 'never' | 'former' | 'current';
  alcoholStatus: 'none' | 'occasional' | 'regular';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  updatedAt: string;
}

export type RecordType = 'LAB_REPORT' | 'PRESCRIPTION' | 'SCAN' | 'CONSULTATION' | 'BILL' | 'VACCINATION';
export type ProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'NEEDS_REVIEW';

export type ParameterStatus =
  | 'NORMAL'
  | 'LOW'
  | 'HIGH'
  | 'CRITICAL_LOW'
  | 'CRITICAL_HIGH'
  | 'NEEDS_REVIEW';

export interface LabParameter {
  id: string;
  recordId?: string;
  parameter: string;
  alias?: string;
  category?: 'Hematology' | 'Lipid' | 'Metabolic' | 'Vitamin' | 'Thyroid' | 'Renal' | 'Hepatic' | 'Electrolytes' | 'Other';
  value: number;
  unit: string;
  referenceLow?: number;
  referenceHigh?: number;
  referenceText?: string;
  status: ParameterStatus;
  confidence: number;
  measuredAt: string;
  source: string;
  clinicalNote?: string;
}

export type Severity = 'NORMAL' | 'WARNING' | 'DANGER';

export interface HealthInsight {
  id: string;
  patientId: string;
  recordId?: string;
  title: string;
  parameter: string;
  measuredValue: number;
  unit: string;
  referenceRange: string;
  severity: Severity;
  interpretation: string;
  recommendation: string;
  sourceDocumentTitle: string;
  sourceDate: string;
  confidence: number;
  createdAt: string;
}

export type ScoreStatus = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_ATTENTION';

export interface ScoreDimensions {
  cardiovascular: number;
  metabolic: number;
  nutrition: number;
  lifestyle: number;
  medicationAdherence: number;
}

export interface HealthScore {
  score: number;
  status: ScoreStatus;
  changeDelta: number;
  previousScore: number;
  dimensions: ScoreDimensions;
  positiveFactors: string[];
  negativeFactors: string[];
  lastCalculatedAt: string;
  disclaimer: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: RecordType;
  title: string;
  subtitle?: string;
  category?: string;
  documentUrl?: string;
  uploadedAt: string;
  source: string;
  status: ProcessingStatus;
  parametersCount: number;
  insightsCount: number;
  extractedParameters?: LabParameter[];
  insights?: HealthInsight[];
  ocrRawText?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  formattedDate: string;
  title: string;
  subtitle: string;
  type: 'RECORD' | 'LAB' | 'PRESCRIPTION' | 'CONSULTATION' | 'INSIGHT' | 'BILL' | 'VACCINATION';
  severity?: Severity;
  recordId?: string;
  parameterSummary?: string;
  insights?: string[];
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  instructions: string;
  scheduledTimes: string[];
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  active: boolean;
  adherenceRate: number;
  remainingCount?: number;
  totalCount?: number;
  refillReminder?: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  takenAt?: string;
  status: 'TAKEN' | 'MISSED' | 'PENDING';
  date: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorName: string;
  doctorSpeciality: string;
  hospitalName: string;
  hospitalAddress: string;
  date: string;
  time: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  type: 'IN_PERSON' | 'TELECONSULT';
  notes?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  specialities: string[];
  availableBeds: number;
  contactPhone: string;
  emergencyAvailable: boolean;
  insuranceAccepted: string[];
  imageUrl: string;
  doctors: {
    id: string;
    name: string;
    speciality: string;
    experienceYears: number;
    availableSlot: string;
  }[];
}

export interface EmergencyCard {
  cardId: string;
  patientId: string;
  fullName: string;
  age: number;
  dob: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  primaryEmergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  secondaryEmergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  activeMedications: string[];
  criticalMedicalNotes: string;
  qrPayload: string;
  secureToken: string;
  lastUpdated: string;
}

// -------------------------------------------------------------
// Nutrition & Diet Planner Models
// -------------------------------------------------------------
export interface MealItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  micronutrientBoost?: string;
  isLogged: boolean;
  time: string;
}

export interface MealCategory {
  category: 'Breakfast' | 'Lunch' | 'Post-Workout' | 'Dinner' | 'Snacks';
  recommendedTime: string;
  targetCalories: number;
  items: MealItem[];
}

export interface DietPlan {
  id: string;
  patientId: string;
  goal: string;
  dailyCaloriesTarget: number;
  consumedCalories: number;
  proteinTarget: number;
  proteinConsumed: number;
  carbsTarget: number;
  carbsConsumed: number;
  fatTarget: number;
  fatConsumed: number;
  waterTargetLiters: number;
  waterConsumedLiters: number;
  meals: MealCategory[];
  clinicalHighlights: string[];
}

// -------------------------------------------------------------
// Sleep & Circadian Telemetry Models
// -------------------------------------------------------------
export interface SleepStage {
  stage: 'DEEP' | 'REM' | 'LIGHT' | 'AWAKE';
  durationMinutes: number;
  percentage: number;
  color: string;
}

export interface SleepData {
  id: string;
  date: string;
  totalDurationHours: number;
  totalMinutes: number;
  qualityScore: number;
  bedTime: string;
  wakeTime: string;
  restingHeartRateBpm: number;
  heartRateVariabilityMs: number;
  respiratoryRateBreathsPerMin: number;
  stages: SleepStage[];
  insights: string[];
  weeklyAverages: {
    avgHours: number;
    avgScore: number;
    deepSleepPct: number;
  };
}

// -------------------------------------------------------------
// Medical Bills & Insurance Models
// -------------------------------------------------------------
export interface BillItem {
  id: string;
  description: string;
  category: 'Pharmacy' | 'Diagnostics' | 'Consultation' | 'Room & Nursing' | 'Procedure';
  amount: number;
  coveredByInsurance: number;
  patientPayable: number;
}

export interface MedicalBill {
  id: string;
  invoiceNumber: string;
  hospitalName: string;
  hospitalAddress: string;
  date: string;
  totalAmount: number;
  insuranceClaimedAmount: number;
  patientPaidAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'INSURANCE_PROCESSING';
  insuranceProvider: string;
  claimId?: string;
  items: BillItem[];
  receiptUrl?: string;
}

// -------------------------------------------------------------
// Vaccination & Immunization Models
// -------------------------------------------------------------
export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  targetDisease: string;
  doseNumber: number;
  totalDoses: number;
  administeredDate: string;
  expiryOrBoosterDate?: string;
  administeredBy: string;
  batchNumber: string;
  status: 'COMPLETED' | 'BOOSTER_DUE' | 'SCHEDULED';
  certificateUrl?: string;
}

// -------------------------------------------------------------
// Daily Telemetry Vitals Model
// -------------------------------------------------------------
export interface DailyVitals {
  heartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spo2Percent: number;
  bodyTemperatureFahrenheit: number;
  dailySteps: number;
  activeBurnCalories: number;
  lastSyncedAt: string;
}

// -------------------------------------------------------------
// Chat & Context Models
// -------------------------------------------------------------
export interface ChatMessageSource {
  title: string;
  date: string;
  parameter?: string;
  value?: string;
  recordId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sources?: ChatMessageSource[];
  suggestedQuestions?: string[];
  isThinking?: boolean;
}

export interface AIContextPayload {
  patientProfile: Partial<HealthProfile>;
  recentRecords: {
    title: string;
    date: string;
    type: string;
  }[];
  recentParameters: LabParameter[];
  recentInsights: HealthInsight[];
  activeMedications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  healthScore: HealthScore;
  dietPlan?: DietPlan;
  sleepData?: SleepData;
}

export interface AcademicDebugStep {
  step: 'DOCUMENT_INGESTION' | 'OCR_TEXT_EXTRACTION' | 'NLP_ENTITY_RECOGNITION' | 'PARAMETER_NORMALIZATION' | 'REFERENCE_RANGE_EVALUATION' | 'DETERMINISTIC_ANALYSIS' | 'HEALTH_SCORE_UPDATE';
  title: string;
  timestamp: string;
  input: any;
  output: any;
  durationMs: number;
  engineUsed: string;
}

export interface AcademicDebugData {
  pipelineSessionId: string;
  documentName: string;
  processedAt: string;
  totalDurationMs: number;
  steps: AcademicDebugStep[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
