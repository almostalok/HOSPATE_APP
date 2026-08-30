# HOSPATE – AI Health Buddy
### Personal Health Intelligence Platform • B.Tech Major Project • Mobile MVP v0.1

Hospate converts fragmented medical documents into a continuously understandable personal health profile.

> **Core Promise**: *"Upload your health data. Understand it. Track it. Act on it."*

---

## 1. System Architecture

```
PATIENT
   ↓
UPLOAD MEDICAL REPORT (PDF / Image / Preset)
   ↓
DOCUMENT INGESTION & OCR
   ↓
RAW TEXT EXTRACTION
   ↓
NLP / NER BIOMARKER EXTRACTION
   ↓
NORMALIZATION & REFERENCE RANGE HARMONIZATION
   ↓
DETERMINISTIC CLINICAL HEALTH INSIGHTS
   ↓
CONTINUOUS AI HEALTH SCORE
   ↓
DIGITAL HEALTH TIMELINE
   ↓
AI HEALTH BUDDY (Context-Grounded Q&A)
```

---

## 2. Monorepo Structure

```
hospate_mobile/
├── apps/
│   ├── mobile/                   # React Native (Expo) + TypeScript + Redux Toolkit
│   │   ├── src/
│   │   │   ├── api/             # Typed API client with auto backend synchronization
│   │   │   ├── components/      # Hospate Design System UI components
│   │   │   ├── navigation/      # Root Stack & Bottom Tab Navigators
│   │   │   ├── screens/         # 22 screens (Auth, Home, Score, Timeline, Upload, OCR, Buddy, Meds, Hospitals, Emergency)
│   │   │   ├── store/           # Redux slices (auth, health, records, assistant, medications, appointments, hospitals)
│   │   │   └── theme/           # Design tokens, typography, semantic colors, spacing
│   │   └── package.json
│   │
│   └── backend/                  # TypeScript API Server
│       ├── src/
│       │   ├── auth/            # JWT authentication & session management
│       │   ├── health/          # Health overview, score calculation & timeline
│       │   ├── records/         # Records storage & document metadata
│       │   ├── ocr/             # Modular OCR text extraction
│       │   ├── extraction/      # Biomarker dictionary, NER parser & reference ranges
│       │   ├── analysis/        # Deterministic clinical rules & health score engine
│       │   ├── assistant/       # Context builder & source-grounded assistant
│       │   ├── medications/     # Medication schedule & adherence calculator
│       │   ├── appointments/    # Consultation booking & history
│       │   ├── hospitals/       # Hospital discovery & bed availability
│       │   ├── emergency/       # Emergency health card & secure QR token
│       │   └── database/        # In-memory + persistent store with realistic synthetic seed data
│       └── package.json
│
├── packages/
│   └── types/                    # Shared FHIR-aligned TypeScript health models
├── docker-compose.yml            # PostgreSQL + MongoDB + Redis container stack
├── .env.example                  # Environment configuration template
└── README.md
```

---

## 3. Demo Credentials & Seed Data

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Demo Patient** | `demo@hospate.app` | `Hospate123!` | Pre-populated profile for **Alex Morgan** (28Y, Male, Blood Group A+) with CBC, Lipid Profile, Vitamin Panel, Prescription, active Metformin & Vitamin D3 medications, upcoming appointment at Apollo Health City, and Emergency Card. |

---

## 4. Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended, v22 supported)
- npm (v9+)

### Installation
From the repository root:

```bash
# 1. Install all dependencies across monorepo workspaces
npm install

# 2. Build shared types package
npm run build --workspace=@hospate/types
```

### Running the Backend Server
```bash
# Start backend on http://localhost:3000
npm run dev --workspace=@hospate/backend
```

### Running the Mobile Application
```bash
# Start Expo development server (Web / Android / iOS)
npm run start --workspace=@hospate/mobile
```
Press `w` in terminal to launch in browser preview, or scan QR code with Expo Go on your Android/iOS device.

