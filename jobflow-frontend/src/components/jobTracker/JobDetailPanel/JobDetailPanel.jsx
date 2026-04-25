import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './JobDetailPanel.module.css';
import StatusPipeline from './StatusPipeline';
import JobInfoTab from './tabs/JobInfoTab';
import StarRating from '../../common/StarRating/StarRating';
import { updateJob } from '../../../features/jobTracker/jobSlice';

const JobDetailPanel = ({ job }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('job-info');
  const [isNotesEditing, setIsNotesEditing] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

  useEffect(() => {
    setNotesDraft(job?.notes || '');
    setIsNotesEditing(false);
  }, [job?._id, job?.notes]);

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

  const handleSaveNotes = () => {
    if (!job?._id) return;
    dispatch(updateJob({ id: job._id, jobData: { notes: notesDraft } }));
    setIsNotesEditing(false);
  };

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.titleInfo}>
            <h1 className={styles.title}>{job.jobTitle}</h1>
            {job.sourceUrl && (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.jobLink}
              >
                {job.sourceUrl}
              </a>
            )}
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
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.pipelineSection}>
          <StatusPipeline currentStatus={job.status} />
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
          {activeTab === 'job-info' && (
            <JobInfoTab
              job={job}
              onOpenNotesTab={() => setActiveTab('notes')}
            />
          )}
          {activeTab === 'notes' && (
            <div
              className={styles.notesCard}
              onClick={() => {
                if (!isNotesEditing) setIsNotesEditing(true);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isNotesEditing) {
                  e.preventDefault();
                  setIsNotesEditing(true);
                }
              }}
            >
              <h3 className={styles.notesTitle}>Notes</h3>

              {!isNotesEditing ? (
                <p className={styles.notesPreview}>
                  {job.notes?.trim() || 'Content for Notes will be here.'}
                </p>
              ) : (
                <>
                  <textarea
                    className={styles.notesTextarea}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Write your notes here..."
                    autoFocus
                  />
                  <div className={styles.notesActions}>
                    <button
                      className={styles.notesCancelBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotesDraft(job.notes || '');
                        setIsNotesEditing(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.notesSaveBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveNotes();
                      }}
                    >
                      Save Notes
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab !== 'job-info' && activeTab !== 'notes' && (
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
