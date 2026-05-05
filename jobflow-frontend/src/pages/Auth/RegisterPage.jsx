import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../features/auth/authSlice';
import { ROUTE_PATHS } from '../../routes/routePaths';
import AuthNavbar from '../../components/layout/AuthNavbar/AuthNavbar';
import AuthFooter from '../../components/layout/AuthFooter/AuthFooter';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Checkbox from '../../components/common/Checkbox/Checkbox';
import SocialButton from '../../components/common/SocialButton/SocialButton';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');

  useEffect(() => {
    if (isError) {
      setLocalError(message);
      dispatch(reset());
    }

    if (isSuccess) {
      setLocalSuccess(message || 'Registration successful! Please check your email to verify your account.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });
      dispatch(reset());
    }

    if (user) {
      navigate(ROUTE_PATHS.JOB_TRACKER);
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear messages when user starts typing
    if (localError) setLocalError('');
    if (localSuccess) setLocalSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    dispatch(register(userData));
  };

  return (
    <div className={styles.pageWrapper}>
      <AuthNavbar />

      <main className={styles.mainContent}>
        <div className={styles.registerContainer}>
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="2" fill="var(--color-primary)" />
                <path d="M9 6V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V6" stroke="var(--color-primary)" strokeWidth="2" />
                <rect x="10" y="11" width="4" height="2" rx="1" fill="white" fillOpacity="0.5" />
              </svg>
              <span className={styles.logoText}>JobFlow</span>
            </div>
            <h1 className={styles.title}>Create Your Account</h1>
            <p className={styles.subtitle}>Join thousands of job seekers managing their careers.</p>
          </div>

          {localError && (
            <div className={`${styles.messageBox} ${styles.errorBox}`}>
              <div className={`${styles.messageIcon} ${styles.errorIcon}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className={styles.messageContent}>
                <h4 className={`${styles.messageTitle} ${styles.errorTitle}`}>Registration Failed</h4>
                <p className={`${styles.messageDescription} ${styles.errorDescription}`}>{localError}</p>
              </div>
            </div>
          )}

          {localSuccess && (
            <div className={`${styles.messageBox} ${styles.successBox}`}>
              <div className={`${styles.messageIcon} ${styles.successIcon}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className={styles.messageContent}>
                <h4 className={`${styles.messageTitle} ${styles.successTitle}`}>Account Created</h4>
                <p className={`${styles.messageDescription} ${styles.successDescription}`}>{localSuccess}</p>
              </div>
            </div>
          )}

          <div className={styles.card}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <Input
                  label="First Name"
                  name="firstName"
                  placeholder="Jane"
                  variant="filled"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  placeholder="Doe"
                  variant="filled"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="jane@example.com"
                variant="filled"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className={styles.passwordField}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  variant="filled"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              <div className={styles.passwordField}>
                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  variant="filled"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              <div className={styles.terms}>
                <Checkbox
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  label={
                    <span className={styles.termsText}>
                      I agree to the <a href="#" className={styles.link}>Terms of Service</a> and <a href="#" className={styles.link}>Privacy Policy</a>
                    </span>
                  }
                  required
                />
              </div>

              <Button type="submit" variant="primary" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'} <span className={styles.arrow}>→</span>
              </Button>
            </form>

            <div className={styles.divider}>
              <span className={styles.dividerText}>OR SIGN UP WITH</span>
            </div>

            <div className={styles.socialGrid}>
              <SocialButton provider="Google" onClick={() => console.log('Google sign up')} />
              <SocialButton provider="LinkedIn" onClick={() => console.log('LinkedIn sign up')} />
            </div>
          </div>

          <p className={styles.footerText}>
            Already have an account? <Link to="/login" className={styles.loginLink}>Log in</Link>
          </p>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default RegisterPage;
