import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import TextArea from '../../../common/TextArea/TextArea';
import { 
  selectSummary, 
  selectSummaries,
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateSummary, 
  updateSummaries,
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './SummarySection.module.css';

const SummarySection = () => {
  const dispatch = useDispatch();
  const activeSummary = useSelector(selectSummary);
  const summaries = useSelector(selectSummaries) || [];
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'summary'));
  
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'edit'
  const [newSummaryText, setNewSummaryText] = useState('');

  const handleAddClick = () => {
    setViewMode('edit');
    if (!isExpanded) {
      dispatch(toggleSection('summary'));
    }
  };

  const handleSave = () => {
    if (newSummaryText.trim()) {
      const updatedSummaries = [...summaries, newSummaryText.trim()];
      dispatch(updateSummaries(updatedSummaries));
      
      // If it's the first summary, select it automatically
      if (!activeSummary) {
        dispatch(updateSummary(newSummaryText.trim()));
      }
      
      setNewSummaryText('');
      setViewMode('view');
    }
  };

  const handleToggleSummary = (text) => {
    if (activeSummary === text) {
      dispatch(updateSummary(''));
    } else {
      dispatch(updateSummary(text));
    }
  };

  const handleDeleteSummary = (e, textToDelete) => {
    e.stopPropagation();
    const updatedSummaries = summaries.filter(s => s !== textToDelete);
    dispatch(updateSummaries(updatedSummaries));
    
    // If we deleted the currently selected summary, clear the selection
    if (activeSummary === textToDelete) {
      dispatch(updateSummary(''));
    }
  };

  const icon = (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1H15M1 5H15M1 9H10M1 13H15" />
    </svg>
  );

  return (
    <SectionCard
      title="Professional Summary"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('summary'))}
      onAdd={handleAddClick}
    >
      {viewMode === 'view' ? (
        <div className={styles.container}>
          {summaries.map((text, index) => (
            <div 
              key={index} 
              className={`${styles.summaryItem} ${activeSummary === text ? styles.selected : ''}`}
              onClick={() => handleToggleSummary(text)}
            >
              <div className={`${styles.checkbox} ${activeSummary === text ? styles.checkboxSelected : ''}`}>
                {activeSummary === text && (
                  <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <p className={`${styles.summaryText} ${activeSummary === text ? styles.summaryTextSelected : ''}`}>
                {text}
              </p>
              <button 
                className={styles.deleteBtn}
                onClick={(e) => handleDeleteSummary(e, text)}
                title="Delete summary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))}
          {summaries.length === 0 && (
            <p className={styles.emptyText}>No summaries added yet. Click + to add one.</p>
          )}
        </div>
      ) : (
        <div className={styles.editForm}>
          <div className={styles.formBox}>
            <TextArea
              label="Add a Professional Summary"
              value={newSummaryText}
              onChange={(e) => setNewSummaryText(e.target.value)}
              placeholder="What have you achieved in your career? Describe your professional profile..."
              rows={8}
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.cancelBtn} onClick={() => setViewMode('view')}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default SummarySection;
