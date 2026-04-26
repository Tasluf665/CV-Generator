import React from 'react';
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
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from '../ContentEditor.module.css';

const WorkExperienceSection = () => {
  const dispatch = useDispatch();
  const workExperience = useSelector(selectWorkExperience);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'work'));

  const handleUpdate = (id, updates) => {
    dispatch(updateWorkExperience({ id, updates }));
  };

  const handleAdd = () => {
    dispatch(addWorkExperience());
  };

  const handleRemove = (id) => {
    dispatch(removeWorkExperience(id));
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
      isHighlighted={true}
    >
      {workExperience.map((job, index) => (
        <div key={job.id} style={{ borderBottom: index < workExperience.length - 1 ? '1px solid #d9e4e9' : 'none', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Experience #{index + 1}</h4>
            <button 
              onClick={() => handleRemove(job.id)}
              style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: '12px' }}
            >
              Remove
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Company"
              value={job.company}
              onChange={(e) => handleUpdate(job.id, { company: e.target.value })}
              placeholder="e.g. TechNova"
            />
            <Input
              label="Role"
              value={job.role}
              onChange={(e) => handleUpdate(job.id, { role: e.target.value })}
              placeholder="e.g. Senior Designer"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Start Date"
              value={job.startDate}
              onChange={(e) => handleUpdate(job.id, { startDate: e.target.value })}
              placeholder="e.g. Jan 2021"
            />
            <Input
              label="End Date"
              value={job.endDate}
              onChange={(e) => handleUpdate(job.id, { endDate: e.target.value })}
              placeholder="e.g. Present"
            />
          </div>

          <TextArea
            label="Description / Bullet Points"
            value={job.description}
            onChange={(e) => handleUpdate(job.id, { description: e.target.value })}
            placeholder="List your key responsibilities and achievements..."
            rows={4}
          />
        </div>
      ))}

      <Button 
        variant="ghost" 
        onClick={handleAdd}
        style={{ color: 'var(--color-primary)', alignSelf: 'flex-start', paddingLeft: 0 }}
      >
        <span style={{ marginRight: '8px' }}>+</span> Add work experience
      </Button>
    </SectionCard>
  );
};

export default WorkExperienceSection;
