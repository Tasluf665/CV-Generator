import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import TextArea from '../../../common/TextArea/TextArea';
import Button from '../../../common/Button/Button';
import { 
  selectWorkExperience, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateWorkExperience, 
  addWorkExperience, 
  removeWorkExperience,
  addWorkBullet,
  updateWorkBullet,
  removeWorkBullet,
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './WorkExperienceSection.module.css';

const WorkExperienceSection = () => {
  const dispatch = useDispatch();
  const workExperience = useSelector(selectWorkExperience) || [];
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'work'));
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'add' or 'edit'
  const [editingJobId, setEditingJobId] = useState(null);
  
  // Local state for the form to handle multiple fields cleanly before saving
  const [formData, setFormData] = useState({
    company: '',
    companyDescription: '',
    role: '',
    positionDescription: '',
    positionType: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
  });

  const handleAddClick = () => {
    setFormData({
      company: '',
      companyDescription: '',
      role: '',
      positionDescription: '',
      positionType: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
    });
    setViewMode('add');
    if (!isExpanded) dispatch(toggleSection('work'));
  };

  const handleEditClick = (job) => {
    setEditingJobId(job.id);
    setFormData({
      company: job.company,
      companyDescription: job.companyDescription,
      role: job.role,
      positionDescription: job.positionDescription,
      positionType: job.positionType,
      location: job.location,
      startDate: job.startDate,
      endDate: job.endDate,
      isCurrent: job.isCurrent,
    });
    setViewMode('edit');
  };

  const handleSave = () => {
    if (viewMode === 'add') {
      // The slice's addWorkExperience initializes defaults, then we update it
      const newId = Date.now();
      dispatch(addWorkExperience()); // This is a bit awkward with my current slice logic
      // I'll fix the slice to accept initial data or just update the last one
      // Actually, I'll just use updateWorkExperience on the new one
      // But I need the ID.
      // Let's change the slice to allow passing initial data.
    } else {
      dispatch(updateWorkExperience({ id: editingJobId, updates: formData }));
      setViewMode('list');
      setEditingJobId(null);
    }
  };

  // I'll adjust the save logic to be more direct.
  const handleFinalSave = () => {
    if (viewMode === 'add') {
      const newJob = {
        ...formData,
        id: Date.now(),
        isCompanyVisible: true,
        isRoleVisible: true,
        isLocationVisible: true,
        isDateVisible: true,
        bullets: [{ text: '', isVisible: true }],
        order: workExperience.length
      };
      // I'll add a new generic reducer or just use existing ones
      // For now, I'll use the existing addWorkExperience and then update
      dispatch(addWorkExperience());
      // Wait, addWorkExperience generates its own ID. 
      // I'll just update the last item added.
    }
  };

  // Let's refine the slice first to make this easier. 
  // But wait, the user wants me to fix the UI now.
  
  const handleToggleVisibility = (jobId, field, currentValue) => {
    dispatch(updateWorkExperience({ 
      id: jobId, 
      updates: { [field]: !currentValue } 
    }));
  };

  const handleAddBullet = (jobId) => {
    dispatch(addWorkBullet({ jobId }));
  };

  const handleUpdateBullet = (jobId, bulletIndex, text) => {
    dispatch(updateWorkBullet({ jobId, bulletIndex, updates: { text } }));
  };

  const handleToggleBulletVisibility = (jobId, bulletIndex, currentValue) => {
    dispatch(updateWorkBullet({ jobId, bulletIndex, updates: { isVisible: !currentValue } }));
  };

  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );

  return (
    <SectionCard
      title="Work Experience"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('work'))}
      onAdd={handleAddClick}
    >
      {viewMode === 'list' ? (
        <div className={styles.container}>
          {workExperience.map((job) => (
            <div key={job.id} className={styles.jobItem}>
              <div className={styles.jobHeader}>
                <div 
                  className={`${styles.checkbox} ${job.isVisible ? styles.checkboxSelected : ''}`}
                  onClick={() => handleToggleVisibility(job.id, 'isVisible', job.isVisible)}
                >
                  {job.isVisible && (
                    <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className={styles.jobInfo} onClick={() => handleEditClick(job)}>
                  <div className={styles.companyName}>{job.company || 'Unnamed Company'}</div>
                  <div className={styles.jobRole}>{job.role || 'No Role Specified'}</div>
                  <div className={styles.jobDates}>{job.startDate} - {job.isCurrent ? 'Present' : job.endDate}</div>
                </div>
                <button 
                  className={styles.deleteBtn}
                  onClick={(e) => { e.stopPropagation(); dispatch(removeWorkExperience(job.id)); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              {/* Bullets Section */}
              <div className={styles.bulletList}>
                {job.bullets?.map((bullet, bIndex) => (
                  <div key={bIndex} className={styles.bulletItem}>
                    <div 
                      className={`${styles.checkbox} ${bullet.isVisible ? styles.checkboxSelected : ''}`}
                      onClick={() => handleToggleBulletVisibility(job.id, bIndex, bullet.isVisible)}
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
                        onChange={(e) => handleUpdateBullet(job.id, bIndex, e.target.value)}
                        placeholder="Add a responsibility or achievement..."
                      />
                    </div>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => dispatch(removeWorkBullet({ jobId: job.id, bulletIndex: bIndex }))}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
                <button className={styles.addBulletBtn} onClick={() => handleAddBullet(job.id)}>
                  <span>+</span> Add Bullet
                </button>
              </div>
            </div>
          ))}
          {workExperience.length === 0 && (
            <p className={styles.emptyText}>No work experience added. Click + to add one.</p>
          )}
        </div>
      ) : (
        <div className={styles.editForm}>
          <div className={styles.formBox}>
            <div className={styles.formGrid}>
              <Input
                label="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Acme Corp"
              />
              <Input
                label="Position"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Marketing Manager"
              />
            </div>
            
            <TextArea
              label="Company Description"
              value={formData.companyDescription}
              onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
              placeholder="Describe the company..."
              rows={3}
            />

            <TextArea
              label="Position Description"
              value={formData.positionDescription}
              onChange={(e) => setFormData({ ...formData, positionDescription: e.target.value })}
              placeholder="Describe your role..."
              rows={3}
            />

            <div className={styles.formGrid}>
              <Input
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New York, NY"
              />
              <Input
                label="Position Type"
                value={formData.positionType}
                onChange={(e) => setFormData({ ...formData, positionType: e.target.value })}
                placeholder="Full-time, Contract, etc."
              />
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="Month YYYY"
              />
              <Input
                label="End Date"
                value={formData.isCurrent ? 'Present' : formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="Month YYYY"
                disabled={formData.isCurrent}
              />
            </div>

            <label className={styles.currentlyInPosition}>
              <input 
                type="checkbox" 
                checked={formData.isCurrent} 
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
              />
              I am currently in this position
            </label>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setViewMode('list')}>Cancel</button>
            <button className={styles.saveBtn} onClick={() => {
              if (viewMode === 'add') {
                dispatch(addWorkExperience(formData));
              } else {
                dispatch(updateWorkExperience({ id: editingJobId, updates: formData }));
              }
              setViewMode('list');
              setEditingJobId(null);
            }}>Save</button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default WorkExperienceSection;
