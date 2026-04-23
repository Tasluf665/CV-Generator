import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ children, status = 'default', className = '' }) => {
  return (
    <span className={`${styles.badge} ${styles[status]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
