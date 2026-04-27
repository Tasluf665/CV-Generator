import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import TextArea from '../../../common/TextArea/TextArea';
import { 
  selectEducation, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateEducation, 
  addEducation, 
  removeEducation,
  addEduBullet,
  updateEduBullet,
  removeEduBullet,
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './EducationSection.module.css';

const EducationSection = () => {
  const dispatch = useDispatch();
  const education = useSelector(selectEducation) || [];
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'education'));
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'add' or 'edit'
  const [editingEduId, setEditingEduId] = useState(null);
  
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
  });

  const handleAddClick = () => {
    setFormData({
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
    setViewMode('add');
    if (!isExpanded) dispatch(toggleSection('education'));
  };

  const handleEditClick = (edu) => {
    setEditingEduId(edu.id);
    setFormData({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa,
    });
    setViewMode('edit');
  };

  const handleSave = () => {
    if (viewMode === 'add') {
      dispatch(addEducation(formData));
    } else {
      dispatch(updateEducation({ id: editingEduId, updates: formData }));
    }
    setViewMode('list');
    setEditingEduId(null);
  };

  const handleToggleVisibility = (eduId, field, currentValue) => {
    dispatch(updateEducation({ 
      id: eduId, 
      updates: { [field]: !currentValue } 
    }));
  };

  const handleAddBullet = (eduId) => {
    dispatch(addEduBullet({ eduId }));
  };

  const handleUpdateBullet = (eduId, bulletIndex, text) => {
    dispatch(updateEduBullet({ eduId, bulletIndex, updates: { text } }));
  };

  const handleToggleBulletVisibility = (eduId, bulletIndex, currentValue) => {
    dispatch(updateEduBullet({ eduId, bulletIndex, updates: { isVisible: !currentValue } }));
  };

  const icon = (
    <svg width="20" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>
  );

  return (
    <SectionCard
      title="Education"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('education'))}
      onAdd={handleAddClick}
    >
      {viewMode === 'list' ? (
        <div className={styles.container}>
          {education.map((edu) => (
            <div key={edu.id} className={styles.eduItem}>
              <div className={styles.eduHeader}>
                <div 
                  className={`${styles.checkbox} ${edu.isVisible ? styles.checkboxSelected : ''}`}
                  onClick={() => handleToggleVisibility(edu.id, 'isVisible', edu.isVisible)}
                >
                  {edu.isVisible && (
                    <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className={styles.eduInfo} onClick={() => handleEditClick(edu)}>
                  <div className={styles.schoolName}>{edu.school || 'Unnamed School'}</div>
                  <div className={styles.degreeInfo}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </div>
                  <div className={styles.eduDates}>{edu.startDate} - {edu.endDate}</div>
                </div>
                <button 
                  className={styles.deleteBtn}
                  onClick={(e) => { e.stopPropagation(); dispatch(removeEducation(edu.id)); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              {/* Bullets Section */}
              <div className={styles.bulletList}>
                {edu.bullets?.map((bullet, bIndex) => (
                  <div key={bIndex} className={styles.bulletItem}>
                    <div 
                      className={`${styles.checkbox} ${bullet.isVisible ? styles.checkboxSelected : ''}`}
                      onClick={() => handleToggleBulletVisibility(edu.id, bIndex, bullet.isVisible)}
                    >
                      {bullet.isVisible && (
                        <svg className={styles.checkIcon} width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className={styles.bulletText}>
                      <Input 
                        variant="minimal"
                        value={bullet.text}
                        onChange={(e) => handleUpdateBullet(edu.id, bIndex, e.target.value)}
                        placeholder="Add achievement, coursework, GPA..."
                      />
                    </div>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => dispatch(removeEduBullet({ eduId: edu.id, bulletIndex: bIndex }))}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
                <button className={styles.addBulletBtn} onClick={() => handleAddBullet(edu.id)}>
                  <span>+</span> Add Bullet
                </button>
              </div>
            </div>
          ))}
          {education.length === 0 && (
            <p className={styles.emptyText}>No education added. Click + to add one.</p>
          )}
        </div>
      ) : (
        <div className={styles.editForm}>
          <div className={styles.formBox}>
            <Input
              label="School / University"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="e.g. State University"
              style={{ marginBottom: '16px' }}
            />
            
            <div className={styles.formGrid}>
              <Input
                label="Degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. Bachelor of Fine Arts"
              />
              <Input
                label="Field of Study"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder="e.g. Graphic Design"
              />
            </div>

            <div className={styles.formGrid} style={{ marginTop: '16px' }}>
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New York, NY"
              />
              <Input
                label="GPA"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="e.g. 3.8/4.0"
              />
            </div>

            <div className={styles.formGrid} style={{ marginTop: '16px' }}>
              <Input
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="Year or Month Year"
              />
              <Input
                label="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="Year or Month Year"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setViewMode('list')}>Cancel</button>
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default EducationSection;
