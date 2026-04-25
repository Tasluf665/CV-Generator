import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from './routePaths';
import JobTrackerPage from '../pages/JobTracker/JobTrackerPage';
import JobDetailPage from '../pages/JobTracker/JobDetailPage';
import AddJobPage from '../pages/JobTracker/AddJobPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';
import NotFound from '../pages/NotFound/NotFound';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATHS.HOME} element={<Navigate to={ROUTE_PATHS.JOB_TRACKER} replace />} />
        
        {/* Auth Routes */}
        <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTE_PATHS.VERIFY_EMAIL} element={<VerifyEmailPage />} />

        <Route path={ROUTE_PATHS.JOB_TRACKER} element={<JobTrackerPage />} />
        <Route path={ROUTE_PATHS.JOB_DETAIL} element={<JobDetailPage />} />
        <Route path={ROUTE_PATHS.ADD_JOB} element={<AddJobPage />} />
        
        {/* Placeholder for other routes */}
        <Route path={ROUTE_PATHS.RESUME_BUILDER} element={<div>Resume Builder Placeholder</div>} />
        <Route path={ROUTE_PATHS.ANALYTICS} element={<div>Analytics Placeholder</div>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
