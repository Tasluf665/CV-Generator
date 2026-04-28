import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../../features/jobTracker/jobSlice';
import { setSelectedJobId, matchResumeWithJob } from '../../../features/resumeBuilder/resumeBuilderSlice';
import { selectCurrentResumeId } from '../../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './JobMatcherPanel.module.css';

const JobMatcherSidebar = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.items);
  const status = useSelector((state) => state.jobs.status);
  const resumeId = useSelector(selectCurrentResumeId);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchJobs({ limit: 100 }));
    }
  }, [status, dispatch]);

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectJob = (jobId) => {
    dispatch(setSelectedJobId(jobId));
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Compare a Job Description to Your Resume</h2>
        <p className={styles.sidebarSubtitle}>Select a job to see how well your resume matches and get AI-powered suggestions.</p>
        
        <div className={styles.searchContainer}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search Jobs" 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.jobList}>
        <h3 className={styles.listTitle}>Your Jobs</h3>
        {status === 'loading' && <p className={styles.loadingText}>Loading jobs...</p>}
        {status === 'succeeded' && filteredJobs.length === 0 && (
          <p className={styles.emptyText}>No jobs found.</p>
        )}
        <div className={styles.jobsWrapper}>
          {filteredJobs.map((job) => (
            <div 
              key={job._id || job.id} 
              className={styles.jobCard}
              onClick={() => handleSelectJob(job._id || job.id)}
            >
              <div className={styles.jobInfo}>
                <h4 className={styles.jobTitle}>{job.title}</h4>
                <p className={styles.jobCompany}>{job.company}</p>
              </div>
              <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobMatcherSidebar;
