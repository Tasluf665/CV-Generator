import React, { useState } from 'react';
import styles from './ResumeCard.module.css';
import Badge from '../../common/Badge/Badge';

const ResumeCard = ({ title, matchScore, lastModified, onClick, onDelete, onDuplicate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
    setIsMenuOpen(false);
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    if (onDuplicate) onDuplicate();
    setIsMenuOpen(false);
  };

  // Determine status color for match score
  const getStatusColor = (score) => {
    if (score >= 80) return 'accepted';
    if (score >= 60) return 'interviewing';
    return 'applied'; // Neutral/Low
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.actionButtonsTop}>
        <button className={styles.iconBtnTop} onClick={handleDuplicate} aria-label="Duplicate resume" title="Duplicate">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button className={`${styles.iconBtnTop} ${styles.deleteBtnTop}`} onClick={handleDelete} aria-label="Delete resume" title="Delete">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <div className={styles.previewContainer}>
        <div className={styles.previewIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>

        <div className={styles.footer}>
          <div className={styles.stats}>
            {matchScore !== undefined && (
              <Badge status={getStatusColor(matchScore)} className={styles.matchBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                {matchScore}% Match
              </Badge>
            )}

            <div className={styles.date}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {lastModified}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeCard;
