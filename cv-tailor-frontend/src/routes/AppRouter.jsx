import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PageShell from '../components/layout/PageShell';

// Pages - to be created
import DashboardPage from '../pages/Dashboard/DashboardPage';
import MyCvPage from '../pages/MyCv/MyCvPage';
import MyJobsPage from '../pages/MyJobs/MyJobsPage';
import TailorCvPage from '../pages/TailorCv/TailorCvPage';
import CoverLetterPage from '../pages/CoverLetter/CoverLetterPage';
import SettingsPage from '../pages/Settings/SettingsPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<div>Login Page (Skeleton)</div>} />
      <Route path="/register" element={<div>Register Page (Skeleton)</div>} />

      {/* Protected Routes inside PageShell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="my-cv" element={<MyCvPage />} />
        <Route path="jobs" element={<MyJobsPage />} />
        <Route path="tailor" element={<TailorCvPage />} />
        <Route path="cover-letter" element={<CoverLetterPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
