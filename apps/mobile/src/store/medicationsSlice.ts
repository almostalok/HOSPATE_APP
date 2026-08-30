import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Medication, MedicationLog } from '@hospate/types';
import { api } from '../api/client';

interface MedicationsState {
  medications: Medication[];
  todayLogs: MedicationLog[];
  adherenceRate: number;
  isLoading: boolean;
}

const initialState: MedicationsState = {
  medications: [],
  todayLogs: [],
  adherenceRate: 0.92,
  isLoading: false
};

export const fetchMedications = createAsyncThunk('medications/fetchMedications', async () => {
  const res = await api.getMedications();
  return res;
});

export const markMedicationTaken = createAsyncThunk(
  'medications/markTaken',
  async ({ id, status }: { id: string; status: 'TAKEN' | 'MISSED' }) => {
    const res = await api.logMedication(id, status);
    return { id, status, logs: res.logs };
  }
);

export const medicationsSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medications = action.payload.medications;
        state.todayLogs = action.payload.todayLogs;
        state.adherenceRate = action.payload.adherenceRate;
      })
      .addCase(markMedicationTaken.fulfilled, (state, action) => {
        const item = state.todayLogs.find(l => l.id === action.payload.id || l.medicationId === action.payload.id);
        if (item) {
          item.status = action.payload.status;
        }
      });
  }
});

export default medicationsSlice.reducer;
