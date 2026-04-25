import React from 'react';
import styles from './GuidanceBanner.module.css';

const GuidanceBanner = ({ progress, message }) => {
  return (
    <div className={styles.banner}>
      <div className={styles.left}>
        <div className={styles.iconCircle}>
          <span className={styles.icon}>💡</span>
        </div>
        <div className={styles.text}>
          <h4 className={styles.title}>Bookmarked Steps: {progress}% Complete</h4>
          <p className={styles.message}>{message}</p>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
        <button className={styles.arrowButton}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GuidanceBanner;
