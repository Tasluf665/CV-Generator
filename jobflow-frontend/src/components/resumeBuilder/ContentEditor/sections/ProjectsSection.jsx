import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import { 
  selectProjects, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateProject, 
  addProject, 
  removeProject,
  addProjectBullet,
  updateProjectBullet,
  removeProjectBullet,
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './ProjectsSection.module.css';

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects) || [];
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'projects'));
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'add' or 'edit'
  const [editingProjectId, setEditingProjectId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    link: '',
    startDate: '',
    endDate: '',
  });

  const handleAddClick = () => {
    setFormData({
      name: '',
      title: '',
      link: '',
      startDate: '',
      endDate: '',
    });
    setViewMode('add');
    if (!isExpanded) dispatch(toggleSection('projects'));
  };

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setFormData({
      name: project.name,
      title: project.title,
      link: project.link,
      startDate: project.startDate,
      endDate: project.endDate,
    });
    setViewMode('edit');
  };

  const handleSave = () => {
    if (viewMode === 'add') {
      dispatch(addProject(formData));
    } else {
      dispatch(updateProject({ id: editingProjectId, updates: formData }));
    }
    setViewMode('list');
    setEditingProjectId(null);
  };

  const handleToggleVisibility = (projectId, field, currentValue) => {
    dispatch(updateProject({ 
      id: projectId, 
      updates: { [field]: !currentValue } 
    }));
  };

  const handleAddBullet = (projectId) => {
    dispatch(addProjectBullet({ projectId }));
  };

  const handleUpdateBullet = (projectId, bulletIndex, text) => {
    dispatch(updateProjectBullet({ projectId, bulletIndex, updates: { text } }));
  };

  const handleToggleBulletVisibility = (projectId, bulletIndex, currentValue) => {
    dispatch(updateProjectBullet({ projectId, bulletIndex, updates: { isVisible: !currentValue } }));
  };

  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  return (
    <SectionCard
      title="Projects"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('projects'))}
      onAdd={handleAddClick}
    >
      {viewMode === 'list' ? (
        <div className={styles.container}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectItem}>
              <div className={styles.projectHeader}>
                <div 
                  className={`${styles.checkbox} ${project.isVisible ? styles.checkboxSelected : ''}`}
                  onClick={() => handleToggleVisibility(project.id, 'isVisible', project.isVisible)}
                >
                  {project.isVisible && (
                    <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className={styles.projectInfo} onClick={() => handleEditClick(project)}>
                  <div className={styles.projectName}>{project.name || 'Unnamed Project'}</div>
                  <div className={styles.projectTitle}>{project.title}</div>
                  <div className={styles.projectDates}>{project.startDate} - {project.endDate}</div>
                </div>
                <button 
                  className={styles.deleteBtn}
                  onClick={(e) => { e.stopPropagation(); dispatch(removeProject(project.id)); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              {/* Bullets Section */}
              <div className={styles.bulletList}>
                {project.bullets?.map((bullet, bIndex) => (
                  <div key={bIndex} className={styles.bulletItem}>
                    <div 
                      className={`${styles.checkbox} ${bullet.isVisible ? styles.checkboxSelected : ''}`}
                      onClick={() => handleToggleBulletVisibility(project.id, bIndex, bullet.isVisible)}
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
                        onChange={(e) => handleUpdateBullet(project.id, bIndex, e.target.value)}
                        placeholder="Add project achievement or detail..."
                      />
                    </div>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => dispatch(removeProjectBullet({ projectId: project.id, bulletIndex: bIndex }))}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
                <button className={styles.addBulletBtn} onClick={() => handleAddBullet(project.id)}>
                  <span>+</span> Add Bullet
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className={styles.emptyText}>No projects added. Click + to add one.</p>
          )}
        </div>
      ) : (
        <div className={styles.editForm}>
          <div className={styles.formBox}>
            <div className={styles.formGrid}>
              <Input
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Portfolio Website"
              />
              <Input
                label="Your Role / Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Lead Developer"
              />
            </div>

            <Input
              label="Project Link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="e.g. https://github.com/username/project"
              style={{ marginTop: '16px' }}
            />

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

export default ProjectsSection;
