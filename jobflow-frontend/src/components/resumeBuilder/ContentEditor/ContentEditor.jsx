import React from 'react';
import ContactSection from './sections/ContactSection';
import TitleSection from './sections/TitleSection';
import SummarySection from './sections/SummarySection';
import WorkExperienceSection from './sections/WorkExperienceSection';
import EducationSection from './sections/EducationSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import CustomSectionsEditor from './sections/CustomSectionsEditor';

import styles from './ContentEditor.module.css';

const ContentEditor = () => {
  return (
    <div className={styles.container}>
      <ContactSection />
      <TitleSection />
      <SummarySection />
      <WorkExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <SkillsSection />
      <CustomSectionsEditor />
    </div>
  );
};

export default ContentEditor;
