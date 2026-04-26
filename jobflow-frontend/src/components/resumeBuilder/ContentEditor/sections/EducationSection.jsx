import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import TextArea from '../../../common/TextArea/TextArea';
import Button from '../../../common/Button/Button';
import { 
  selectEducation, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateEducation, 
  addEducation, 
  removeEducation, 
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';

const EducationSection = () => {
  const dispatch = useDispatch();
  const education = useSelector(selectEducation);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'education'));

  const handleUpdate = (id, updates) => {
    dispatch(updateEducation({ id, updates }));
  };

  const handleAdd = () => {
    dispatch(addEducation());
  };

  const handleRemove = (id) => {
    dispatch(removeEducation(id));
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
    >
      {education.map((edu, index) => (
        <div key={edu.id} style={{ borderBottom: index < education.length - 1 ? '1px solid #d9e4e9' : 'none', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Education #{index + 1}</h4>
            <button 
              onClick={() => handleRemove(edu.id)}
              style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontSize: '12px' }}
            >
              Remove
            </button>
          </div>

          <Input
            label="School / University"
            value={edu.school}
            onChange={(e) => handleUpdate(edu.id, { school: e.target.value })}
            placeholder="e.g. State University"
            className="mb-4"
            style={{ marginBottom: '16px' }}
          />

          <Input
            label="Degree"
            value={edu.degree}
            onChange={(e) => handleUpdate(edu.id, { degree: e.target.value })}
            placeholder="e.g. Bachelor of Fine Arts"
            style={{ marginBottom: '16px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Start Date"
              value={edu.startDate}
              onChange={(e) => handleUpdate(edu.id, { startDate: e.target.value })}
              placeholder="e.g. 2014"
            />
            <Input
              label="End Date"
              value={edu.endDate}
              onChange={(e) => handleUpdate(edu.id, { endDate: e.target.value })}
              placeholder="e.g. 2018"
            />
          </div>

          <TextArea
            label="Description / Bullet Points"
            value={edu.description}
            onChange={(e) => handleUpdate(edu.id, { description: e.target.value })}
            placeholder="List your academic achievements, awards, or relevant coursework..."
          />

        </div>
      ))}

      <Button 
        variant="ghost" 
        onClick={handleAdd}
        style={{ color: 'var(--color-primary)', alignSelf: 'flex-start', paddingLeft: 0 }}
      >
        <span style={{ marginRight: '8px' }}>+</span> Add education
      </Button>
    </SectionCard>
  );
};

export default EducationSection;
