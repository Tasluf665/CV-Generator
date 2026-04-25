import React from 'react';
import styles from './StarRating.module.css';

const StarRating = ({ rating, max = 5, size = 'md' }) => {
  return (
    <div className={`${styles.rating} ${styles[size]}`}>
      {[...Array(max)].map((_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
