import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './JobTrackerPage.module.css';
import AppShell from '../../components/layout/AppShell/AppShell';
import PipelineFunnel from '../../components/jobTracker/PipelineFunnel/PipelineFunnel';
import JobTable from '../../components/jobTracker/JobTable/JobTable';
import Pagination from '../../components/jobTracker/Pagination/Pagination';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Badge from '../../components/common/Badge/Badge';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { fetchJobs } from '../../features/jobTracker/jobSlice';

const JobTrackerPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, pipelineCounts, pagination, status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const stages = [
    { id: 'bookmarked', label: 'Bookmarked', count: pipelineCounts.Bookmarked, bgColor: '#f3f4f6', color: '#4b5563' },
    { id: 'applying', label: 'Applying', count: pipelineCounts.Applying, bgColor: '#fefce8', color: '#ca8a04' },
    { id: 'applied', label: 'Applied', count: pipelineCounts.Applied, bgColor: '#eff6ff', color: '#1d4ed8' },
    { id: 'interviewing', label: 'Interviewing', count: pipelineCounts.Interviewing, bgColor: '#faf5ff', color: '#7e22ce' },
    { id: 'negotiating', label: 'Negotiating', count: pipelineCounts.Negotiating, bgColor: '#fff7ed', color: '#ea580c' },
    { id: 'accepted', label: 'Accepted', count: pipelineCounts.Accepted, bgColor: '#f0fdf4', color: '#16a34a' },
  ];

  const handleSearch = (e) => {
    dispatch(fetchJobs({ search: e.target.value }));
  };

  return (
    <AppShell>
      <div className={styles.pageHeader}>
        <div className={styles.headerTitle}>
          <h1>Pipeline Overview</h1>
          <p>Track your job application progress across 6 stages.</p>
        </div>
      </div>

      <div className={`${styles.section} premium-card`}>
        <PipelineFunnel stages={stages} />
      </div>

      <div className={`${styles.tableSection} premium-card`}>
        <div className={styles.tableToolbar}>
          <div className={styles.leftActions}>
            <Input 
              placeholder="Filter jobs..." 
              className={styles.filterInput}
              onChange={handleSearch}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              }
            />
            <Badge status="default" className={styles.selectionBadge}>0 selected</Badge>
          </div>
          <div className={styles.rightActions}>
            <div className={styles.viewToggle}>
              <Button variant="secondary" size="sm" icon="📋" />
              <Button variant="ghost" size="sm" icon="🎴" />
            </div>
            <Button variant="primary" size="md" icon="+" onClick={() => navigate(ROUTE_PATHS.ADD_JOB)}>Add Job</Button>
          </div>
        </div>
        
        {status === 'loading' ? (
          <div className={styles.loading}>Loading jobs...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <JobTable 
              jobs={items} 
              onRowClick={(id) => navigate(ROUTE_PATHS.JOB_DETAIL.replace(':id', id))} 
            />
            <Pagination 
              currentPage={pagination.page} 
              totalEntries={pagination.total} 
              entriesPerPage={pagination.limit} 
              onPageChange={(page) => dispatch(fetchJobs({ page }))}
            />
          </>
        )}
      </div>
    </AppShell>
  );
};

export default JobTrackerPage;
