import React from 'react';
import styles from './Checkbox.module.css';

const Checkbox = ({ label, id, ...props }) => {
  return (
    <div className={styles.checkboxWrapper}>
      <input 
        type="checkbox" 
        id={id} 
        className={styles.checkbox} 
        {...props} 
      />
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
