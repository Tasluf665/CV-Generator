import React from 'react';
import styles from './StatusPipeline.module.css';

const stages = [
  { id: 'bookmarked', label: 'Bookmarked', icon: '🔖' },
  { id: 'applying', label: 'Applying', icon: '✈️' },
  { id: 'applied', label: 'Applied', icon: '📧' },
  { id: 'interviewing', label: 'Interviewing', icon: '💬' },
  { id: 'negotiating', label: 'Negotiating', icon: '🤝' },
  { id: 'accepted', label: 'Accepted', icon: '✅' },
  { id: 'closed', label: 'Close Job', icon: '🚫' },
];

const StatusPipeline = ({ currentStatus }) => {
  const currentIndex = stages.findIndex(s => s.id === currentStatus.toLowerCase());

  return (
    <div className={styles.pipeline}>
      <div className={styles.line}>
        <div 
          className={styles.progressLine} 
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        ></div>
      </div>
      <div className={styles.stages}>
        {stages.map((stage, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div 
              key={stage.id} 
              className={`${styles.stage} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
            >
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{stage.icon}</span>
              </div>
              <span className={styles.label}>{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusPipeline;
