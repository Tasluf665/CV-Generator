import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import { 
  selectSkills, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateSkills, 
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';

const SkillsSection = () => {
  const dispatch = useDispatch();
  const skills = useSelector(selectSkills);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'skills'));

  const handleUpdate = (index, updates) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], ...updates };
    dispatch(updateSkills(newSkills));
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
        <div key={index} style={{ marginBottom: index < skills.length - 1 ? '16px' : 0 }}>
          <Input
            label={skill.category}
            value={skill.items}
            onChange={(e) => handleUpdate(index, { items: e.target.value })}
            placeholder="e.g. React, Node.js, Design Systems..."
          />
        </div>
      ))}
    </SectionCard>
  );
};

export default SkillsSection;
