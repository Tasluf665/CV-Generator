import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobService } from '../../services/jobService';

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobs(params);
      return response.data; // Extracts result from ApiResponse (response is the response body)
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
      return response.data; // Extracts job from ApiResponse
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
      return response.data; // Extracts job from ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to parse job');
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await jobService.updateJob(id, jobData);
      return response.data; // Extracts job from ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update job');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobById(id);
      return response.data; // Extracts job from ApiResponse
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job details');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    selectedJob: null,
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
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
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
      // Fetch Job By Id
      .addCase(fetchJobById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
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
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => (item._id || item.id) === (action.payload._id || action.payload.id));
        if (index !== -1) {
          const oldStatus = state.items[index].status;
          const newStatus = action.payload.status;
          
          state.items[index] = action.payload;

          // If status changed, update pipeline counts
          if (oldStatus !== newStatus) {
            // Decrement old status count
            if (state.pipelineCounts[oldStatus] !== undefined) {
              state.pipelineCounts[oldStatus] = Math.max(0, state.pipelineCounts[oldStatus] - 1);
            }
            
            // Increment new status count
            if (state.pipelineCounts[newStatus] === undefined) {
              state.pipelineCounts[newStatus] = 1;
            } else {
              state.pipelineCounts[newStatus] += 1;
            }
          }
        }
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

export const { clearJobError, setSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
