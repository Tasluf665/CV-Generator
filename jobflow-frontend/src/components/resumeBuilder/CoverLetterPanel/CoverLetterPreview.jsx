import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectCLContent,
  selectCLSelectedJobId,
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import { selectResumeData } from '../../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './CoverLetterPreview.module.css';

const CoverLetterPreview = () => {
  const content = useSelector(selectCLContent);
  const resumeData = useSelector(selectResumeData);
  const jobs = useSelector((state) => state.jobs.items);
  const selectedJobId = useSelector(selectCLSelectedJobId);

  const contact = resumeData?.contact || {};
  const fullName = [
    contact.firstName,
    contact.lastName,
  ].filter(Boolean).join(' ').toUpperCase() || 'YOUR NAME';

  const selectedJob = jobs?.find((j) => (j._id || j.id) === selectedJobId);

  // Format today's date
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Split letter into paragraphs for nice rendering
  const paragraphs = content
    ? content.split(/\n\n+/).filter((p) => p.trim())
    : [];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.a4Page}>
        {content ? (
          <>
            {/* Header */}
            <header className={styles.letterHeader}>
              <h1 className={styles.name}>{fullName}</h1>
              <div className={styles.contactLine}>
                {[
                  contact.email,
                  contact.phone,
                  contact.city && contact.state
                    ? `${contact.city}, ${contact.state}`
                    : contact.city || contact.state,
                  contact.linkedin,
                ]
                  .filter(Boolean)
                  .map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className={styles.sep}>·</span>}
                      <span className={styles.contactItem}>{item}</span>
                    </React.Fragment>
                  ))}
              </div>
              <div className={styles.divider} />
            </header>

            {/* Body */}
            <div className={styles.body}>
              {paragraphs.map((para, i) => (
                <p key={i} className={styles.paragraph}>
                  {para.trim()}
                </p>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className={styles.placeholderTitle}>Cover Letter Preview</h3>
            <p className={styles.placeholderText}>
              Select a job, choose a prompt, and click <strong>Generate Cover Letter</strong> to see your letter here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterPreview;
