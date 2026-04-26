import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import { 
  selectContactInfo, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateContact, 
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';

const TitleSection = () => {
  const dispatch = useDispatch();
  const contact = useSelector(selectContactInfo);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'title'));

  const handleChange = (e) => {
    dispatch(updateContact({ title: e.target.value }));
  };

  const icon = (
    <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    >
      <Input
        label="Target Job Title"
        name="title"
        value={contact.title}
        onChange={handleChange}
        placeholder="e.g. Senior Product Designer"
      />
    </SectionCard>
  );
};

export default TitleSection;
