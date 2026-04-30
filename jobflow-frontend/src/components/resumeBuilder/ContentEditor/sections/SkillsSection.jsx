import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import { 
  selectSkills, 
  selectIsSectionExpanded,
  selectSelectedJobId,
  selectCurrentResumeId,
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  addSkill,
  updateSkill,
  removeSkill,
  toggleSection,
  addSkillItem,
  updateSkillItem,
  removeSkillItem,
  updateKeywordStatus,
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './SkillsSection.module.css';

const SkillsSection = () => {
  const dispatch = useDispatch();
  const skills = useSelector(selectSkills);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'skills'));
  const selectedJobId = useSelector(selectSelectedJobId);
  const resumeId = useSelector(selectCurrentResumeId);

  const handleUpdate = (id, updates) => {
    dispatch(updateSkill({ id, updates }));
  };

  const handleToggleVisibility = (id, currentValue) => {
    dispatch(updateSkill({ id, updates: { isVisible: !currentValue } }));
  };

  const handleToggleItemVisibility = (skillId, itemId, currentValue) => {
    // currentValue is true when visible (checked), false when hidden (unchecked)
    const newIsVisible = !currentValue;
    dispatch(updateSkillItem({ skillId, itemId, updates: { isVisible: newIsVisible } }));

    // Sync with Job Matcher if a job is selected
    if (selectedJobId && resumeId) {
      // Find the keyword text for this item
      const skill = skills.find(s => s.id === skillId);
      const item = skill?.items?.find(i => i.id === itemId);
      if (item) {
        const newStatus = newIsVisible ? 'matched' : 'hidden';
        dispatch(updateKeywordStatus({ id: resumeId, jobId: selectedJobId, keyword: item.text, status: newStatus }));
      }
    }
  };

  const handleAddItem = (skillId, text) => {
    dispatch(addSkillItem({ skillId, text }));
  };

  const handleRemoveItem = (skillId, itemId) => {
    dispatch(removeSkillItem({ skillId, itemId }));
  };

  const handleAdd = () => {
    dispatch(addSkill());
  };

  const handleRemove = (id) => {
    dispatch(removeSkill(id));
  };

  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  );

  return (
    <SectionCard
      title="Skills"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('skills'))}
      onAdd={handleAdd}
    >
      <div className={styles.container}>
        {skills.map((skill, index) => (
          <div key={skill.id || index} className={styles.skillItem}>
            <div className={styles.skillHeader}>
              <div 
                className={`${styles.checkbox} ${skill.isVisible !== false ? styles.checkboxSelected : ''}`}
                onClick={() => handleToggleVisibility(skill.id, skill.isVisible !== false)}
              >
                {skill.isVisible !== false && (
                  <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div className={styles.skillInfo}>
                <div className={styles.skillTitle}>Skill Group #{index + 1}</div>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleRemove(skill.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            <Input
              label="Category (e.g. Technical Skills)"
              value={skill.category}
              onChange={(e) => handleUpdate(skill.id, { category: e.target.value })}
              placeholder="e.g. Programming Languages"
            />

            <div className={styles.skillList}>
              {skill.items && skill.items.map((item) => (
                <div 
                  key={item.id} 
                  className={`${styles.skillPill} ${item.isVisible === false ? styles.skillPillHidden : ''}`}
                >
                  <div 
                    className={`${styles.pillCheckbox} ${item.isVisible !== false ? styles.pillCheckboxSelected : ''}`}
                    onClick={() => handleToggleItemVisibility(skill.id, item.id, item.isVisible !== false)}
                  >
                    {item.isVisible !== false && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={styles.pillText}>{item.text}</span>
                  <button 
                    className={styles.pillDeleteBtn}
                    onClick={() => handleRemoveItem(skill.id, item.id)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.addSkillWrapper}>
              <Input
                placeholder="Type a skill and press Enter to add..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    handleAddItem(skill.id, e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        ))}

        <button className={styles.addSkillBtn} onClick={handleAdd}>
          <span>+</span> Add skill group
        </button>
      </div>
    </SectionCard>
  );
};

export default SkillsSection;
