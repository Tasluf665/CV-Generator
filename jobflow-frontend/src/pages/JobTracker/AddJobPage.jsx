import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AddJobPage.module.css';
import AppShell from '../../components/layout/AppShell/AppShell';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import TextArea from '../../components/common/TextArea/TextArea';
import Select from '../../components/common/Select/Select';
import Rating from '../../components/common/Rating/Rating';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { createJob, parseJob, scrapeJob } from '../../features/jobTracker/jobSlice';
import { formatJobDescription } from '../../utils/formatJobDescription';

const AddJobPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, scrapeStatus, parseStatus, error } = useSelector((state) => state.jobs);

  const [formData, setFormData] = useState({
    jobUrl: '',
    jobDescription: '',
    jobTitle: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    deadline: '',
    status: 'Bookmarked',
    excitement: 3,
    sourceUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({ ...prev, excitement: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createJob(formData));
    if (createJob.fulfilled.match(resultAction)) {
      navigate(ROUTE_PATHS.JOB_TRACKER);
    }
  };

  const handleParse = async () => {
    if (!formData.jobTitle || !formData.company || !formData.jobDescription) return;

    const resultAction = await dispatch(parseJob({
      jobTitle: formData.jobTitle,
      company: formData.company,
      location: formData.location,
      rawJobDescription: formData.jobDescription,
      sourceUrl: formData.sourceUrl || formData.jobUrl,
      jobType: formData.jobType,
      status: formData.status,
      excitement: formData.excitement,
      deadline: formData.deadline || null,
    }));

    if (parseJob.fulfilled.match(resultAction)) {
      navigate(ROUTE_PATHS.JOB_TRACKER);
    }
  };

  const handleScrape = async () => {
    if (!formData.jobUrl?.trim()) return;

    const resultAction = await dispatch(scrapeJob(formData.jobUrl.trim()));
    if (scrapeJob.fulfilled.match(resultAction)) {
      const scraped = resultAction.payload;
      setFormData((prev) => ({
        ...prev,
        jobTitle: scraped.jobTitle || prev.jobTitle,
        company: scraped.company || prev.company,
        location: scraped.location || prev.location,
        jobDescription: formatJobDescription(scraped.rawJobDescription || prev.jobDescription),
        sourceUrl: scraped.sourceUrl || prev.sourceUrl || prev.jobUrl,
      }));
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <AppShell>
      <div className={styles.overlay}>
        <div className={`${styles.modalCard} premium-card`}>
          <div className={styles.modalHeader}>
            <h2>Add New Job</h2>
            <button className={styles.closeBtn} onClick={handleCancel}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className={styles.modalContent}>
            {error && <div className={styles.error}>{error}</div>}

            {/* Scrape + Parse Section */}
            <div className={styles.aiSection}>
              <p className={styles.aiHint}>
                Paste a LinkedIn URL, scrape the fields, verify them, then send to AI parsing.
              </p>

              <div className={styles.scrapeRow}>
                <Input
                  label="Job URL"
                  placeholder="https://www.linkedin.com/jobs/view/..."
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  className={styles.urlInput}
                />
                <Button
                  type="button"
                  variant="secondary"
                  className={styles.scrapeBtn}
                  onClick={handleScrape}
                  loading={scrapeStatus === 'loading'}
                  disabled={!formData.jobUrl || scrapeStatus === 'loading'}
                >
                  {scrapeStatus === 'loading' ? 'Scraping...' : 'Scrape Data'}
                </Button>
              </div>

              <Input
                label="Title"
                placeholder="Job title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
              />
              <Input
                label="Company"
                placeholder="Company name"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
              <Input
                label="Location"
                placeholder="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />

              <TextArea
                label="Job Description"
                placeholder="Paste full job description here..."
                value={formData.jobDescription}
                onChange={handleChange}
                name="jobDescription"
                className={styles.descriptionArea}
                rows={6}
              />

              <p className={styles.secondaryHint}>Review and edit these fields before AI parsing.</p>

              <Button
                type="button"
                variant="primary"
                className={styles.aiBtn}
                onClick={handleParse}
                loading={parseStatus === 'loading'}
                disabled={!formData.jobTitle || !formData.company || !formData.jobDescription || parseStatus === 'loading'}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                }
              >
                {parseStatus === 'loading' ? 'Parsing...' : 'Parse with AI & Save Job'}
              </Button>
            </div>

            <div className={styles.divider}>
              <span>or fill manually</span>
            </div>

            {/* Manual Form */}
            <form className={styles.manualForm} onSubmit={handleSave}>
              <div className={styles.formGrid}>
                <Select
                  label="Job Type"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  options={[
                    { label: 'Full-time', value: 'Full-time' },
                    { label: 'Part-time', value: 'Part-time' },
                    { label: 'Contract', value: 'Contract' },
                    { label: 'Freelance', value: 'Freelance' },
                    { label: 'Internship', value: 'Internship' }
                  ]}
                />
                <Input
                  label="Deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { label: 'Bookmarked', value: 'Bookmarked' },
                    { label: 'Applied', value: 'Applied' },
                    { label: 'Interviewing', value: 'Interviewing' },
                    { label: 'Accepted', value: 'Accepted' },
                    { label: 'Ghosted', value: 'Ghosted' },
                    { label: 'Closed', value: 'Closed' },
                  ]}
                />
                <Rating
                  label="Excitement"
                  value={formData.excitement}
                  onChange={handleRatingChange}
                />
                <Input
                  label="Source URL (Optional)"
                  placeholder="https://..."
                  name="sourceUrl"
                  value={formData.sourceUrl}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>

          <div className={styles.modalFooter}>
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={status === 'loading'}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : 'Save Job'}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default AddJobPage;
