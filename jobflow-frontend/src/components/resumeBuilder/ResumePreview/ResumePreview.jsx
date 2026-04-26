import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { 
  selectResumeData,
  selectDesign
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './ResumePreview.module.css';

const ResumePreview = () => {
  const resumeData = useSelector(selectResumeData);
  const design = useSelector(selectDesign);
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
            <div className={styles.contactInfo}>
              {contact?.location && <span className={styles.contactItem}>{contact.location}</span>}
              {contact?.email && <span className={styles.contactItem}>{contact.email}</span>}
              {contact?.phone && <span className={styles.contactItem}>{contact.phone}</span>}
              {contact?.linkedin && (
                <span className={styles.contactItem}>
                  {contact.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                </span>
              )}
              {contact?.website && (
                <span className={styles.contactItem}>
                  {contact.website.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                </span>
              )}
            </div>
          </header>
        );
      case 'summary':
        return summary ? (
          <section key="summary" className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <p className={styles.summaryText}>{summary}</p>
          </section>
        ) : null;
      case 'skills':
        return (
          <section key="skills" className={styles.section}>
            <h2 className={styles.sectionTitle}>Tech Skills</h2>
            <div className={styles.skillsList}>
              {skills?.map((skill, index) => (
                <p key={index} className={styles.skillItem}>
                  <span className={styles.skillCategory}>{skill.category}: </span>
                  {skill.items}
                </p>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={styles.pagedContainer} 
      ref={containerRef}
      style={{
        '--font-family': design?.font || 'Inter',
        '--accent-color': design?.accentColor || '#00b894',
        '--line-height': design?.lineHeight || 140,
        '--list-line-height': design?.listLineHeight || 120,
        '--font-size': `${design?.fontSize || 14}px`,
        '--page-margin': `${design?.margin || 48}px`,
      }}
    >
      {/* Hidden measure area */}
      <div className={styles.hiddenMaster} ref={measureRef} data-html2pdf-ignore="true">
        {renderSection('header')}
        {renderSection('summary')}
        
        {/* Work Experience Header */}
        {workExperience?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            {workExperience.map(job => (
              <div key={job.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>
                    {job.role}, {job.company}, {job.location}
                  </span>
                  <span className={styles.itemDate}>{job.startDate} – {job.endDate}</span>
                </div>
                <div className={styles.itemDescription}>
                  {job.description && job.description.split('\n').map((line, i) => (
                    <p key={i} className={styles.bullet}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Education Header */}
        {education?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {education.map(edu => (
              <div key={edu.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{edu.degree} | {edu.school}</span>
                  <span className={styles.itemDate}>{edu.startDate} {edu.endDate && `— ${edu.endDate}`}</span>
                </div>
                <div className={styles.itemDescription}>
                  {edu.description && edu.description.split('\n').map((line, i) => (
                    <p key={i} className={styles.bullet}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects Header */}
        {projects?.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            {projects.map(project => (
              <div key={project.id} className={styles.item}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>
                    {project.name} | {project.title} | {project.link?.replace(/^https?:\/\//, '')}
                  </span>
                </div>
                <div className={styles.itemDescription}>
                  {project.description && project.description.split('\n').map((line, i) => (
                    <p key={i} className={styles.bullet}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

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
