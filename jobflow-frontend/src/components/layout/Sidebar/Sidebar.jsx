import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Sidebar.module.css';
import { logout, reset } from '../../../features/auth/authSlice';
import { ROUTE_PATHS } from '../../../routes/routePaths';

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Job Tracker', path: '/jobs', icon: '💼' },
    { name: 'Resume Builder', path: '/resumes', icon: '📝' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate(ROUTE_PATHS.LOGIN);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🚀</span>
        <span className={styles.logoText}>JobFlow</span>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.name}>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            {user?.firstName?.charAt(0) || 'T'}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.firstName || 'Tasluf'}</p>
            <p className={styles.userPlan}>Pro Plan</p>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