---

## 5. Hero Vertical Slice Demonstration Walkthrough

1. **Login**: Tap **"Fast Demo Access (Alex Morgan)"** on the Welcome screen.
2. **Home Dashboard**: Inspect the hero **AI Health Score (82 / GOOD, +4 pts)**, the 5 dimension bars, quick biomarker metrics, and critical health alerts (Low Vitamin D, Elevated LDL).
3. **Medical Records**: Navigate to the **Records** tab. Observe existing chronological records (CBC + Lipid, Vitamin Panel, Prescription).
4. **Hero Upload Flow**: Tap **"+ Upload"** → Choose **"Comprehensive CBC & Lipid Panel"** preset (or choose photo/PDF).
5. **Live OCR Processing**: Observe the 5-stage live pipeline execution:
   - Stage 1: Document uploaded & validated
   - Stage 2: Reading document (OCR)
   - Stage 3: Extracting parameters (NLP/NER)
   - Stage 4: Understanding findings (Reference Range Harmonization)
   - Stage 5: Building health insights (Deterministic Analysis)
6. **Extraction Review**: Inspect the extracted parameters table showing value, unit, reference range, status badge, and confidence rating (98%). Tap **"Confirm & Run AI Health Analysis"**.
7. **AI Analysis Result**: Review categorized findings:
   - 🔴 **Abnormal**: LDL Cholesterol (142 mg/dL)
   - 🟡 **Warning**: Vitamin D (18 ng/mL)
   - 🟢 **Normal**: Hemoglobin (14.2 g/dL), Fasting Glucose (88 mg/dL)
8. **AI Health Buddy**: Tap **"Ask AI Health Buddy to Explain"** → Ask *"Why is my Vitamin D low?"* or *"What should I discuss with my doctor?"* → Verify grounded response citing source documents with responsible clinical disclaimers.
9. **Health Timeline**: Tap **"Timeline"** to verify the new record is chronologically integrated with tagged biomarker insights.
10. **Academic Viva Audit**: Tap the **"Audit"** button in the header at any time to open the **Academic Pipeline Inspector** showing raw step-by-step inputs, outputs, engine execution times, and entity recognition traces.

---

## 6. Academic Demonstration Features

- **Debug Pipeline Inspector**: Slide-over modal exposing raw OCR text lines, NLP entity dictionaries, reference range matching formulas, and weighted score dimension calculations.
- **Deterministic Medical Safety**: The AI assistant uses deterministic rule validation before natural language generation, avoiding diagnostic overreach or medical hallucination.
- **FHIR Alignment**: Internal models map directly to standard HL7 FHIR resources (`Patient`, `Observation`, `DiagnosticReport`, `MedicationRequest`, `Appointment`).

---

## 7. API Summary

- `POST /api/auth/demo-login` - Fast login for demo patient
- `POST /api/auth/login` - Standard credentials login
- `POST /api/auth/register` - Create patient account
- `GET /api/health/overview` - Health score, dimensions, insights, today schedule
- `GET /api/health/score` - Health score breakdown & factors
- `GET /api/health/timeline` - Chronological health timeline
- `GET /api/records` - List filtered medical records
- `POST /api/records/upload` - Run OCR & parameter extraction pipeline
- `POST /api/records/confirm` - Commit verified parameters & generate insights
- `POST /api/assistant/chat` - Grounded AI Health Buddy Q&A
- `GET /api/medications` - Active prescriptions & adherence rate
- `PATCH /api/medications/:id/log` - Log medication taken/missed
- `GET /api/appointments` - List & book consultations
- `GET /api/hospitals` - Hospital discovery & bed availability
- `GET /api/emergency/card` - High-contrast emergency card & QR token

---

## 8. License
Academic Major Project MVP • B.Tech Computer Science & Engineering. All synthetic demo data is strictly de-identified.
