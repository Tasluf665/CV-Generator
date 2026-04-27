import React from 'react';
import styles from './SectionCard.module.css';

const SectionCard = ({ 
  title, 
  icon, 
  isExpanded, 
  onToggle, 
  onAdd,
  children, 
  className = '',
  isHighlighted = false
}) => {
  return (
    <div className={`${styles.card} ${isHighlighted ? styles.highlighted : ''} ${className}`}>
      <div className={styles.header} onClick={onToggle}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>{icon}</span>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.actions}>
            {onAdd && (
              <button 
                className={styles.actionBtn} 
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0V12M0 6H12" stroke="currentColor" strokeWidth="2"/></svg>
              </button>
            )}
            <button className={styles.actionBtn} onClick={(e) => e.stopPropagation()}>
              <svg width="4" height="14" viewBox="0 0 4 14" fill="none"><circle cx="2" cy="2" r="2" fill="currentColor"/><circle cx="2" cy="7" r="2" fill="currentColor"/><circle cx="2" cy="12" r="2" fill="currentColor"/></svg>
            </button>
          </div>
          <button className={`${styles.toggleBtn} ${isExpanded ? styles.expanded : ''}`}>
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className={styles.content}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
