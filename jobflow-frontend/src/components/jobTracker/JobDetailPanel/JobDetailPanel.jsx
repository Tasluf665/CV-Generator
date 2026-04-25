import React, { useState } from 'react';
import styles from './JobDetailPanel.module.css';
import StatusPipeline from './StatusPipeline';
import GuidanceBanner from './GuidanceBanner';
import JobInfoTab from './tabs/JobInfoTab';
import Button from '../../common/Button/Button';
import StarRating from '../../common/StarRating/StarRating';

const JobDetailPanel = ({ job }) => {
  const [activeTab, setActiveTab] = useState('job-info');

  if (!job) {
    return (
      <div className={styles.empty}>
        <p>Select a job to view details</p>
      </div>
    );
  }

  const tabs = [
    { id: 'job-info', label: 'Job Info' },
    { id: 'notes', label: 'Notes' },
    { id: 'resumes', label: 'Resumes' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'email-templates', label: 'Email Templates' },
    { id: 'checklist', label: 'Check List' },
    { id: 'practice-interview', label: 'Practice Interview' },
  ];

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.titleInfo}>
            <h1 className={styles.title}>{job.jobTitle}</h1>
            <div className={styles.meta}>
              <span className={styles.company}>{job.company}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.location}>{job.location || 'Remote'}</span>
              <span className={styles.dot}>•</span>
              <button className={styles.addSalary}>
                {job.parsedData?.salaryRange?.min ? (
                  `${job.parsedData.salaryRange.currency || '$'}${job.parsedData.salaryRange.min}${job.parsedData.salaryRange.max ? ` - ${job.parsedData.salaryRange.max}` : ''}`
                ) : 'Add Salary Range'}
              </button>
            </div>
            <div className={styles.rating}>
              <StarRating rating={job.excitement || 0} size="sm" />
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn}>🔖</button>
            <button className={styles.iconBtn}>...</button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.pipelineSection}>
          <StatusPipeline currentStatus={job.status} />
        </section>

        <section className={styles.guidanceSection}>
          <GuidanceBanner 
            progress={0} 
            message="Review the job description, extract keywords, and upload your resume to move to 'Applying'." 
          />
        </section>

        <nav className={styles.tabsNav}>
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`${styles.tabLink} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.tabContent}>
          {activeTab === 'job-info' && <JobInfoTab job={job} />}
          {activeTab !== 'job-info' && (
            <div className={styles.placeholderTab}>
              <h3>{tabs.find(t => t.id === activeTab).label}</h3>
              <p>Content for {tabs.find(t => t.id === activeTab).label} will be here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPanel;
