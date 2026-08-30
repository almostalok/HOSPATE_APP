import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Appointment } from '@hospate/types';
import { api } from '../api/client';

interface AppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
}

const initialState: AppointmentsState = {
  appointments: [],
  isLoading: false
};

export const fetchAppointments = createAsyncThunk('appointments/fetchAppointments', async () => {
  const list = await api.getAppointments();
  return list;
});

export const bookAppointmentAsync = createAsyncThunk(
  'appointments/book',
  async (appointment: Partial<Appointment>) => {
    const res = await api.bookAppointment(appointment);
    return res;
  }
);

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(bookAppointmentAsync.fulfilled, (state, action) => {
        state.appointments.unshift(action.payload);
      });
  }
});

export default appointmentsSlice.reducer;
