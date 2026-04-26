import React from 'react';
import { useSelector } from 'react-redux';
import { 
  selectResumeData 
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './ResumePreview.module.css';

const ResumePreview = () => {
  const resumeData = useSelector(selectResumeData);
  const { contact, summary, workExperience, education, skills } = resumeData;

  return (
    <div className={styles.a4Page}>
      <header className={styles.header}>
        <h1 className={styles.name}>{contact.fullName || 'YOUR NAME'}</h1>
        <p className={styles.title}>{contact.title || 'Target Job Title'}</p>
        <div className={styles.contactInfo}>
          {contact.email && <span className={styles.contactItem}>{contact.email}</span>}
          {contact.phone && <span className={styles.contactItem}>{contact.phone}</span>}
          {contact.location && <span className={styles.contactItem}>{contact.location}</span>}
          {contact.linkedin && <span className={styles.contactItem}>{contact.linkedin}</span>}
        </div>
      </header>

      {summary && (
        <section className={styles.section}>
          <p className={styles.summaryText}>{summary}</p>
        </section>
      )}

      {workExperience && workExperience.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>WORK EXPERIENCE</h2>
          {workExperience.map((job) => (
            <div key={job.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{job.company}</span>
                <span className={styles.itemDate}>{job.startDate} - {job.endDate}</span>
              </div>
              <p className={styles.itemSubTitle}>{job.role}</p>
              <div className={styles.itemDescription}>
                {job.description.split('\n').map((line, i) => (
                  <p key={i} className={styles.bullet}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {education && education.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>EDUCATION</h2>
          {education.map((edu) => (
            <div key={edu.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{edu.school}</span>
                <span className={styles.itemDate}>{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className={styles.itemSubTitle}>{edu.degree}</p>
            </div>
          ))}
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>SKILLS</h2>
          <div className={styles.skillsList}>
            {skills.map((skill, index) => (
              <p key={index} className={styles.skillItem}>
                <span className={styles.skillCategory}>{skill.category}: </span>
                {skill.items}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
