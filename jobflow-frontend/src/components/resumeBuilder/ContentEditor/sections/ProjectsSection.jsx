import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import TextArea from '../../../common/TextArea/TextArea';
import Button from '../../../common/Button/Button';
import { 
  selectProjects, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateProject, 
  addProject, 
  removeProject, 
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'projects'));

  const handleUpdate = (id, updates) => {
    dispatch(updateProject({ id, updates }));
  };

  const handleAdd = () => {
    dispatch(addProject());
  };

  const handleRemove = (id) => {
    dispatch(removeProject(id));
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
    >
      {projects.map((project, index) => (
        <div key={project.id} style={{ borderBottom: index < projects.length - 1 ? '1px solid #d9e4e9' : 'none', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Project #{index + 1}</h4>
            <button 
              onClick={() => handleRemove(project.id)}
              style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: '12px' }}
            >
              Remove
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Name"
              value={project.name}
              onChange={(e) => handleUpdate(project.id, { name: e.target.value })}
              placeholder="e.g. Portfolio Website"
            />
            <Input
              label="Title"
              value={project.title}
              onChange={(e) => handleUpdate(project.id, { title: e.target.value })}
              placeholder="e.g. Lead Developer"
            />
          </div>

          <Input
            label="Link"
            value={project.link}
            onChange={(e) => handleUpdate(project.id, { link: e.target.value })}
            placeholder="e.g. https://github.com/yourusername/project"
            containerStyle={{ marginBottom: '16px' }}
          />

          <TextArea
            label="Description"
            value={project.description}
            onChange={(e) => handleUpdate(project.id, { description: e.target.value })}
            placeholder="Describe your project, technologies used, and your contribution..."
            rows={4}
          />
        </div>
      ))}

      <Button 
        variant="ghost" 
        onClick={handleAdd}
        style={{ color: 'var(--color-primary)', alignSelf: 'flex-start', paddingLeft: 0 }}
      >
        <span style={{ marginRight: '8px' }}>+</span> Add project
      </Button>
    </SectionCard>
  );
};

export default ProjectsSection;
