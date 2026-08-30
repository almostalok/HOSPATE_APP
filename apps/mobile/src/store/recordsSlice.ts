import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MedicalRecord, AcademicDebugData, LabParameter } from '@hospate/types';
import { api } from '../api/client';
import { addTimelineEvent, addInsights, setHealthScore } from './healthSlice';

interface RecordsState {
  records: MedicalRecord[];
  selectedRecord: MedicalRecord | null;
  stagingExtraction: {
    temporaryRecordId: string;
    title: string;
    type: string;
    extractedParameters: LabParameter[];
    parametersCount: number;
    rawText: string;
    debugAudit: AcademicDebugData | null;
  } | null;
  filterType: string;
  searchQuery: string;
  isProcessing: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: RecordsState = {
  records: [],
  selectedRecord: null,
  stagingExtraction: null,
  filterType: 'ALL',
  searchQuery: '',
  isProcessing: false,
  isLoading: false,
  error: null
};

export const fetchRecords = createAsyncThunk(
  'records/fetchRecords',
  async ({ filterType, search }: { filterType?: string; search?: string } = {}) => {
    const list = await api.getRecords(filterType || 'ALL', search);
    return list;
  }
);

export const uploadReportAsync = createAsyncThunk(
  'records/uploadReport',
  async (payload: { preset?: string; rawText?: string; title?: string; documentType?: string }) => {
    const res = await api.uploadDocument(payload);
    return {
      temporaryRecordId: res.tempRecordId,
      title: res.title,
      type: res.type,
      extractedParameters: res.extractedParameters,
      parametersCount: res.parametersCount,
      rawText: payload.rawText || '',
      debugAudit: res.debugAudit
    };
  }
);

export const confirmReportAsync = createAsyncThunk(
  'records/confirmReport',
  async (
    payload: { title: string; type: string; parameters: LabParameter[]; rawText?: string; source?: string },
    { dispatch }
  ) => {
    const res = await api.confirmExtraction(payload);
    dispatch(addTimelineEvent(res.timelineEvent));
    dispatch(addInsights(res.insights));
    dispatch(setHealthScore(res.updatedHealthScore));
    return res.record;
  }
);

export const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedRecord: (state, action) => {
      state.selectedRecord = action.payload;
    },
    updateStagingParameter: (state, action: { payload: { index: number; parameter: Partial<LabParameter> } }) => {
      if (state.stagingExtraction) {
        const { index, parameter } = action.payload;
        state.stagingExtraction.extractedParameters[index] = {
          ...state.stagingExtraction.extractedParameters[index],
          ...parameter
        };
      }
    },
    clearStagingExtraction: (state) => {
      state.stagingExtraction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Records
      .addCase(fetchRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch records';
      })
      // Upload Report (Staging)
      .addCase(uploadReportAsync.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(uploadReportAsync.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.stagingExtraction = action.payload;
      })
      .addCase(uploadReportAsync.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.error.message || 'Processing failed';
      })
      // Confirm Report
      .addCase(confirmReportAsync.fulfilled, (state, action) => {
        state.records.unshift(action.payload);
        state.selectedRecord = action.payload;
        state.stagingExtraction = null;
      });
  }
});

export const {
  setFilterType,
  setSearchQuery,
  setSelectedRecord,
  updateStagingParameter,
  clearStagingExtraction
} = recordsSlice.actions;

export default recordsSlice.reducer;
