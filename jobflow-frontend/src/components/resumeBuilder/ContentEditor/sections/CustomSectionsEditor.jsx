import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectResumeData } from '../../../../features/resumeBuilder/resumeBuilderSelectors';
import { addCustomSection } from '../../../../features/resumeBuilder/resumeBuilderSlice';
import CustomSectionCard from './CustomSectionCard';
import AddCustomSectionModal from '../modals/AddCustomSectionModal';
import styles from '../ContentEditor.module.css';

const CustomSectionsEditor = () => {
  const dispatch = useDispatch();
  const resumeData = useSelector(selectResumeData);
  const customSections = resumeData.customSections || [];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSection = (title) => {
    if (title) {
      dispatch(addCustomSection(title));
    }
  };

  return (
    <div className={styles.customSectionsContainer}>
      {customSections.map((section) => (
        <CustomSectionCard key={section.id} section={section} />
      ))}
      
      <button className={styles.addSectionGlobalBtn} onClick={() => setIsModalOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Custom Section
      </button>

      <AddCustomSectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSection}
      />
    </div>
  );
};

export default CustomSectionsEditor;
