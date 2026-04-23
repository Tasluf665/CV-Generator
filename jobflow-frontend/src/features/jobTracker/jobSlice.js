import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobService } from '../../services/jobService';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(params);
      return response.data; // This includes { jobs, pipelineCounts, pagination }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await jobService.createJob(jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create job');
    }
  }
);

export const parseJob = createAsyncThunk(
  'jobs/parseJob',
  async (rawJD, { rejectWithValue }) => {
    try {
      const response = await jobService.parseJob(rawJD);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to parse job');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    pipelineCounts: {
      Bookmarked: 0,
      Applying: 0,
      Applied: 0,
      Interviewing: 0,
      Negotiating: 0,
      Accepted: 0
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0
    },
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    parseStatus: 'idle',
  },
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.jobs;
        state.pipelineCounts = action.payload.pipelineCounts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Parse Job
      .addCase(parseJob.pending, (state) => {
        state.parseStatus = 'loading';
      })
      .addCase(parseJob.fulfilled, (state, action) => {
        state.parseStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(parseJob.rejected, (state, action) => {
        state.parseStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
