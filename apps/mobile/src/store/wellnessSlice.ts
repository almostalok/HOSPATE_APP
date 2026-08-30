import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DietPlan, SleepData, DailyVitals, VaccinationRecord } from '@hospate/types';
import { api } from '../api/client';

export interface WellnessState {
  dietPlan: DietPlan | null;
  sleepData: SleepData | null;
  dailyVitals: DailyVitals | null;
  vaccinations: VaccinationRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WellnessState = {
  dietPlan: null,
  sleepData: null,
  dailyVitals: null,
  vaccinations: [],
  isLoading: false,
  error: null
};

export const fetchDietPlan = createAsyncThunk(
  'wellness/fetchDietPlan',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getDietPlan();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load diet plan');
    }
  }
);

export const logWaterCup = createAsyncThunk(
  'wellness/logWaterCup',
  async (_, { rejectWithValue }) => {
    try {
      return await api.logWater();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to log hydration');
    }
  }
);

export const fetchSleepData = createAsyncThunk(
  'wellness/fetchSleepData',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getSleepData();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load sleep data');
    }
  }
);

export const fetchDailyVitals = createAsyncThunk(
  'wellness/fetchDailyVitals',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getDailyVitals();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load vitals');
    }
  }
);

export const fetchVaccinations = createAsyncThunk(
  'wellness/fetchVaccinations',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getVaccinations();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to load vaccinations');
    }
  }
);

const wellnessSlice = createSlice({
  name: 'wellness',
  initialState,
  reducers: {
    toggleMealLogged: (state, action: PayloadAction<{ categoryIndex: number; itemIndex: number }>) => {
      if (state.dietPlan) {
        const { categoryIndex, itemIndex } = action.payload;
        const item = state.dietPlan.meals[categoryIndex]?.items[itemIndex];
        if (item) {
          item.isLogged = !item.isLogged;
          if (item.isLogged) {
            state.dietPlan.consumedCalories += item.calories;
            state.dietPlan.proteinConsumed += item.proteinGrams;
            state.dietPlan.carbsConsumed += item.carbsGrams;
            state.dietPlan.fatConsumed += item.fatGrams;
          } else {
            state.dietPlan.consumedCalories = Math.max(0, state.dietPlan.consumedCalories - item.calories);
            state.dietPlan.proteinConsumed = Math.max(0, state.dietPlan.proteinConsumed - item.proteinGrams);
            state.dietPlan.carbsConsumed = Math.max(0, state.dietPlan.carbsConsumed - item.carbsGrams);
            state.dietPlan.fatConsumed = Math.max(0, state.dietPlan.fatConsumed - item.fatGrams);
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDietPlan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDietPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dietPlan = action.payload;
      })
      .addCase(fetchDietPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logWaterCup.fulfilled, (state, action) => {
        state.dietPlan = action.payload;
      })
      .addCase(fetchSleepData.fulfilled, (state, action) => {
        state.sleepData = action.payload;
      })
      .addCase(fetchDailyVitals.fulfilled, (state, action) => {
        state.dailyVitals = action.payload;
      })
      .addCase(fetchVaccinations.fulfilled, (state, action) => {
        state.vaccinations = action.payload;
      });
  }
});

export const { toggleMealLogged } = wellnessSlice.actions;
export default wellnessSlice.reducer;
