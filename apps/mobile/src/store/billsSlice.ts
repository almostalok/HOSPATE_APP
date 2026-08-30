import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MedicalBill } from '@hospate/types';
import { api } from '../api/client';

export interface BillsState {
  bills: MedicalBill[];
  selectedBill: MedicalBill | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BillsState = {
  bills: [],
  selectedBill: null,
  isLoading: false,
  error: null
};

export const fetchMedicalBills = createAsyncThunk(
  'bills/fetchMedicalBills',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getMedicalBills();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load medical bills');
    }
  }
);

const billsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    selectBill: (state, action) => {
      state.selectedBill = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalBills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMedicalBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload;
      })
      .addCase(fetchMedicalBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { selectBill } = billsSlice.actions;
export default billsSlice.reducer;
