import React from 'react';
import styles from './TextArea.module.css';

const TextArea = ({ label, placeholder, value, onChange, rows = 4, className = '', ...props }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={styles.textarea}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        {...props}
      />
    </div>
  );
};

export default TextArea;
