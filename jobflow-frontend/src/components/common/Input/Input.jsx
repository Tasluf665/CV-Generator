import React from 'react';
import styles from './Input.module.css';

const Input = ({ 
  label, 
  icon, 
  variant = 'default',
  className = '', 
  ...props 
}) => {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.container}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input 
          className={`${styles.input} ${styles[variant]} ${icon ? styles.withIcon : ''}`} 
          {...props} 
        />
      </div>
    </div>
  );
};

export default Input;
