import React from 'react';
import styles from './JobInfoTab.module.css';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Badge from '../../../common/Badge/Badge';
import Button from '../../../common/Button/Button';

const JobInfoTab = ({ job }) => {
  if (!job) return null;

  const { dateSaved, deadline, parsedData } = job;
  const { summary, requirements, responsibilities, extractedKeywords } = parsedData || {};

  const displayDescription = summary || 
    (job.rawJobDescription ? 
      (job.rawJobDescription.length > 300 ? job.rawJobDescription.substring(0, 300) + '...' : job.rawJobDescription) : 
      'No description available.');

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <SectionCard 
          title="Dates" 
          icon="📅"
          headerActions={
            <button className={styles.collapseBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>
          }
        >
          <div className={styles.datesGrid}>
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>DATE SAVED</span>
              <span className={styles.dateValue}>
                {dateSaved ? new Date(dateSaved).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </span>
            </div>
            <div className={styles.dateItem}>
              <span className={styles.dateLabel}>APPLICATION DEADLINE</span>
              <div className={styles.addDate}>
                <span className={styles.icon}>⏰</span>
                <span className={styles.linkText}>
                  {deadline ? new Date(deadline).toLocaleDateString() : 'Add Date'}
                </span>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard 
          title="Job Description" 
          icon="📄"
          headerActions={
            <Button variant="ghost" size="sm" icon="✏️">Edit</Button>
          }
        >
          <div className={styles.description}>
            <p>{displayDescription}</p>
            {responsibilities && responsibilities.length > 0 && (
              <ul className={styles.bulletList}>
                {responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
            <button className={styles.readMore}>Read Full Description...</button>
          </div>
        </SectionCard>
      </div>

      <div className={styles.rightColumn}>
        <SectionCard 
          title="AI Extracted Keywords" 
          icon="💡"
          variant="ai"
          headerActions={
            <button className={styles.refreshBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
          }
        >
          <p className={styles.aiInfo}>Highlighting crucial skills to include in your resume for this specific role.</p>
          <div className={styles.tagCloud}>
            {extractedKeywords?.map(tag => (
              <Badge key={tag} status="success" className={styles.keywordTag}>
                {tag} <span className={styles.check}>✓</span>
              </Badge>
            )) || <p>No keywords extracted.</p>}
          </div>
        </SectionCard>

        <SectionCard 
          title="Requirements" 
          icon="📋"
        >
          <div className={styles.requirementsList}>
            {requirements?.map((req, index) => (
              <div key={index} className={styles.requirementItem}>
                <div className={styles.checkbox}>
                  {/* Since we don't have per-requirement status in DB, we'll just show them as a list */}
                </div>
                <span className={styles.reqUnchecked}>{req}</span>
              </div>
            )) || <p>No requirements listed.</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default JobInfoTab;
