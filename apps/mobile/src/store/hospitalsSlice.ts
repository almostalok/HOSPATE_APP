import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Hospital } from '@hospate/types';
import { api } from '../api/client';

interface HospitalsState {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  searchQuery: string;
  selectedSpeciality: string;
  isLoading: boolean;
}

const initialState: HospitalsState = {
  hospitals: [],
  selectedHospital: null,
  searchQuery: '',
  selectedSpeciality: 'All',
  isLoading: false
};

export const fetchHospitals = createAsyncThunk(
  'hospitals/fetchHospitals',
  async ({ search, speciality }: { search?: string; speciality?: string } = {}) => {
    const list = await api.getHospitals(search, speciality);
    return list;
  }
);

export const hospitalsSlice = createSlice({
  name: 'hospitals',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedSpeciality: (state, action) => {
      state.selectedSpeciality = action.payload;
    },
    setSelectedHospital: (state, action) => {
      state.selectedHospital = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hospitals = action.payload;
      });
  }
});

export const { setSearchQuery, setSelectedSpeciality, setSelectedHospital } = hospitalsSlice.actions;
export default hospitalsSlice.reducer;
