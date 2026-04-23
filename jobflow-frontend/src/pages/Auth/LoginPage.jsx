import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../features/auth/authSlice';
import { ROUTE_PATHS } from '../../routes/routePaths';
import AuthNavbar from '../../components/layout/AuthNavbar/AuthNavbar';
import AuthFooter from '../../components/layout/AuthFooter/AuthFooter';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Checkbox from '../../components/common/Checkbox/Checkbox';
import SocialButton from '../../components/common/SocialButton/SocialButton';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      navigate(ROUTE_PATHS.JOB_TRACKER);
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: formData.email,
      password: formData.password,
    };
    dispatch(login(userData));
  };

  return (
    <div className={styles.pageWrapper}>
      <AuthNavbar />
      
      <main className={styles.mainContent}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="14" rx="2" fill="var(--color-primary)" />
                <path d="M9 6V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V6" stroke="var(--color-primary)" strokeWidth="2" />
                <rect x="10" y="11" width="4" height="2" rx="1" fill="white" fillOpacity="0.5" />
              </svg>
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Log in to manage your career journey</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              }
            />

            <div className={styles.passwordWrapper}>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                }
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

            <div className={styles.formOptions}>
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                label="Remember me"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <Link to="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or continue with</span>
          </div>

          <div className={styles.socialGrid}>
            <SocialButton provider="Google" onClick={() => console.log('Google login')} />
            <SocialButton provider="LinkedIn" onClick={() => console.log('LinkedIn login')} />
          </div>

          <p className={styles.footerText}>
            Don't have an account? <Link to="/register" className={styles.signupLink}>Sign up</Link>
          </p>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
};

export default LoginPage;
