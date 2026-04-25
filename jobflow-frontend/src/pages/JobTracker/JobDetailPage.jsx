import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './JobDetailPage.module.css';
import AppShell from '../../components/layout/AppShell/AppShell';
import JobDetailPanel from '../../components/jobTracker/JobDetailPanel/JobDetailPanel';
import Button from '../../components/common/Button/Button';
import { fetchJobById, updateJob, deleteJob } from '../../features/jobTracker/jobSlice';
import { ROUTE_PATHS } from '../../routes/routePaths';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedJob, status, error } = useSelector((state) => state.jobs);

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ jobTitle: '', company: '', location: '', sourceUrl: '' });

  // Delete confirm state
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchJobById(id));
    }
  }, [dispatch, id]);

  // Sync editForm when selectedJob loads
  useEffect(() => {
    if (selectedJob) {
      setEditForm({
        jobTitle: selectedJob.jobTitle || '',
        company: selectedJob.company || '',
        location: selectedJob.location || '',
        sourceUrl: selectedJob.sourceUrl || '',
      });
    }
  }, [selectedJob]);

  const isJobLoading = status === 'loading' || !selectedJob || selectedJob._id !== id;

  const handleBackToJobs = () => {
    navigate(ROUTE_PATHS.JOB_TRACKER);
  };

  const handleEditSave = () => {
    if (!editForm.jobTitle.trim() || !editForm.company.trim()) return;
    dispatch(updateJob({ id, jobData: editForm }));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteJob(id));
    navigate(ROUTE_PATHS.JOB_TRACKER);
  };

  if (isJobLoading && !error) {
    return (
      <AppShell>
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
    <AppShell>
      <div className={styles.pageContainer}>

        {/* Top action bar */}
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={handleBackToJobs}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Jobs
          </button>

          <div className={styles.topActions}>
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setIsDeleting(true)}>
              🗑️ Delete
            </Button>
          </div>
        </div>

        {/* Main content — full width, no sidebar */}
        <div className={styles.detailArea}>
          <JobDetailPanel job={selectedJob} />
        </div>

        {/* Edit Modal */}
        {isEditing && (
          <div className={styles.modalOverlay} onClick={() => setIsEditing(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Edit Job</h2>
                <button className={styles.modalClose} onClick={() => setIsEditing(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Title</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={editForm.jobTitle}
                    onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    placeholder="e.g. Acme Inc."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="e.g. Amsterdam, Netherlands"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Job Link (URL)</label>
                  <input
                    className={styles.input}
                    type="url"
                    value={editForm.sourceUrl}
                    onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })}
                    placeholder="e.g. https://linkedin.com/jobs/..."
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleEditSave}>Save Changes</Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleting && (
          <div className={styles.modalOverlay} onClick={() => setIsDeleting(false)}>
            <div className={`${styles.modal} ${styles.modalSm}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Delete Job?</h2>
                <button className={styles.modalClose} onClick={() => setIsDeleting(false)}>✕</button>
              </div>
              <div className={styles.modalBody}>
                <p className={styles.deleteWarning}>
                  Are you sure you want to delete <strong>{selectedJob?.jobTitle}</strong> at <strong>{selectedJob?.company}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className={styles.modalFooter}>
                <Button variant="secondary" size="sm" onClick={() => setIsDeleting(false)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>Yes, Delete</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
};

export default JobDetailPage;
