import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthNavbar from '../../components/layout/AuthNavbar/AuthNavbar';
import AuthFooter from '../../components/layout/AuthFooter/AuthFooter';
import Button from '../../components/common/Button/Button';
import authService from '../../services/authService';
import { ROUTE_PATHS } from '../../routes/routePaths';
import styles from './VerifyEmailPage.module.css';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('Verification token is missing');
        setIsLoading(false);
        return;
      }

      try {
        await authService.verifyEmail(token);
        setIsSuccess(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed. The link may have expired.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleLoginRedirect = () => {
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <div className={styles.pageWrapper}>
      <AuthNavbar />
      
      <main className={styles.mainContent}>
        <div className={styles.card}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Verifying your email...</p>
            </div>
          ) : error ? (
            <>
              <div className={styles.iconCircleError}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
              <div className={styles.textContainer}>
                <h1 className={styles.title}>Verification Failed</h1>
                <p className={styles.subtitle}>{error}</p>
              </div>
              <Button 
                variant="secondary" 
                onClick={() => navigate(ROUTE_PATHS.REGISTER)}
                className={styles.actionButton}
              >
                Back to Register
              </Button>
            </>
          ) : (
            <>
              <div className={styles.iconCircle}>
                <svg width="32" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <div className={styles.textContainer}>
                <h1 className={styles.title}>Email is Verified</h1>
                <p className={styles.subtitle}>
                  Your account has been successfully verified.<br />
                  You can now access all the features of JobFlow.
                </p>
              </div>

              <Button 
                variant="primary" 
                onClick={handleLoginRedirect}
                className={styles.actionButton}
              >
                Log in now <span className={styles.arrow}>→</span>
              </Button>
            </>
          )}
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default VerifyEmailPage;
