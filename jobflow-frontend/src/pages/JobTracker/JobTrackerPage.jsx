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
  const isLoading = status === 'loading';

  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [locationFilter, setLocationFilter] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortConfig, setSortConfig] = React.useState({ key: 'dateSaved', direction: 'desc' });

  const jobQuery = React.useMemo(() => ({
    status: selectedStatus,
    search: searchTerm,
    location: locationFilter,
    page: currentPage,
    sortBy: sortConfig.key,
    sortOrder: sortConfig.direction,
  }), [selectedStatus, searchTerm, locationFilter, currentPage, sortConfig]);

  useEffect(() => {
    dispatch(fetchJobs(jobQuery));
  }, [dispatch, jobQuery]);

  const stages = [
    { id: 'Bookmarked', label: 'Bookmarked', count: pipelineCounts.Bookmarked || 0, bgColor: '#f3f4f6', color: '#4b5563', active: selectedStatus === 'Bookmarked' },
    { id: 'Applied', label: 'Applied', count: pipelineCounts.Applied || 0, bgColor: '#eff6ff', color: '#1d4ed8', active: selectedStatus === 'Applied' },
    { id: 'Interviewing', label: 'Interviewing', count: pipelineCounts.Interviewing || 0, bgColor: '#faf5ff', color: '#7e22ce', active: selectedStatus === 'Interviewing' },
    { id: 'Accepted', label: 'Accepted', count: pipelineCounts.Accepted || 0, bgColor: '#f0fdf4', color: '#16a34a', active: selectedStatus === 'Accepted' },
    { id: 'Ghosted', label: 'Ghosted', count: pipelineCounts.Ghosted || 0, bgColor: '#f1f5f9', color: '#64748b', active: selectedStatus === 'Ghosted' },
    { id: 'Closed', label: 'Closed', count: pipelineCounts.Closed || 0, bgColor: '#fff1f2', color: '#e11d48', active: selectedStatus === 'Closed' },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleUpdateJob = (id, jobData) => {
    dispatch(updateJob({ id, jobData })).then(() => {
      dispatch(fetchJobs(jobQuery));
    });
  };

  const handleStageClick = (stageId) => {
    setCurrentPage(1);
    if (selectedStatus === stageId) {
      setSelectedStatus(null); // Clear filter if clicking the same stage
    } else {
      setSelectedStatus(stageId);
    }
  };

  const handleSort = (field) => {
    setCurrentPage(1);
    setSortConfig((currentSort) => ({
      key: field,
      direction: currentSort.key === field && currentSort.direction === 'desc' ? 'asc' : 'desc',
    }));
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
            <Input
              placeholder="Filter by location..."
              className={styles.locationFilterInput}
              value={locationFilter}
              onChange={handleLocationFilter}
            />
          </div>
          <div className={styles.rightActions}>
            <Button variant="primary" size="md" icon="+" onClick={() => navigate(ROUTE_PATHS.ADD_JOB)}>Add Job</Button>
          </div>
        </div>

        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={`${styles.tableContent} ${isLoading ? styles.loadingState : ''}`} aria-busy={isLoading}>
            {isLoading && (
              <div className={styles.loadingOverlay} aria-hidden="true">
                <div className={styles.loadingSkeletonHeader}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineShort} />
                </div>
                <div className={styles.loadingSkeletonRows}>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className={styles.loadingSkeletonRow}>
                      <div className={styles.skeletonCellWide} />
                      <div className={styles.skeletonCellMedium} />
                      <div className={styles.skeletonCellMedium} />
                      <div className={styles.skeletonCellSmall} />
                      <div className={styles.skeletonCellSmall} />
                      <div className={styles.skeletonCellSmall} />
                      <div className={styles.skeletonCellStars} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.loadingBackdrop}>
              <JobTable
                jobs={items}
                onRowClick={(id) => navigate(ROUTE_PATHS.JOB_DETAIL.replace(':id', id))}
                onUpdateJob={handleUpdateJob}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <Pagination
                currentPage={pagination.page}
                totalEntries={pagination.total}
                entriesPerPage={pagination.limit}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default JobTrackerPage;
