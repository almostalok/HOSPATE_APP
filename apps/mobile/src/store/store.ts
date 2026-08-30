import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import healthReducer from './healthSlice';
import recordsReducer from './recordsSlice';
import assistantReducer from './assistantSlice';
import medicationsReducer from './medicationsSlice';
import appointmentsReducer from './appointmentsSlice';
import hospitalsReducer from './hospitalsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    health: healthReducer,
    records: recordsReducer,
    assistant: assistantReducer,
    medications: medicationsReducer,
    appointments: appointmentsReducer,
    hospitals: hospitalsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
