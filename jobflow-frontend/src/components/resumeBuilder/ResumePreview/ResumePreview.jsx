import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { 
  selectResumeData 
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './ResumePreview.module.css';

const ResumePreview = () => {
  const resumeData = useSelector(selectResumeData);
  const { contact, summary, workExperience, education, skills, projects } = resumeData;


  const [pages, setPages] = useState([]);
  const containerRef = useRef(null);
  const measureRef = useRef(null);

  const PAGE_HEIGHT = 1122;
  const PAGE_PADDING = 60;
  const MAX_CONTENT_HEIGHT = PAGE_HEIGHT - (PAGE_PADDING * 2);

  useLayoutEffect(() => {
    if (measureRef.current) {
      const children = Array.from(measureRef.current.children);
      const newPages = [];
      let currentPageItems = [];
      let currentHeight = 0;

      children.forEach((child) => {
        const childHeight = child.offsetHeight + 24; // Including gap (24px)
        
        if (currentHeight + childHeight > MAX_CONTENT_HEIGHT && currentPageItems.length > 0) {
          newPages.push(currentPageItems);
          currentPageItems = [child.cloneNode(true)];
          currentHeight = childHeight;
        } else {
          currentPageItems.push(child.cloneNode(true));
          currentHeight += childHeight;
        }
      });

      if (currentPageItems.length > 0) {
        newPages.push(currentPageItems);
      }

      setPages(newPages);
    }
  }, [resumeData]);

  const renderSection = (type, data) => {
    switch (type) {
      case 'header':
        return (
          <header key="header" className={styles.header}>
            <h1 className={styles.name}>{contact?.fullName || 'YOUR NAME'}</h1>
            <p className={styles.title}>{contact?.title || 'Target Job Title'}</p>
            <div className={styles.contactInfo}>
              {contact?.email && <span className={styles.contactItem}>{contact.email}</span>}
              {contact?.phone && <span className={styles.contactItem}>{contact.phone}</span>}
              {contact?.location && <span className={styles.contactItem}>{contact.location}</span>}
              {contact?.linkedin && <span className={styles.contactItem}>{contact.linkedin}</span>}
              {contact?.website && <span className={styles.contactItem}>{contact.website}</span>}
            </div>
          </header>
        );
      case 'summary':
        return summary ? (
          <section key="summary" className={styles.section}>
            <p className={styles.summaryText}>{summary}</p>
          </section>
        ) : null;
      case 'skills':
        return skills?.length > 0 ? (
          <section key="skills" className={styles.section}>
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
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={styles.pagedContainer} ref={containerRef}>
      {/* Hidden measure area */}
      <div className={styles.hiddenMaster} ref={measureRef} data-html2pdf-ignore="true">
        {renderSection('header')}
        {renderSection('summary')}
        
        {/* Work Experience Header */}
        {workExperience?.length > 0 && <h2 className={styles.sectionTitle}>WORK EXPERIENCE</h2>}
        {workExperience?.map(job => (
          <div key={job.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>{job.company}</span>
              <span className={styles.itemDate}>{job.startDate} - {job.endDate}</span>
            </div>
            <p className={styles.itemSubTitle}>{job.role}</p>
            <div className={styles.itemDescription}>
              {job.description && job.description.split('\n').map((line, i) => (
                <p key={i} className={styles.bullet}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {/* Education Header */}
        {education?.length > 0 && <h2 className={styles.sectionTitle}>EDUCATION</h2>}
        {education?.map(edu => (
          <div key={edu.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>{edu.school}</span>
              <span className={styles.itemDate}>{edu.startDate} {edu.endDate && `— ${edu.endDate}`}</span>
            </div>
            <p className={styles.itemSubTitle}>{edu.degree}</p>
            <div className={styles.itemDescription}>
              {edu.description && edu.description.split('\n').map((line, i) => (
                <p key={i} className={styles.bullet}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {/* Projects Header */}
        {projects?.length > 0 && <h2 className={styles.sectionTitle}>PROJECTS</h2>}
        {projects?.map(project => (
          <div key={project.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.itemTitle}>{project.name}</span>
              <span className={styles.itemDate}>
                {project.link && (
                  <span className={styles.projectLink}>
                    {project.link.replace(/^https?:\/\//, '')}
                  </span>
                )}
              </span>
            </div>
            <p className={styles.itemSubTitle}>{project.title}</p>
            <div className={styles.itemDescription}>
              {project.description && project.description.split('\n').map((line, i) => (
                <p key={i} className={styles.bullet}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        {renderSection('skills')}
      </div>

      {/* Actual Pages */}
      {pages.length > 0 ? (
        pages.map((pageItems, pageIdx) => (
          <div key={pageIdx} className={styles.a4Page}>
            {pageItems.map((item, itemIdx) => (
              <div key={itemIdx} dangerouslySetInnerHTML={{ __html: item.outerHTML }} />
            ))}
          </div>
        ))
      ) : (
        <div className={styles.a4Page}>
          {renderSection('header')}
          {renderSection('summary')}
          {renderSection('workExperience')}
          {renderSection('education')}
          {renderSection('projects')}
          {renderSection('skills')}
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
