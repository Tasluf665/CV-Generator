import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthNavbar from '../../components/layout/AuthNavbar/AuthNavbar';
import AuthFooter from '../../components/layout/AuthFooter/AuthFooter';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import authService from '../../services/authService';
import { ROUTE_PATHS } from '../../routes/routePaths';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <AuthNavbar />
      
      <main className={styles.mainContent}>
        {/* Decorative elements from Figma */}
        <div className={styles.ambientGlowPrimary} />
        <div className={styles.ambientGlowSecondary} />

        <div className={styles.card}>
          {!isSubmitted ? (
            <>
              <div className={styles.header}>
                <div className={styles.iconCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 2L13 10" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18 5L19 4" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 8L16 7" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="8" cy="15" r="6" stroke="var(--color-primary)" strokeWidth="2"/>
                    <path d="M11 12L12 11" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className={styles.title}>Forgot Password?</h1>
                <p className={styles.subtitle}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className={styles.form} onSubmit={handleSubmit}>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                />

                <Button type="submit" variant="primary" className={styles.submitButton} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'} <span className={styles.arrowRight}>→</span>
                </Button>
              </form>
            </>
          ) : (
            <div className={styles.successState}>
              <div className={styles.iconCircleSuccess}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h1 className={styles.title}>Check Your Email</h1>
              <p className={styles.subtitle}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Button 
                variant="secondary" 
                onClick={() => setIsSubmitted(false)}
                className={styles.resendButton}
              >
                Didn't receive the email? Try again
              </Button>
            </div>
          )}

          <div className={styles.footer}>
            <Link to={ROUTE_PATHS.LOGIN} className={styles.backLink}>
              <span className={styles.arrowLeft}>←</span> Back to Login
            </Link>
          </div>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default ForgotPasswordPage;
