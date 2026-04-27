import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import { 
  selectTargetTitles, 
  selectTargetJobTitle,
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateTargetTitles, 
  setTargetJobTitle,
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './TitleSection.module.css';

const TitleSection = () => {
  const dispatch = useDispatch();
  const targetTitles = useSelector(selectTargetTitles) || [];
  const selectedTitle = useSelector(selectTargetJobTitle);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'title'));
  
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'edit'
  const [newTitle, setNewTitle] = useState('');

  const handleAddClick = () => {
    setViewMode('edit');
    if (!isExpanded) {
      dispatch(toggleSection('title'));
    }
  };

  const handleSave = () => {
    if (newTitle.trim()) {
      const updatedTitles = [...targetTitles, newTitle.trim()];
      dispatch(updateTargetTitles(updatedTitles));
      // If it's the first title, select it automatically
      if (!selectedTitle) {
        dispatch(setTargetJobTitle(newTitle.trim()));
      }
      setNewTitle('');
      setViewMode('view');
    }
  };

  const handleToggleTitle = (title) => {
    if (selectedTitle === title) {
      dispatch(setTargetJobTitle(''));
    } else {
      dispatch(setTargetJobTitle(title));
    }
  };

  const handleDeleteTitle = (e, titleToDelete) => {
    e.stopPropagation();
    const updatedTitles = targetTitles.filter(t => t !== titleToDelete);
    dispatch(updateTargetTitles(updatedTitles));
    
    // If we deleted the currently selected title, clear the selection
    if (selectedTitle === titleToDelete) {
      dispatch(setTargetJobTitle(''));
    }
  };

  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  return (
    <SectionCard
      title="Target Title"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('title'))}
      onAdd={handleAddClick}
    >
      {viewMode === 'view' ? (
        <div className={styles.container}>
          {targetTitles.map((title, index) => (
            <div 
              key={index} 
              className={`${styles.titleItem} ${selectedTitle === title ? styles.selected : ''}`}
              onClick={() => handleToggleTitle(title)}
            >
              <div className={`${styles.checkbox} ${selectedTitle === title ? styles.checkboxSelected : ''}`}>
                {selectedTitle === title && (
                  <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`${styles.titleText} ${selectedTitle === title ? styles.titleTextSelected : ''}`}>
                {title}
              </span>
              <button 
                className={styles.deleteBtn}
                onClick={(e) => handleDeleteTitle(e, title)}
                title="Delete title"
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
          {targetTitles.length === 0 && (
            <p className={styles.emptyText}>No target titles added yet. Click + to add one.</p>
          )}
        </div>
      ) : (
        <div className={styles.editForm}>
          <h4 className={styles.formTitle}>Add a Target Title</h4>
          <div className={styles.formBox}>
            <div className={styles.formRow}>
              <span className={styles.label}>Target Title</span>
              <input 
                className={styles.input}
                type="text"
                placeholder="e.g. Marketing Manager"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>
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

export default TitleSection;
