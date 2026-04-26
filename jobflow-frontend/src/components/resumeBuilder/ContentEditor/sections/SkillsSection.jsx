import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import Button from '../../../common/Button/Button';
import { 
  selectSkills, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  addSkill,
  updateSkill,
  removeSkill,
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';

const SkillsSection = () => {
  const dispatch = useDispatch();
  const skills = useSelector(selectSkills);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'skills'));

  const handleUpdate = (id, updates) => {
    dispatch(updateSkill({ id, updates }));
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
    >
      {skills.map((skill, index) => (
        <div key={skill.id || index} style={{ borderBottom: index < skills.length - 1 ? '1px solid #d9e4e9' : 'none', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Skill Group #{index + 1}</h4>
            <button 
              onClick={() => handleRemove(skill.id)}
              style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: '12px' }}
            >
              Remove
            </button>
          </div>

          <Input
            label="Category (e.g. Technical Skills)"
            value={skill.category}
            onChange={(e) => handleUpdate(skill.id, { category: e.target.value })}
            placeholder="e.g. Programming Languages"
            style={{ marginBottom: '16px' }}
          />

          <Input
            label="Skills (comma separated)"
            value={skill.items}
            onChange={(e) => handleUpdate(skill.id, { items: e.target.value })}
            placeholder="e.g. React, Node.js, Python..."
          />
        </div>
      ))}

      <Button 
        variant="ghost" 
        onClick={handleAdd}
        style={{ color: 'var(--color-primary)', alignSelf: 'flex-start', paddingLeft: 0 }}
      >
        <span style={{ marginRight: '8px' }}>+</span> Add skill group
      </Button>
    </SectionCard>
  );
};

export default SkillsSection;
