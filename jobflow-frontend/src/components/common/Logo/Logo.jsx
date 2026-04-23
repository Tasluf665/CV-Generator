import React from 'react';
import styles from './Logo.module.css';

const Logo = ({ size = 24, className = '' }) => {
  return (
    <div className={`${styles.logo} ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="6" width="18" height="14" rx="2" fill="var(--color-primary)" />
        <path d="M9 6V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V6" stroke="var(--color-primary)" strokeWidth="2" />
        <rect x="10" y="11" width="4" height="2" rx="1" fill="white" fillOpacity="0.5" />
      </svg>
      <span className={styles.text} style={{ fontSize: `${size * 0.83}px` }}>JobFlow</span>
    </div>
  );
};

export default Logo;
