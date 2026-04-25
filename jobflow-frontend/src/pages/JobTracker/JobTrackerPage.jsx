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
import { fetchJobs, updateJob } from '../../features/jobTracker/jobSlice';

const JobTrackerPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, pipelineCounts, pagination, status, error } = useSelector((state) => state.jobs);

  const [selectedStatus, setSelectedStatus] = React.useState(null);

  useEffect(() => {
    dispatch(fetchJobs({ status: selectedStatus }));
  }, [dispatch, selectedStatus]);

  const stages = [
    { id: 'Bookmarked', label: 'Bookmarked', count: pipelineCounts.Bookmarked || 0, bgColor: '#f3f4f6', color: '#4b5563', active: selectedStatus === 'Bookmarked' },
    { id: 'Applying', label: 'Applying', count: pipelineCounts.Applying || 0, bgColor: '#fefce8', color: '#ca8a04', active: selectedStatus === 'Applying' },
    { id: 'Applied', label: 'Applied', count: pipelineCounts.Applied || 0, bgColor: '#eff6ff', color: '#1d4ed8', active: selectedStatus === 'Applied' },
    { id: 'Interviewing', label: 'Interviewing', count: pipelineCounts.Interviewing || 0, bgColor: '#faf5ff', color: '#7e22ce', active: selectedStatus === 'Interviewing' },
    { id: 'Negotiating', label: 'Negotiating', count: pipelineCounts.Negotiating || 0, bgColor: '#fff7ed', color: '#ea580c', active: selectedStatus === 'Negotiating' },
    { id: 'Accepted', label: 'Accepted', count: pipelineCounts.Accepted || 0, bgColor: '#f0fdf4', color: '#16a34a', active: selectedStatus === 'Accepted' },
  ];

  const handleSearch = (e) => {
    dispatch(fetchJobs({ search: e.target.value, status: selectedStatus }));
  };

  const handleUpdateJob = (id, jobData) => {
    dispatch(updateJob({ id, jobData }));
  };

  const handleStageClick = (stageId) => {
    if (selectedStatus === stageId) {
      setSelectedStatus(null); // Clear filter if clicking the same stage
    } else {
      setSelectedStatus(stageId);
    }
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
        <PipelineFunnel stages={stages} onStageClick={handleStageClick} />
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
              onUpdateJob={handleUpdateJob}
            />
            <Pagination
              currentPage={pagination.page}
              totalEntries={pagination.total}
              entriesPerPage={pagination.limit}
              onPageChange={(page) => dispatch(fetchJobs({ page, status: selectedStatus }))}
            />
          </>
        )}
      </div>
    </AppShell>
  );
};

export default JobTrackerPage;
