import React from 'react';
import styles from './PipelineFunnel.module.css';

const PipelineFunnel = ({ stages, onStageClick }) => {
  return (
    <div className={styles.funnel}>
      {stages.map((stage, index) => (
        <div 
          key={stage.id} 
          className={`${styles.stage} ${stage.active ? styles.active : ''}`}
          style={{ '--stage-bg': stage.bgColor, '--stage-color': stage.color }}
          onClick={() => onStageClick && onStageClick(stage.id)}
        >
          <div className={styles.content}>
            <span className={styles.count}>{stage.count}</span>
            <span className={styles.label}>{stage.label}</span>
          </div>
          {index < stages.length - 1 && (
            <div className={styles.chevron}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PipelineFunnel;
