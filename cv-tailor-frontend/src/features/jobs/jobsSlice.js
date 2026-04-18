import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  selectedJob: null,
  isLoading: false,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
  },
});

export const { setJobs, setSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;
