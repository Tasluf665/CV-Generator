import { combineReducers } from '@reduxjs/toolkit';
import jobReducer from '../features/jobTracker/jobSlice';
import authReducer from '../features/auth/authSlice';
import resumeBuilderReducer from '../features/resumeBuilder/resumeBuilderSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  resumeBuilder: resumeBuilderReducer,
});

export default rootReducer;
