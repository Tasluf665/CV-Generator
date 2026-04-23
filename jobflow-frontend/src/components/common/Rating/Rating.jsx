import React from 'react';
import styles from './Rating.module.css';

const Rating = ({ label, max = 5, value, onChange, className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.stars}>
        {[...Array(max)].map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.star} ${i < value ? styles.filled : ''}`}
            onClick={() => onChange && onChange(i + 1)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

export default Rating;
