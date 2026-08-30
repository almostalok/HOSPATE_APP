import {
  User,
  HealthProfile,
  MedicalRecord,
  HealthScore,
  HealthInsight,
  TimelineEvent,
  ChatMessage,
  Medication,
  Appointment,
  Hospital,
  EmergencyCard,
  AcademicDebugData,
  LabParameter
} from '@hospate/types';
import Constants from 'expo-constants';

// Dynamic API URL based on platform/hostname/phone connection
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:3000/api`;
  }
  if (Constants?.expoConfig?.hostUri) {
    const host = Constants.expoConfig.hostUri.split(':')[0];
    return `http://${host}:3000/api`;
  }
  return 'http://127.0.0.1:3000/api';
}

const MOCK_USER: User = {
  id: 'user-alex-001',
  email: 'demo@hospate.app',
  fullName: 'Alok Kumar Singh',
  role: 'patient',
  createdAt: '2026-08-01T00:00:00Z',
  updatedAt: '2026-08-20T00:00:00Z'
};

const MOCK_PROFILE: HealthProfile = {
  id: 'profile-alex-001',
  userId: 'user-alex-001',
  dob: '2000-05-14',
  age: 26,
  gender: 'male',
  bloodGroup: 'O+',
  heightCm: 184,
  weightKg: 70,
  bmi: 20.7,
  allergies: ['Penicillin', 'Sulfa Drugs'],
  chronicConditions: ['Pre-hypertension'],
  currentMedications: ['Metformin 500mg', 'Vitamin D3 60,000 IU'],
  smokingStatus: 'never',
  alcoholStatus: 'occasional',
  activityLevel: 'moderate',
  emergencyContact: {
    name: 'Emma Singh',
    relationship: 'Family Contact',
    phone: '+91 98765 43210'
  },
  updatedAt: '2026-08-20T00:00:00Z'
};

const MOCK_SCORE: HealthScore = {
  score: 88,
  status: 'EXCELLENT',
  changeDelta: 3,
  previousScore: 85,
  dimensions: {
    cardiovascular: 86,
    metabolic: 92,
    nutrition: 78,
    lifestyle: 90,
    medicationAdherence: 95
  },
  positiveFactors: [
    'Optimal blood pressure (118/76 mmHg) and resting heart rate (68 BPM)',
    'HbA1c of 5.2% reflects excellent glycemic stability',
    'High adherence (96%) with weekly Vitamin D3 & daily Omega-3'
  ],
  negativeFactors: [
    'Vitamin D3 (24 ng/mL) is slightly below 30 ng/mL baseline, continuing weekly course'
  ],
  lastCalculatedAt: new Date().toISOString(),
  disclaimer: 'Health score is for personal wellness tracking and informational insight.'
};

const MOCK_INSIGHTS: HealthInsight[] = [
  {
    id: 'ins-001',
    patientId: 'user-alex-001',
    severity: 'WARNING',
    title: 'Elevated LDL Cholesterol (142 mg/dL)',
    parameter: 'LDL Cholesterol',
    measuredValue: 142,
    unit: 'mg/dL',
    referenceRange: '< 100 mg/dL',
    interpretation: 'Your LDL level is above the optimal reference threshold of 100 mg/dL.',
    recommendation: 'Increase soluble fiber and schedule follow-up lipid profile.',
    sourceDocumentTitle: 'Lipid Profile',
    sourceDate: '2026-08-20',
    confidence: 0.98,
    createdAt: '2026-08-20T10:30:00Z'
  },
  {
    id: 'ins-002',
    patientId: 'user-alex-001',
    severity: 'WARNING',
    title: 'Low Vitamin D3 Levels (18 ng/mL)',
    parameter: 'Vitamin D3',
    measuredValue: 18,
    unit: 'ng/mL',
    referenceRange: '30 - 100 ng/mL',
    interpretation: 'Serum 25-Hydroxy Vitamin D is below the recommended range.',
    recommendation: 'Ensure morning sun exposure and continue weekly D3 supplementation.',
    sourceDocumentTitle: 'Vitamin Panel',
    sourceDate: '2026-08-20',
    confidence: 0.96,
    createdAt: '2026-08-20T10:30:00Z'
  }
];

