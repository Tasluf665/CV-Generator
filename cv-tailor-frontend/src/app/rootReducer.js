import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cvReducer from '../features/cv/cvSlice';
import jobsReducer from '../features/jobs/jobsSlice';
import tailorReducer from '../features/tailor/tailorSlice';
import coverLetterReducer from '../features/coverLetter/coverLetterSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cv: cvReducer,
  jobs: jobsReducer,
  tailor: tailorReducer,
  coverLetter: coverLetterReducer,
});

export default rootReducer;
