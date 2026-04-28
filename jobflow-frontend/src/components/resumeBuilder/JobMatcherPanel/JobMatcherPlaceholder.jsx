import React from 'react';
import styles from './JobMatcherPanel.module.css';

const JobMatcherPlaceholder = () => {
  return (
    <div className={styles.placeholderContainer}>
      <div className={styles.placeholderContent}>
        <div className={styles.placeholderIconWrapper}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.placeholderIcon}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <h2 className={styles.placeholderTitle}>Select a Job to Match</h2>
        <p className={styles.placeholderSubtitle}>
          Choose a job from the sidebar to analyze your resume against its requirements and get personalized optimization tips.
        </p>
      </div>
    </div>
  );
};

export default JobMatcherPlaceholder;
