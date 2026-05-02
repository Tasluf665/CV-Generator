import React, { useEffect, useRef, useState, useCallback } from 'react';
import html2pdf from 'html2pdf.js';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
import Tabs from '../../components/common/Tabs/Tabs';
import Button from '../../components/common/Button/Button';
import ContentEditor from '../../components/resumeBuilder/ContentEditor/ContentEditor';
import DesignerPanel from '../../components/resumeBuilder/DesignerPanel/DesignerPanel';
import ResumePreview from '../../components/resumeBuilder/ResumePreview/ResumePreview';
import JobMatcherSidebar from '../../components/resumeBuilder/JobMatcherPanel/JobMatcherSidebar';
import JobMatcherPlaceholder from '../../components/resumeBuilder/JobMatcherPanel/JobMatcherPlaceholder';
import JobMatcherResults from '../../components/resumeBuilder/JobMatcherPanel/JobMatcherResults';
import CoverLetterPanel from '../../components/resumeBuilder/CoverLetterPanel/CoverLetterPanel';
import CoverLetterPreview from '../../components/resumeBuilder/CoverLetterPanel/CoverLetterPreview';
import {
  selectActiveTab,
  selectContactInfo,
  selectResumeData,
  selectResumeTitle,
  selectIsLoading,
  selectIsSaving,
  selectLastSaved,
  selectCurrentResumeId,
  selectResumeError,
  selectZoomLevel,
  selectSelectedJobId
} from '../../features/resumeBuilder/resumeBuilderSelectors';
import {
  setActiveTab,
  updateResumeTitle,
  fetchResumeById,
  saveResume,
  deleteResume,
  resetResumeState,
  setZoomLevel
} from '../../features/resumeBuilder/resumeBuilderSlice';


import styles from './ResumeEditorPage.module.css';

const ResumeEditorPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const activeTab = useSelector(selectActiveTab);
  const contact = useSelector(selectContactInfo);
  const resumeData = useSelector(selectResumeData);
  const resumeTitle = useSelector(selectResumeTitle);
  const isLoading = useSelector(selectIsLoading);
  const isSaving = useSelector(selectIsSaving);
  const lastSaved = useSelector(selectLastSaved);
  const currentResumeId = useSelector(selectCurrentResumeId);
  const error = useSelector(selectResumeError);
  const zoomLevel = useSelector(selectZoomLevel);
  const selectedJobId = useSelector(selectSelectedJobId);

  const [sidebarWidth, setSidebarWidth] = useState(380);
  const isResizing = useRef(false);
  const saveTimeoutRef = useRef(null);
  const initialLoadRef = useRef(true);

  // Fetch resume data on mount
  useEffect(() => {
    const isValidId = id && id !== 'new' && id !== 'undefined' && id !== 'null';
    if (isValidId) {
      dispatch(fetchResumeById(id));
    } else {
      dispatch(resetResumeState());
    }

    return () => {
      dispatch(resetResumeState());
    };
  }, [id, dispatch]);

  // Debounced Auto-save
  useEffect(() => {
    // Skip the first run after loading/resetting
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    // Don't save if already loading
    if (isLoading) return;

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for saving
    saveTimeoutRef.current = setTimeout(() => {
      const saveId = currentResumeId || id;

      if (saveId === 'undefined') return;

      dispatch(saveResume({ id: saveId, data: resumeData }))
        .unwrap()
        .then((savedData) => {
          // If we just created a new resume, update the URL
          if (id === 'new' && savedData._id) {
            navigate(`/resumes/${savedData._id}/edit`, { replace: true });
          }
        });
    }, 2000); // 2 second debounce



    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resumeData, id, currentResumeId, dispatch, navigate, isLoading]);

  const tabs = [
    { id: 'content', label: 'Content Editor' },
    { id: 'designer', label: 'Designer' },
    { id: 'analyzer', label: 'Analyzer', badge: '8' },
    { id: 'matcher', label: 'Job Matcher', icon: '⚠️' },
    { id: 'cover-letter', label: 'Cover Letter' },
  ];

  const handleTabChange = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  const handleMouseDown = (e) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = useCallback((e) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX;
    if (newWidth > 250 && newWidth < 600) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'default';
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleZoomIn = () => {

    dispatch(setZoomLevel(Math.min(zoomLevel + 10, 200)));
  };

  const handleZoomOut = () => {
    dispatch(setZoomLevel(Math.max(zoomLevel - 10, 50)));
  };

  const handleResetZoom = () => {
    dispatch(setZoomLevel(100));
  };


  const handleDelete = () => {
    const deleteId = currentResumeId || id;
    dispatch(deleteResume(deleteId))
      .unwrap()
      .then(() => {
        navigate('/resumes');
      });
  };


  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading your resume...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => navigate('/resumes')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div className={styles.titleContainer}>
              <input
                className={styles.titleInput}
                value={resumeTitle}
                onChange={(e) => dispatch(updateResumeTitle(e.target.value))}
                placeholder="Untitled Resume"
              />
              <div className={styles.saveStatus}>
                {isSaving ? (
                  <span className={styles.saving}>Saving...</span>
                ) : lastSaved ? (
                  <span className={styles.saved}>Saved</span>
                ) : null}
              </div>
            </div>

          </div>
          <div className={styles.headerRight}>
            {error && <span className={styles.errorText}>{error}</span>}
            <Button
              variant="outline"
              className={styles.deleteBtnHeader}
              onClick={handleDelete}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Delete
            </Button>
            <Button variant="outline" className={styles.exportBtn} onClick={handleExportPDF}>Export PDF</Button>

            <button className={styles.menuBtn}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <path d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z" fill="#131D21" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.headerTabs}>
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </header>

      <main className={styles.mainContent}>
        <aside className={styles.sidebar} style={{ width: `${sidebarWidth}px` }}>
          {activeTab === 'content' && <ContentEditor />}
          {activeTab === 'designer' && <DesignerPanel />}
          {activeTab === 'matcher' && !selectedJobId && <JobMatcherSidebar />}
          {activeTab === 'matcher' && selectedJobId && <ContentEditor />}
          {activeTab === 'cover-letter' && <CoverLetterPanel />}
          {activeTab !== 'content' && activeTab !== 'designer' && activeTab !== 'matcher' && activeTab !== 'cover-letter' && (
            <div className={styles.placeholder}>
              <h2>{tabs.find(t => t.id === activeTab)?.label} coming soon!</h2>
            </div>
          )}
        </aside>
        <div className={styles.resizer} onMouseDown={handleMouseDown} />
        <div className={styles.previewContainer}>
          {activeTab === 'cover-letter' ? (
            <CoverLetterPreview />
          ) : activeTab !== 'matcher' ? (
            <>
              <section className={styles.previewArea}>
                <div
                  id="resume-preview-content"
                  className={styles.previewWrapper}
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  <ResumePreview />
                </div>
              </section>

              <div className={styles.zoomControls}>
                <button className={styles.zoomBtn} onClick={handleZoomOut}>
                  <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M0 1H12" stroke="#131D21" strokeWidth="2" /></svg>
                </button>
                <span className={styles.zoomText}>{zoomLevel}%</span>
                <button className={styles.zoomBtn} onClick={handleZoomIn}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0V12M0 6H12" stroke="#131D21" strokeWidth="2" /></svg>
                </button>
                <div className={styles.divider} />
                <button className={styles.zoomBtn} onClick={handleResetZoom}>
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
                    <rect x="0.5" y="0.5" width="15" height="13" rx="1.5" stroke="#131D21" />
                    <path d="M4 4H12V10H4V4Z" fill="#131D21" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              {!selectedJobId ? (
                <JobMatcherPlaceholder />
              ) : (
                <JobMatcherResults />
              )}
            </>
          )}
        </div>

      </main>

    </div>
  );
};

export default ResumeEditorPage;