class HospateApiClient {
  private token: string | null = null;

  public setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // Auth
  public async demoLogin(): Promise<{ user: User; token: string }> {
    try {
      return await this.request<{ user: User; token: string }>('/auth/demo-login', {
        method: 'POST'
      });
    } catch {
      return { user: MOCK_USER, token: 'demo-offline-jwt-token' };
    }
  }

  public async login(email?: string, password?: string): Promise<{ user: User; token: string }> {
    try {
      return await this.request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    } catch {
      return { user: MOCK_USER, token: 'demo-offline-jwt-token' };
    }
  }

  public async register(fullName?: string, email?: string, password?: string, phone?: string): Promise<{ user: User; token: string }> {
    try {
      return await this.request<{ user: User; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password, phone })
      });
    } catch {
      return { user: { ...MOCK_USER, fullName: fullName || 'Alex Morgan' }, token: 'demo-offline-jwt-token' };
    }
  }

  public async getMe(): Promise<{ user: User; profile: HealthProfile }> {
    try {
      return await this.request<{ user: User; profile: HealthProfile }>('/auth/me');
    } catch {
      return { user: MOCK_USER, profile: MOCK_PROFILE };
    }
  }

  public async updateProfile(profile: Partial<HealthProfile>): Promise<HealthProfile> {
    try {
      return await this.request<HealthProfile>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(profile)
      });
    } catch {
      return { ...MOCK_PROFILE, ...profile };
    }
  }

  // Health
  public async getHealthOverview(): Promise<{
    score: HealthScore;
    insights: HealthInsight[];
    recentTimeline: TimelineEvent[];
    todayMedications: any[];
    upcomingAppointment?: Appointment;
    quickMetrics?: any[];
  }> {
    try {
      return await this.request<any>('/health/overview');
    } catch {
      return {
        score: MOCK_SCORE,
        insights: MOCK_INSIGHTS,
        recentTimeline: [],
        todayMedications: [],
        upcomingAppointment: undefined,
        quickMetrics: [
          { label: 'Hemoglobin', value: '14.2 g/dL', status: 'NORMAL' },
          { label: 'Fasting Glucose', value: '88 mg/dL', status: 'NORMAL' },
          { label: 'Vitamin D3', value: '18 ng/mL', status: 'WARNING' },
          { label: 'LDL Cholesterol', value: '142 mg/dL', status: 'ABNORMAL' }
        ]
      };
    }
  }

  public async getTimeline(filters?: { type?: string; fromDate?: string; toDate?: string }): Promise<TimelineEvent[]> {
    try {
      const query = filters?.type ? `?type=${filters.type}` : '';
      return await this.request<TimelineEvent[]>(`/health/timeline${query}`);
    } catch {
      return [];
    }
  }

  public async getInsights(): Promise<HealthInsight[]> {
    try {
      const overview = await this.getHealthOverview();
      return overview.insights || MOCK_INSIGHTS;
    } catch {
      return MOCK_INSIGHTS;
    }
  }

  public async getHealthScore(): Promise<HealthScore> {
    try {
      const res = await this.request<{ score: HealthScore }>('/health/score');
      return res.score || res;
    } catch {
      return MOCK_SCORE;
    }
  }

  public async getRecords(filterType?: string, search?: string): Promise<MedicalRecord[]> {
    try {
      const params = new URLSearchParams();
      if (filterType && filterType !== 'ALL') params.append('category', filterType);
      if (search) params.append('search', search);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await this.request<MedicalRecord[]>(`/records${query}`);
    } catch {
      return [];
    }
  }

  public async getRecordById(id: string): Promise<{ record: MedicalRecord; insights: HealthInsight[] }> {
    try {
      return await this.request<any>(`/records/${id}`);
    } catch {
      return {
        record: {
          id,
          patientId: 'user-alex-001',
          title: 'Comprehensive Lab Report',
          type: 'LAB_REPORT',
          source: 'Apollo Diagnostics',
          uploadedAt: '2026-08-20T10:00:00Z',
          status: 'COMPLETED',
          parametersCount: 10,
          insightsCount: 2,
          createdAt: '2026-08-20T10:00:00Z',
          updatedAt: '2026-08-20T10:00:00Z'
        },
        insights: MOCK_INSIGHTS
      };
    }
  }

  public async uploadDocument(payload: {
    preset?: string;
    rawText?: string;
    title?: string;
    documentType?: string;
  }): Promise<{
    tempRecordId: string;
    title: string;
    type: string;
    extractedParameters: any[];
    parametersCount: number;
    debugAudit: AcademicDebugData;
  }> {
    return this.request<any>('/records/upload', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async confirmExtraction(payload: {
    recordId?: string;
    title: string;
    type: string;
    parameters: LabParameter[];
    rawText?: string;
    source?: string;
  }): Promise<{
    record: MedicalRecord;
    insights: HealthInsight[];
    updatedHealthScore: HealthScore;
    timelineEvent: TimelineEvent;
  }> {
    return this.request<any>('/records/confirm', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // AI Assistant
  public async sendChatMessage(message: string, contextRecordId?: string): Promise<{
    text: string;
    sources?: any[];
    suggestedQuestions?: string[];
  }> {
    try {
      return await this.request<any>('/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({ message, contextRecordId })
      });
    } catch {
      return {
        text: `Based on your recent health records, your Vitamin D3 is 18 ng/mL (optimal range: 30–100 ng/mL) and LDL Cholesterol is 142 mg/dL. This may indicate a need for dietary optimization and regular sun exposure. Always discuss with your physician before changing treatments.`,
        sources: [{ title: 'Comprehensive Vitamin Panel', date: '2026-08-20' }],
        suggestedQuestions: [
          'What foods naturally contain Vitamin D?',
          'What questions should I ask my doctor about my cholesterol?',
          'How does medication adherence impact my score?'
        ]
      };
    }
  }

  // Medications
  public async getMedications(): Promise<{
    medications: Medication[];
    todayLogs: any[];
    adherenceRate: number;
  }> {
    try {
      return await this.request<any>('/medications');
    } catch {
      return { medications: [], todayLogs: [], adherenceRate: 0.94 };
    }
  }

  public async logMedication(id: string, status: 'TAKEN' | 'MISSED' | 'SKIPPED'): Promise<any> {
    return this.request<any>(`/medications/${id}/log`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Appointments
  public async getAppointments(): Promise<Appointment[]> {
    try {
      return await this.request<Appointment[]>('/appointments');
    } catch {
      return [];
    }
  }

  public async bookAppointment(data: any): Promise<Appointment> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Hospitals
  public async getHospitals(query?: string, specialty?: string): Promise<Hospital[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (specialty) params.append('specialty', specialty);
      const q = params.toString() ? `?${params.toString()}` : '';
      return await this.request<Hospital[]>(`/hospitals${q}`);
    } catch {
      return [];
    }
  }

  public async getHospitalById(id: string): Promise<Hospital | undefined> {
    try {
      const list = await this.getHospitals();
      return list.find(h => h.id === id);
    } catch {
      return undefined;
    }
  }

  // Emergency Card
  public async getEmergencyCard(): Promise<EmergencyCard> {
    try {
      return await this.request<EmergencyCard>('/emergency/card');
    } catch {
      return {
        cardId: 'card-alex-001',
        patientId: 'user-alex-001',
        fullName: 'Alok Kumar Singh',
        age: 26,
        dob: '2000-05-14',
        gender: 'male',
        bloodGroup: 'O+',
        primaryEmergencyContact: {
          name: 'Emma Singh',
          relationship: 'Family Contact',
          phone: '+91 98765 43210'
        },
        secondaryEmergencyContact: {
          name: 'Dr. Sarah Sharma',
          relationship: 'Primary Care Physician',
          phone: '+91 40 2360 7777'
        },
        allergies: ['Penicillin', 'Sulfa Drugs'],
        chronicConditions: ['Pre-hypertension'],
        activeMedications: ['Metformin 500mg (1 daily)', 'Vitamin D3 60,000 IU (weekly)'],
        criticalMedicalNotes: 'Allergic to penicillin. Carries inhaler if needed.',
        qrPayload: 'https://emergency.hospate.app/card/HOSP-EMG-8921?token=exp-token-998811',
        secureToken: 'exp-token-998811',
        lastUpdated: new Date().toISOString()
      };
    }
  }
}

export const api = new HospateApiClient();
