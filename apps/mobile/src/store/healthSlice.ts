import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HealthScore, HealthInsight, TimelineEvent } from '@hospate/types';
import { api } from '../api/client';

interface HealthState {
  score: HealthScore | null;
  insights: HealthInsight[];
  timeline: TimelineEvent[];
  quickMetrics: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HealthState = {
  score: null,
  insights: [],
  timeline: [],
  quickMetrics: [],
  isLoading: false,
  error: null
};

export const fetchHealthOverview = createAsyncThunk('health/fetchOverview', async () => {
  const [overview, timeline, insights] = await Promise.all([
    api.getHealthOverview(),
    api.getTimeline(),
    api.getInsights()
  ]);
  return {
    score: overview.score,
    insights: insights,
    timeline,
    quickMetrics: overview.quickMetrics
  };
});

export const fetchHealthScore = createAsyncThunk('health/fetchScore', async () => {
  const score = await api.getHealthScore();
  return score;
});

export const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setHealthScore: (state, action) => {
      state.score = action.payload;
    },
    addTimelineEvent: (state, action) => {
      state.timeline.unshift(action.payload);
    },
    addInsights: (state, action) => {
      state.insights = [...action.payload, ...state.insights];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHealthOverview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHealthOverview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.score = action.payload.score;
        state.insights = action.payload.insights;
        state.timeline = action.payload.timeline;
        state.quickMetrics = action.payload.quickMetrics || [];
      })
      .addCase(fetchHealthOverview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load health data';
      })
      .addCase(fetchHealthScore.fulfilled, (state, action) => {
        state.score = action.payload;
      });
  }
});

export const { setHealthScore, addTimelineEvent, addInsights } = healthSlice.actions;
export default healthSlice.reducer;
