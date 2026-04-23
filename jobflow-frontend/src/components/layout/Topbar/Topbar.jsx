import React from 'react';
import styles from './Topbar.module.css';
import Input from '../../common/Input/Input';

const Topbar = () => {
  return (
    <header className={styles.topbar}>
      <div className={styles.search}>
        <Input 
          placeholder="Search jobs, companies..." 
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          }
        />
      </div>
      
      <div className={styles.actions}>
        <div className={styles.navLinks}>
          <a href="/analytics" className={styles.navLink}>Analytics</a>
          <a href="/reports" className={styles.navLink}>Reports</a>
        </div>
        
        <button className={styles.notificationBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        
        <div className={styles.divider}></div>
        
        <div className={styles.profile}>
          <img src="https://ui-avatars.com/api/?name=Tasluf&background=00b894&color=fff" alt="User Profile" className={styles.avatar} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
