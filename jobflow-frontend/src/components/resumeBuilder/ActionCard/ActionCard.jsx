import React from 'react';
import styles from './ActionCard.module.css';

const ActionCard = ({ title, icon, color, onClick }) => {
  return (
    <button 
      className={styles.card} 
      onClick={onClick}
      style={{ '--accent-color': color }}
    >
      <div className={styles.iconWrapper} style={{ backgroundColor: `var(--accent-color-bg, ${color}15)` }}>
        <div className={styles.icon}>
          {icon}
        </div>
      </div>
      <span className={styles.title}>{title}</span>
    </button>
  );
};

export default ActionCard;
