import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './JobDetailPage.module.css';
import AppShell from '../../components/layout/AppShell/AppShell';
import JobCard from '../../components/jobTracker/JobCard/JobCard';
import JobDetailPanel from '../../components/jobTracker/JobDetailPanel/JobDetailPanel';
import Button from '../../components/common/Button/Button';
import { fetchJobs, fetchJobById, setSelectedJob } from '../../features/jobTracker/jobSlice';
import { ROUTE_PATHS } from '../../routes/routePaths';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items: jobs, selectedJob, status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    // Fetch all jobs for the sidebar if they haven't been fetched yet
    if (jobs.length === 0) {
      dispatch(fetchJobs());
    }
  }, [dispatch, jobs.length]);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
  }, [dispatch, id]);

  const isJobLoading = status === 'loading' || !selectedJob || selectedJob._id !== id;

  const handleJobClick = (jobId) => {
    navigate(ROUTE_PATHS.JOB_DETAIL.replace(':id', jobId));
  };

  const handleBackToJobs = () => {
    navigate(ROUTE_PATHS.JOB_TRACKER);
  };

  if (isJobLoading && !error) {
    return (
      <AppShell noPadding>
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading job details...</p>
        </div>
      </AppShell>
    );
  }

  if (error && !selectedJob) {
    return (
      <AppShell>
        <div className={styles.error}>
          <p>{error}</p>
          <Button onClick={handleBackToJobs}>Back to Jobs</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell noPadding>
      <div className={styles.pageContainer}>
        <header className={styles.topNav}>
          <div className={styles.navLinks}>
            <button className={`${styles.navLink} ${styles.active}`}>All Jobs</button>
            <button className={styles.navLink}>Active</button>
            <button className={styles.navLink}>Archived</button>
          </div>
          <div className={styles.topActions}>
            <Button variant="secondary" size="sm">Edit</Button>
            <Button variant="primary" size="sm">Share</Button>
            <div className={styles.userProfile}>
              <button className={styles.iconBtn}>🔔</button>
              <div className={styles.avatar}>👤</div>
            </div>
          </div>
        </header>

        <div className={styles.mainWorkspace}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <button className={styles.backBtn} onClick={handleBackToJobs}>
                <span className={styles.backIcon}>←</span>
                <span>BACK TO JOBS</span>
              </button>
            </div>
            <div className={styles.jobList}>
              {jobs.map(job => (
                <JobCard 
                  key={job._id} 
                  job={job} 
                  active={id === job._id}
                  onClick={() => handleJobClick(job._id)}
                />
              ))}
            </div>
          </aside>
          
          <main className={styles.detailArea}>
            <JobDetailPanel job={selectedJob} />
          </main>
        </div>
      </div>
    </AppShell>
  );
};

export default JobDetailPage;
