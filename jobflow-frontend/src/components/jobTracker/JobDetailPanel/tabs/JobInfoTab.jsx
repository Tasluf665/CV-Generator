import React from 'react';
import styles from './JobInfoTab.module.css';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Badge from '../../../common/Badge/Badge';
import Button from '../../../common/Button/Button';

const JobInfoTab = ({ job }) => {
  const [showRaw, setShowRaw] = React.useState(false);

  if (!job) return null;

  const { dateSaved, deadline, parsedData, rawJobDescription } = job;
  const { summary, requirements, responsibilities, extractedKeywords } = parsedData || {};

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
            {summary && (
              <div className={styles.subSection}>
                <h4 className={styles.subTitle}>SUMMARY</h4>
                <p>{summary}</p>
              </div>
            )}

            {requirements && requirements.length > 0 && (
              <div className={styles.subSection}>
                <h4 className={styles.subTitle}>REQUIREMENTS</h4>
                <ul className={styles.bulletList}>
                  {requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {responsibilities && responsibilities.length > 0 && (
              <div className={styles.subSection}>
                <h4 className={styles.subTitle}>RESPONSIBILITIES</h4>
                <ul className={styles.bulletList}>
                  {responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.rawSection}>
              <button 
                className={styles.readMore}
                onClick={() => setShowRaw(!showRaw)}
              >
                {showRaw ? 'Hide Raw Description' : 'View Raw Job Description...'}
              </button>
              
              {showRaw && (
                <div className={styles.rawContent}>
                  {rawJobDescription || 'No raw description available.'}
                </div>
              )}
            </div>
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
          title="Insights & Notes" 
          icon="📓"
        >
          <div className={styles.placeholderNote}>
            <p>Add notes about company culture, interview tips, or follow-up strategies here.</p>
            <Button variant="secondary" size="sm" block>Add Note</Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default JobInfoTab;
