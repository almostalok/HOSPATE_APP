import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, HealthProfile } from '@hospate/types';
import { api } from '../api/client';

interface AuthState {
  user: User | null;
  profile: HealthProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const demoLoginAsync = createAsyncThunk('auth/demoLogin', async () => {
  const res = await api.demoLogin();
  api.setToken(res.token);
  const meRes = await api.getMe();
  return { user: res.user, token: res.token, profile: meRes.profile };
});

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const res = await api.login(email, password);
    api.setToken(res.token);
    const meRes = await api.getMe();
    return { user: res.user, token: res.token, profile: meRes.profile };
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ fullName, email, password, phone }: { fullName: string; email: string; password: string; phone?: string }) => {
    const res = await api.register(fullName, email, password, phone);
    api.setToken(res.token);
    const meRes = await api.getMe();
    return { user: res.user, token: res.token, profile: meRes.profile };
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (profile: Partial<HealthProfile>) => {
    const updated = await api.updateProfile(profile);
    return updated;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      api.setToken(null);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Demo Login
      .addCase(demoLoginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(demoLoginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.token = action.payload.token;
      })
      .addCase(demoLoginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Demo login failed';
      })
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.token = action.payload.token;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Update Profile
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
