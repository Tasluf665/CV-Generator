import { combineReducers } from '@reduxjs/toolkit';
import jobReducer from '../features/jobTracker/jobSlice';
import authReducer from '../features/auth/authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  // Add reducers here when they are ready
});

export default rootReducer;
