import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppShell from '../../components/layout/AppShell/AppShell';
import ActionCard from '../../components/resumeBuilder/ActionCard/ActionCard';
import ResumeCard from '../../components/resumeBuilder/ResumeCard/ResumeCard';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { fetchAllResumes, deleteResume } from '../../features/resumeBuilder/resumeBuilderSlice';
import { selectResumes, selectIsLoading } from '../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './ResumeBuilderPage.module.css';

const ResumeBuilderPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const resumes = useSelector(selectResumes);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(fetchAllResumes());
  }, [dispatch]);

  const handleCreateNew = () => {
    navigate(ROUTE_PATHS.RESUME_EDITOR.replace(':id', 'new'));
  };

  const handleDeleteResume = (id) => {
    dispatch(deleteResume(id));
  };


  const actionCards = [
    {
      title: 'New Resume',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"></path>
        </svg>
      ),
      color: '#00b894',
    },
    {
      title: 'Start from Job Description',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <line x1="12" y1="11" x2="12" y2="17"></line>
          <line x1="9" y1="14" x2="15" y2="14"></line>
        </svg>
      ),
      color: '#7e22ce',
    },
    {
      title: 'Start from Template',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
      ),
      color: '#ec4899',
    },
    {
      title: 'New Cover Letter',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
      color: '#f59e0b',
    },
  ];

  const filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.targetJobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AppShell>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>Resume Builder</h1>
          </div>
          <div className={styles.headerActions}>
            <Button variant="outline" className={styles.menuBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              Menu
            </Button>
          </div>

        </header>

        <section className={styles.actionGrid}>
          {actionCards.map((card, index) => (
            <ActionCard 
              key={index}
              title={card.title}
              icon={card.icon}
              color={card.color}
              onClick={card.title === 'New Resume' ? handleCreateNew : () => console.log(`Clicked ${card.title}`)}
            />
          ))}
        </section>

        <section className={styles.resumesSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Resumes</h2>
            <div className={styles.controls}>
              <div className={styles.searchWrapper}>
                <Input 
                  placeholder="Search resumes..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  }
                />
              </div>
              <div className={styles.viewToggle}>
                <button className={`${styles.toggleBtn} ${styles.active}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button className={styles.toggleBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.resumeGrid}>
            {isLoading ? (
              <div className={styles.loading}>Loading resumes...</div>
            ) : filteredResumes.length > 0 ? (
              filteredResumes.map((resume) => (
                <ResumeCard 
                  key={resume._id}
                  title={resume.title}
                  matchScore={resume.analysis?.score || 0}
                  lastModified={formatDate(resume.updatedAt)}
                  onClick={() => navigate(ROUTE_PATHS.RESUME_EDITOR.replace(':id', resume._id))}
                  onDelete={() => handleDeleteResume(resume._id)}
                />

              ))
            ) : (
              <div className={styles.emptyState}>
                {searchQuery ? 'No resumes match your search.' : 'You haven\'t created any resumes yet.'}
              </div>
            )}
            
            <button className={styles.emptyCard} onClick={handleCreateNew}>
              <div className={styles.emptyIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span>Create New</span>
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default ResumeBuilderPage;
