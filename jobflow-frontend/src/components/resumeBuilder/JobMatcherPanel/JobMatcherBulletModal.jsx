import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateBullet, addWorkBullet, addEduBullet, addProjectBullet } from '../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './JobMatcherBulletModal.module.css';

const JobMatcherBulletModal = ({ isOpen, onClose, keyword }) => {
  const dispatch = useDispatch();
  const resumeData = useSelector((state) => state.resumeBuilder.resumeData);
  const currentResumeId = useSelector((state) => state.resumeBuilder.currentResumeId);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!selectedPosition) return;
    setIsGenerating(true);
    setError(null);
    
    try {
      const positionData = selectedPosition.data;
      const response = await dispatch(generateBullet({
        id: currentResumeId,
        keyword,
        positionId: selectedPosition.id,
        sectionType: selectedPosition.type,
        positionData
      })).unwrap();

      const newBulletText = response.bulletText;
      
      // Add the generated bullet to the specific section
      if (selectedPosition.type === 'workExperience') {
        dispatch(addWorkBullet({ jobId: selectedPosition.id }));
        // Update the last bullet (the one we just added) with the text
        const updatedWork = resumeData.workExperience.find(w => w.id === selectedPosition.id);
        const newIndex = updatedWork ? updatedWork.bullets.length : 0;
        // The reducer adds it synchronously, so the index is the current length
        dispatch({
          type: 'resumeBuilder/updateWorkBullet',
          payload: { jobId: selectedPosition.id, bulletIndex: newIndex, updates: { text: newBulletText } }
        });
      } else if (selectedPosition.type === 'education') {
        dispatch(addEduBullet({ eduId: selectedPosition.id }));
        const updatedEdu = resumeData.education.find(e => e.id === selectedPosition.id);
        const newIndex = updatedEdu ? updatedEdu.bullets.length : 0;
        dispatch({
          type: 'resumeBuilder/updateEduBullet',
          payload: { eduId: selectedPosition.id, bulletIndex: newIndex, updates: { text: newBulletText } }
        });
      } else if (selectedPosition.type === 'projects') {
        dispatch(addProjectBullet({ projectId: selectedPosition.id }));
        const updatedProj = resumeData.projects.find(p => p.id === selectedPosition.id);
        const newIndex = updatedProj ? updatedProj.bullets.length : 0;
        dispatch({
          type: 'resumeBuilder/updateProjectBullet',
          payload: { projectId: selectedPosition.id, bulletIndex: newIndex, updates: { text: newBulletText } }
        });
      }

      onClose();
    } catch (err) {
      setError(err || 'Failed to generate bullet point. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Choose a position for your bullet</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.keywordHint}>
            Keyword to incorporate: <strong>{keyword}</strong>
          </p>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.positionsList}>
            {resumeData.workExperience.length > 0 && (
              <div className={styles.positionGroup}>
                <h4>Work Experience</h4>
                {resumeData.workExperience.map((job) => (
                  <label key={`work-${job.id}`} className={styles.positionItem}>
                    <input
                      type="radio"
                      name="position"
                      value={`work-${job.id}`}
                      checked={selectedPosition?.id === job.id}
                      onChange={() => setSelectedPosition({ id: job.id, type: 'workExperience', data: job })}
                    />
                    <div className={styles.positionInfo}>
                      <span className={styles.positionRole}>{job.role || 'Untitled Role'}</span>
                      <span className={styles.positionCompany}>at {job.company || 'Unknown Company'}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {resumeData.education.length > 0 && (
              <div className={styles.positionGroup}>
                <h4>Education</h4>
                {resumeData.education.map((edu) => (
                  <label key={`edu-${edu.id}`} className={styles.positionItem}>
                    <input
                      type="radio"
                      name="position"
                      value={`edu-${edu.id}`}
                      checked={selectedPosition?.id === edu.id}
                      onChange={() => setSelectedPosition({ id: edu.id, type: 'education', data: edu })}
                    />
                    <div className={styles.positionInfo}>
                      <span className={styles.positionRole}>{edu.degree || 'Untitled Degree'}</span>
                      <span className={styles.positionCompany}>at {edu.school || 'Unknown Institution'}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {resumeData.projects.length > 0 && (
              <div className={styles.positionGroup}>
                <h4>Projects</h4>
                {resumeData.projects.map((proj) => (
                  <label key={`proj-${proj.id}`} className={styles.positionItem}>
                    <input
                      type="radio"
                      name="position"
                      value={`proj-${proj.id}`}
                      checked={selectedPosition?.id === proj.id}
                      onChange={() => setSelectedPosition({ id: proj.id, type: 'projects', data: proj })}
                    />
                    <div className={styles.positionInfo}>
                      <span className={styles.positionRole}>{proj.name || 'Untitled Project'}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            {resumeData.workExperience.length === 0 && resumeData.education.length === 0 && resumeData.projects.length === 0 && (
              <p className={styles.noPositions}>No positions available to add bullets to. Please add some experience, education, or projects first.</p>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={isGenerating}>
            Cancel
          </button>
          <button 
            className={styles.continueBtn} 
            onClick={handleGenerate} 
            disabled={!selectedPosition || isGenerating}
          >
            {isGenerating ? (
              <><svg className={styles.spinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> Generating...</>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobMatcherBulletModal;
