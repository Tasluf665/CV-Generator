import React from 'react';
import styles from './SectionCard.module.css';

const SectionCard = ({ title, icon, children, headerActions, className, variant = 'default' }) => {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <h3 className={styles.title}>{title}</h3>
        </div>
        {headerActions && <div className={styles.actions}>{headerActions}</div>}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default SectionCard;
