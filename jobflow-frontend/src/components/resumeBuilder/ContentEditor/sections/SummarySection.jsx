import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import TextArea from '../../../common/TextArea/TextArea';
import { 
  selectSummary, 
  selectIsSectionExpanded 
} from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateSummary, 
  toggleSection 
} from '../../../../features/resumeBuilder/resumeBuilderSlice';

const SummarySection = () => {
  const dispatch = useDispatch();
  const summary = useSelector(selectSummary);
  const isExpanded = useSelector((state) => selectIsSectionExpanded(state, 'summary'));

  const handleChange = (e) => {
    dispatch(updateSummary(e.target.value));
  };

  const icon = (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 1H15M1 5H15M1 9H10M1 13H15" />
    </svg>
  );

  return (
    <SectionCard
      title="Professional Summary"
      icon={icon}
      isExpanded={isExpanded}
      onToggle={() => dispatch(toggleSection('summary'))}
    >
      <TextArea
        label="Professional Summary"
        value={summary}
        onChange={handleChange}
        placeholder="Briefly describe your career goals and key achievements..."
        rows={6}
      />
    </SectionCard>
  );
};

export default SummarySection;
