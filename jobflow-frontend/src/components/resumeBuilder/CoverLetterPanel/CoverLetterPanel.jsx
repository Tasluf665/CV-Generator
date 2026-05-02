import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../../features/jobTracker/jobSlice';
import {
  generateCoverLetterAction,
  updateCoverLetterContent,
  fetchCoverLettersForResume,
  setCLPrompts,
  setCLActivePrompt,
  setCLSelectedJob,
  setCLContent,
  resetCoverLetter,
  restoreCLId,
  saveResume,
} from '../../../features/resumeBuilder/resumeBuilderSlice';
import {
  selectCLPrompts,
  selectCLActivePromptIndex,
  selectCLSelectedJobId,
  selectCLContent,
  selectCLLoading,
  selectCLError,
  selectCLSavedId,
  selectCurrentResumeId,
  selectResumeData,
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './CoverLetterPanel.module.css';

const CoverLetterPanel = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.items);
  const jobsStatus = useSelector((state) => state.jobs.status);
  const resumeId = useSelector(selectCurrentResumeId);
  const resumeData = useSelector(selectResumeData);
  const prompts = useSelector(selectCLPrompts);
  const activePromptIndex = useSelector(selectCLActivePromptIndex);
  const selectedJobId = useSelector(selectCLSelectedJobId);
  const generatedContent = useSelector(selectCLContent);
  const isLoading = useSelector(selectCLLoading);
  const error = useSelector(selectCLError);
  const savedCoverLetterId = useSelector(selectCLSavedId);
  const allCoverLetters = useSelector((state) => state.resumeBuilder.coverLetter.allCoverLetters);

  const [promptMode, setPromptMode] = useState('view'); // 'view' | 'edit'
  const [newPromptText, setNewPromptText] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const saveContentTimeoutRef = useRef(null);
  const savePromptsTimeoutRef = useRef(null);
  const hasFetchedCoverLetters = useRef(false);

  // Load jobs
  useEffect(() => {
    if (jobsStatus === 'idle') {
      dispatch(fetchJobs({ limit: 100 }));
    }
  }, [jobsStatus, dispatch]);

  // Fetch existing cover letters for this resume (once per mount)
  useEffect(() => {
    if (resumeId && !hasFetchedCoverLetters.current) {
      hasFetchedCoverLetters.current = true;
      dispatch(fetchCoverLettersForResume(resumeId));
    }
  }, [resumeId, dispatch]);

  // When user selects a job, check if a cover letter already exists for it
  useEffect(() => {
    if (!selectedJobId || generatedContent) return;
    const existing = allCoverLetters.find(
      (cl) =>
        cl.jobId?._id === selectedJobId || cl.jobId === selectedJobId
    );
    if (existing) {
      dispatch(setCLContent(existing.content));
      // savedCoverLetterId is set during generation, but also restore it here
      dispatch(restoreCLId(existing._id));
    }
  }, [selectedJobId, allCoverLetters, generatedContent, dispatch]);

  // Debounced save of edited cover letter content
  useEffect(() => {
    if (!savedCoverLetterId || !generatedContent) return;
    if (saveContentTimeoutRef.current) clearTimeout(saveContentTimeoutRef.current);
    saveContentTimeoutRef.current = setTimeout(() => {
      dispatch(updateCoverLetterContent({ id: savedCoverLetterId, content: generatedContent }));
    }, 1500);
    return () => clearTimeout(saveContentTimeoutRef.current);
  }, [generatedContent, savedCoverLetterId, dispatch]);

  // Debounced save of prompts to the resume document
  const savePromptsToResume = (updatedPrompts) => {
    if (!resumeId) return;
    if (savePromptsTimeoutRef.current) clearTimeout(savePromptsTimeoutRef.current);
    savePromptsTimeoutRef.current = setTimeout(() => {
      dispatch(
        saveResume({
          id: resumeId,
          data: { ...resumeData, coverLetterPrompts: updatedPrompts },
        })
      );
    }, 800);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.company?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const activePrompt = activePromptIndex !== null ? prompts[activePromptIndex] : null;
  const canGenerate = selectedJobId && activePromptIndex !== null && !isLoading;

  const handleGenerate = () => {
    if (!canGenerate || !resumeId) return;
    dispatch(
      generateCoverLetterAction({
        resumeId,
        jobId: selectedJobId,
        prompt: activePrompt,
        tone: 'Professional',
        length: 'Standard',
      })
    );
  };

  const handleSavePrompt = () => {
    if (!newPromptText.trim()) return;
    const updated = [...prompts, newPromptText.trim()];
    dispatch(setCLPrompts(updated));
    dispatch(setCLActivePrompt(updated.length - 1));
    savePromptsToResume(updated);
    setNewPromptText('');
    setPromptMode('view');
  };

  const handleDeletePrompt = (e, idx) => {
    e.stopPropagation();
    const updated = prompts.filter((_, i) => i !== idx);
    dispatch(setCLPrompts(updated));
    if (activePromptIndex === idx) dispatch(setCLActivePrompt(null));
    else if (activePromptIndex > idx) dispatch(setCLActivePrompt(activePromptIndex - 1));
    savePromptsToResume(updated);
  };

  const handleTogglePrompt = (idx) => {
    dispatch(setCLActivePrompt(activePromptIndex === idx ? null : idx));
  };

  const handleSelectJob = (jobId) => {
    const isDeselect = selectedJobId === jobId;
    dispatch(setCLSelectedJob(isDeselect ? null : jobId));
    if (!isDeselect) {
      // Try to restore existing cover letter for this job
      dispatch(resetCoverLetter());
      const existing = allCoverLetters.find(
        (cl) => cl.jobId?._id === jobId || cl.jobId === jobId
      );
      if (existing) {
        dispatch(setCLContent(existing.content));
        dispatch(restoreCLId(existing._id));
      }
    }
  };

  const hasContent = !!generatedContent;

  return (
    <div className={styles.panel}>
      {/* ─── JOB SELECTOR ─── */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          Select a Job
        </h3>

        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search jobs..."
            className={styles.searchInput}
            value={jobSearch}
            onChange={(e) => setJobSearch(e.target.value)}
          />
        </div>

        <div className={styles.jobList}>
          {jobsStatus === 'loading' && <p className={styles.hint}>Loading jobs...</p>}
          {jobsStatus === 'succeeded' && filteredJobs.length === 0 && (
            <p className={styles.hint}>No jobs found.</p>
          )}
          {filteredJobs.map((job) => {
            const jobId = job._id || job.id;
            const isSelected = selectedJobId === jobId;
            const hasSavedLetter = allCoverLetters.some(
              (cl) => cl.jobId?._id === jobId || cl.jobId === jobId
            );
            return (
              <div
                key={jobId}
                className={`${styles.jobCard} ${isSelected ? styles.jobCardActive : ''}`}
                onClick={() => handleSelectJob(jobId)}
              >
                <div className={`${styles.jobRadio} ${isSelected ? styles.jobRadioActive : ''}`}>
                  {isSelected && <div className={styles.jobRadioDot} />}
                </div>
                <div className={styles.jobInfo}>
                  <span className={styles.jobTitle}>{job.jobTitle || 'Untitled'}</span>
                  <span className={styles.jobCompany}>{job.company || ''}</span>
                </div>
                {hasSavedLetter && (
                  <span className={styles.savedBadge} title="Cover letter saved">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── PROMPT MANAGER ─── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Prompt
          </h3>
          {promptMode === 'view' && (
            <button className={styles.addBtn} onClick={() => setPromptMode('edit')}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add
            </button>
          )}
        </div>

        {promptMode === 'view' ? (
          <div className={styles.promptList}>
            {prompts.length === 0 && (
              <p className={styles.hint}>No prompts yet. Click <strong>Add</strong> to create one.</p>
            )}
            {prompts.map((text, idx) => {
              const isActive = activePromptIndex === idx;
              return (
                <div
                  key={idx}
                  className={`${styles.promptItem} ${isActive ? styles.promptItemActive : ''}`}
                  onClick={() => handleTogglePrompt(idx)}
                >
                  <div className={`${styles.checkbox} ${isActive ? styles.checkboxActive : ''}`}>
                    {isActive && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <p className={styles.promptText}>{text}</p>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => handleDeletePrompt(e, idx)}
                    title="Delete prompt"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.promptEditArea}>
            <textarea
              className={styles.promptTextarea}
              value={newPromptText}
              onChange={(e) => setNewPromptText(e.target.value)}
              placeholder="e.g. Focus on my leadership skills and experience with React. Keep it under 300 words and make it enthusiastic."
              rows={5}
              autoFocus
            />
            <div className={styles.promptActions}>
              <button className={styles.cancelBtn} onClick={() => { setPromptMode('view'); setNewPromptText(''); }}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSavePrompt}>
                Save Prompt
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── GENERATE BUTTON ─── */}
      {!hasContent && (
        <div className={styles.generateArea}>
          {error && <p className={styles.errorText}>{error}</p>}
          {!selectedJobId && <p className={styles.hint}>↑ Select a job to get started</p>}
          {selectedJobId && activePromptIndex === null && (
            <p className={styles.hint}>↑ Select or create a prompt</p>
          )}
          <button
            className={styles.generateBtn}
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            {isLoading ? (
              <>
                <div className={styles.spinner} />
                Generating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Generate Cover Letter
              </>
            )}
          </button>
        </div>
      )}

      {/* ─── EDIT AREA (after generation) ─── */}
      {hasContent && (
        <div className={styles.editArea}>
          <div className={styles.editHeader}>
            <span className={styles.editLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Cover Letter
            </span>
            <button
              className={styles.regenerateBtn}
              onClick={() => dispatch(resetCoverLetter())}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 .49-3.51"></path>
              </svg>
              Regenerate
            </button>
          </div>
          <textarea
            className={styles.editTextarea}
            value={generatedContent}
            onChange={(e) => dispatch(setCLContent(e.target.value))}
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
};

export default CoverLetterPanel;
