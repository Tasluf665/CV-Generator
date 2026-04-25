import React from 'react';
import styles from './JobCard.module.css';
import Badge from '../../common/Badge/Badge';

const JobCard = ({ job, active, onClick }) => {
  const { jobTitle, company, location, status, postedAt, dateSaved } = job;

  return (
    <div 
      className={`${styles.card} ${active ? styles.active : ''}`} 
      onClick={onClick}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{jobTitle}</h3>
      </div>
      <div className={styles.meta}>
        <span>{company}</span>
        <span className={styles.dot}>•</span>
        <span>{location}</span>
      </div>
      <div className={styles.footer}>
        <Badge status={status.toLowerCase()} className={styles.statusBadge}>
          {status}
        </Badge>
        <span className={styles.timeAgo}>
          {postedAt || new Date(dateSaved).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default JobCard;
