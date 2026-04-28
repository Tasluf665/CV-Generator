import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectMatchResults, selectSelectedJobId, selectCurrentResumeId, selectResumeKeywords } from '../../../features/resumeBuilder/resumeBuilderSelectors';
import { setSelectedJobId, matchResumeWithJob, generateResumeKeywords } from '../../../features/resumeBuilder/resumeBuilderSlice';
import { generateKeywords as generateJobKeywords } from '../../../features/jobTracker/jobSlice';
import styles from './JobMatcherPanel.module.css';

const JobMatcherResults = () => {
  const dispatch = useDispatch();
  const matchResults = useSelector(selectMatchResults);
  const selectedJobId = useSelector(selectSelectedJobId);
  const resumeId = useSelector(selectCurrentResumeId);
  const resumeKeywords = useSelector(selectResumeKeywords);
  const jobs = useSelector((state) => state.jobs.items);
  
  const selectedJob = jobs.find(job => (job._id || job.id) === selectedJobId);
  const initiatedRef = useRef(null);
  
  const [orchestrationLoading, setOrchestrationLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  useEffect(() => {
    if (!selectedJob || !resumeId) return;
    if (initiatedRef.current === selectedJobId) return;

    const orchestrateMatch = async () => {
      initiatedRef.current = selectedJobId;
      setOrchestrationLoading(true);
      
      // 1. Job Keywords
      const hasJobKeywords = Object.values(selectedJob.parsedData?.extractedKeywords || {}).some(arr => arr && arr.length > 0);
      if (!hasJobKeywords) {
        setLoadingStep('Extracting keywords from Job Description...');
        try { await dispatch(generateJobKeywords(selectedJobId)).unwrap(); } catch (e) { console.error(e); }
      }

      // 2. Resume Keywords
      const hasResumeKeywords = Object.values(resumeKeywords || {}).some(arr => arr && arr.length > 0);
      if (!hasResumeKeywords) {
        setLoadingStep('Extracting keywords from your Resume...');
        try { await dispatch(generateResumeKeywords(resumeId)).unwrap(); } catch (e) { console.error(e); }
      }

      // 3. Match
      setLoadingStep('Analyzing match...');
      try { await dispatch(matchResumeWithJob({ id: resumeId, jobId: selectedJobId })).unwrap(); } catch (e) { console.error(e); }
      
      setOrchestrationLoading(false);
      setLoadingStep('');
    };

    orchestrateMatch();
  }, [selectedJobId, resumeId, selectedJob, resumeKeywords, dispatch]);

  const handleClearSelection = () => {
    dispatch(setSelectedJobId(null));
  };

  if (!selectedJob) {
    return null;
  }

  const { title, company, location, parsedData } = selectedJob;
  const jobKeywords = parsedData?.extractedKeywords || { 'Hard Skills': [], 'Soft Skills': [], 'Others': [] };
  const score = matchResults?.matchScore || 0;

  const getJobSkillStatus = (skill) => {
    if (!matchResults) return 'neutral';
    const lowerSkill = skill.toLowerCase();
    const isMatched = matchResults.matchedKeywords?.some(k => k.toLowerCase() === lowerSkill);
    const isMissing = matchResults.missingKeywords?.some(k => k.toLowerCase() === lowerSkill);
    if (isMatched) return 'matched';
    if (isMissing) return 'missing';
    return 'neutral';
  };

  const getResumeSkillStatus = (skill) => {
    if (!matchResults) return 'neutral';
    const lowerSkill = skill.toLowerCase();
    const isMatched = matchResults.matchedKeywords?.some(k => k.toLowerCase() === lowerSkill);
    if (isMatched) return 'matched';
    return 'neutral';
  };

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsHeader}>
        <div className={styles.headerInfo}>
          <h2 className={styles.jobTitle}>{title}</h2>
          <p className={styles.jobCompany}>{company} {location ? `- ${location}` : ''}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.changeJobBtn} onClick={handleClearSelection}>
            Change Job
          </button>
        </div>
      </div>

      {orchestrationLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>{loadingStep}</p>
        </div>
      ) : matchResults ? (
        <div className={styles.resultsContent}>
          <div className={styles.scoreSection}>
            <div className={styles.scoreCircleWrapper}>
              <svg className={styles.scoreSvg} viewBox="0 0 36 36">
                <path className={styles.scoreBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={styles.scoreFill} strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className={styles.scoreText}>{score}%</text>
              </svg>
            </div>
            <div className={styles.scoreDetails}>
              <h3>Match Score</h3>
              <p>Your resume matches {score}% of the required skills.</p>
            </div>
          </div>

          <div className={styles.keywordsComparison}>
            <div className={styles.keywordsColumn}>
              <h3 className={styles.columnTitle}>Job Requirements</h3>
              <div className={styles.skillsSection}>
                {Object.entries(jobKeywords).map(([category, skills]) => {
                  if (!skills || skills.length === 0) return null;
                  return (
                    <div key={`job-${category}`} className={styles.skillCategory}>
                      <h4 className={styles.skillTitle}>{category}</h4>
                      <div className={styles.skillsList}>
                        {skills.map((skill, index) => {
                          const status = getJobSkillStatus(skill);
                          return (
                            <span key={index} className={`${styles.skillBadge} ${styles[status]}`}>
                              {status === 'matched' && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              )}
                              {status === 'missing' && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              )}
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.keywordsColumn}>
              <h3 className={styles.columnTitle}>Your Resume</h3>
              <div className={styles.skillsSection}>
                {Object.entries(resumeKeywords || {}).map(([category, skills]) => {
                  if (!skills || skills.length === 0) return null;
                  return (
                    <div key={`res-${category}`} className={styles.skillCategory}>
                      <h4 className={styles.skillTitle}>{category}</h4>
                      <div className={styles.skillsList}>
                        {skills.map((skill, index) => {
                          const status = getResumeSkillStatus(skill);
                          return (
                            <span key={index} className={`${styles.skillBadge} ${styles[status]}`}>
                              {status === 'matched' && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              )}
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {matchResults.suggestions && matchResults.suggestions.length > 0 && (
            <div className={styles.suggestionsSection}>
              <h4 className={styles.suggestionsTitle}>Suggestions to Improve Match</h4>
              <ul className={styles.suggestionsList}>
                {matchResults.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.resultsContent}>
          <p className={styles.neutralText}>Match results unavailable.</p>
        </div>
      )}
    </div>
  );
};

export default JobMatcherResults;
