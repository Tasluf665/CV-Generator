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
  const isVisible = (field) => (contact?.visibleFields || []).includes(field);


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
            <h1 className={styles.name}>
              {contact?.firstName || contact?.lastName 
                ? `${isVisible('firstName') ? contact.firstName || '' : ''} ${isVisible('lastName') ? contact.lastName || '' : ''}`.trim().toUpperCase() 
                : 'YOUR NAME'}
              {isVisible('pronouns') && contact?.pronouns && (
                <span className={styles.pronouns}> ({contact.pronouns})</span>
              )}
            </h1>
            <div className={styles.contactInfo}>
              {isVisible('address') && (contact?.address || contact?.city || contact?.state) && (
                <span className={styles.contactItem}>
                  {[contact.address, contact.city, contact.state].filter(Boolean).join(', ')}
                </span>
              )}
              {isVisible('email') && contact?.email && <span className={styles.contactItem}>{contact.email}</span>}
              {isVisible('phone') && contact?.phone && <span className={styles.contactItem}>{contact.phone}</span>}
              {isVisible('linkedin') && contact?.linkedin && (
                <span className={styles.contactItem}>
                  {contact.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              )}
              {isVisible('website') && contact?.website && (
                <span className={styles.contactItem}>
                  {contact.website.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              )}
              {isVisible('twitter') && contact?.twitter && (
                <span className={styles.contactItem}>
                  @{contact.twitter.replace(/^https?:\/\/(www\.)?(twitter\.com\/|x\.com\/)/, '')}
                </span>
              )}
            </div>
          </header>
        );
      case 'summary':
        return (resumeData.targetJobTitle || summary) ? (
          <section key="summary" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {resumeData.targetJobTitle || 'Summary'}
            </h2>
            <p className={styles.summaryText}>{summary}</p>
          </section>
        ) : null;
      case 'workExperience':
        return workExperience?.length > 0 && (
          <section 
            key="workExperience"
            className={styles.section}
            style={{
              fontFamily: 'var(--experience-font)',
              fontSize: 'var(--experience-size)',
              color: 'var(--experience-color)',
              marginBottom: 'var(--experience-margin)',
              lineHeight: 'var(--experience-line-height)',
              letterSpacing: 'var(--experience-letter-spacing)',
              textAlign: 'var(--experience-align)',
            }}
          >
            <h2 className={styles.sectionTitle}>Work Experience</h2>
            {workExperience
              .filter(job => job.isVisible)
              .map(job => (
                <div key={job.id} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemTitle}>
                      {job.isRoleVisible && job.role}
                      {job.isRoleVisible && job.isCompanyVisible && ', '}
                      {job.isCompanyVisible && job.company}
                      {((job.isRoleVisible || job.isCompanyVisible) && job.isLocationVisible && job.location) && `, ${job.location}`}
                    </span>
                    {job.isDateVisible && (
                      <span className={styles.itemDate}>
                        {job.startDate} {(job.startDate || job.endDate) && '–'} {job.isCurrent ? 'Present' : job.endDate}
                      </span>
                    )}
                  </div>
                  
                  {job.isCompanyVisible && job.companyDescription && (
                    <p className={styles.companyDescription}>{job.companyDescription}</p>
                  )}
                  {job.isRoleVisible && job.positionDescription && (
                    <p className={styles.roleDescription}>{job.positionDescription}</p>
                  )}

                  <div className={styles.itemDescription}>
                    {job.bullets?.filter(b => b.isVisible && b.text).map((bullet, i) => (
                      <p key={i} className={styles.bullet}>{bullet.text}</p>
                    ))}
                  </div>
                </div>
              ))}
          </section>
        );
      case 'education':
        return education?.length > 0 && education.some(edu => edu.isVisible) && (
          <section 
            key="education"
            className={styles.section}
            style={{
              fontFamily: 'var(--education-font)',
              fontSize: 'var(--education-size)',
              color: 'var(--education-color)',
              marginBottom: 'var(--education-margin)',
              lineHeight: 'var(--education-line-height)',
              letterSpacing: 'var(--education-letter-spacing)',
              textAlign: 'var(--education-align)',
            }}
          >
            <h2 className={styles.sectionTitle}>Education</h2>
            {education
              .filter(edu => edu.isVisible)
              .map(edu => (
                <div key={edu.id} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemMainInfo}>
                      <span className={styles.itemTitle}>
                        {edu.isDegreeVisible && edu.degree}
                        {edu.isDegreeVisible && edu.isFieldVisible && edu.field && ` in ${edu.field}`}
                        {edu.isInstitutionVisible && edu.school && (
                          <>
                            {edu.isDegreeVisible ? ' | ' : ''}
                            {edu.school}
                          </>
                        )}
                      </span>
                      {edu.isLocationVisible && edu.location && (
                        <span className={styles.itemLocation}>, {edu.location}</span>
                      )}
                    </div>
                    {edu.isDateVisible && (
                      <span className={styles.itemDate}>{edu.startDate} {edu.endDate && `— ${edu.endDate}`}</span>
                    )}
                  </div>
                  
                  {edu.isGpaVisible && edu.gpa && (
                    <p className={styles.gpa}>GPA: {edu.gpa}</p>
                  )}

                  <div className={styles.itemDescription}>
                    {edu.bullets?.filter(b => b.isVisible && b.text).map((bullet, i) => (
                      <p key={i} className={styles.bullet}>{bullet.text}</p>
                    ))}
                  </div>
                </div>
              ))}
          </section>
        );
      case 'projects':
        return projects?.length > 0 && projects.some(p => p.isVisible) && (
          <section 
            key="projects"
            className={styles.section}
            style={{
              fontFamily: 'var(--projects-font)',
              fontSize: 'var(--projects-size)',
              color: 'var(--projects-color)',
              marginBottom: 'var(--projects-margin)',
              lineHeight: 'var(--projects-line-height)',
              letterSpacing: 'var(--projects-letter-spacing)',
              textAlign: 'var(--projects-align)',
            }}
          >
            <h2 className={styles.sectionTitle}>Projects</h2>
            {projects
              .filter(p => p.isVisible)
              .map(p => (
                <div key={p.id} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemMainInfo}>
                      <span className={styles.itemTitle}>
                        {p.isNameVisible && p.name}
                        {p.isNameVisible && p.title && ` | ${p.title}`}
                        {p.isUrlVisible && p.link && (
                          <>
                            {p.isNameVisible || p.title ? ' | ' : ''}
                            <span className={styles.itemLink}>{p.link.replace(/^https?:\/\//, '')}</span>
                          </>
                        )}
                      </span>
                    </div>
                    {p.isDateVisible && (p.startDate || p.endDate) && (
                      <span className={styles.itemDate}>{p.startDate} {p.endDate && `— ${p.endDate}`}</span>
                    )}
                  </div>
                  
                  <div className={styles.itemDescription}>
                    {p.bullets?.filter(b => b.isVisible && b.text).map((bullet, i) => (
                      <p key={i} className={styles.bullet}>{bullet.text}</p>
                    ))}
                  </div>
                </div>
              ))}
          </section>
        );
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
        
        // Title styles
        '--title-font': design?.sectionStyles?.title?.fontFamily || design?.font || 'Inter',
        '--title-size': `${design?.sectionStyles?.title?.fontSize || 24}px`,
        '--title-color': design?.sectionStyles?.title?.color || '#2d3436',
        '--title-margin': `${design?.sectionStyles?.title?.margin || 10}px`,
        '--title-line-height': (design?.sectionStyles?.title?.lineHeight || 120) / 100,
        '--title-letter-spacing': `${design?.sectionStyles?.title?.letterSpacing || 0}px`,
        '--title-align': design?.sectionStyles?.title?.alignment || 'left',

        // Summary styles
        '--summary-font': design?.sectionStyles?.summary?.fontFamily || design?.font || 'Inter',
        '--summary-size': `${design?.sectionStyles?.summary?.fontSize || 14}px`,
        '--summary-color': design?.sectionStyles?.summary?.color || '#506169',
        '--summary-margin': `${design?.sectionStyles?.summary?.margin || 10}px`,
        '--summary-line-height': (design?.sectionStyles?.summary?.lineHeight || 140) / 100,
        '--summary-letter-spacing': `${design?.sectionStyles?.summary?.letterSpacing || 0}px`,
        '--summary-align': design?.sectionStyles?.summary?.alignment || 'left',

        // Experience styles
        '--experience-font': design?.sectionStyles?.experience?.fontFamily || design?.font || 'Inter',
        '--experience-size': `${design?.sectionStyles?.experience?.fontSize || 14}px`,
        '--experience-color': design?.sectionStyles?.experience?.color || '#2d3436',
        '--experience-margin': `${design?.sectionStyles?.experience?.margin || 15}px`,
        '--experience-line-height': (design?.sectionStyles?.experience?.lineHeight || 140) / 100,
        '--experience-letter-spacing': `${design?.sectionStyles?.experience?.letterSpacing || 0}px`,
        '--experience-align': design?.sectionStyles?.experience?.alignment || 'left',

        // Education styles
        '--education-font': design?.sectionStyles?.education?.fontFamily || design?.font || 'Inter',
        '--education-size': `${design?.sectionStyles?.education?.fontSize || 14}px`,
        '--education-color': design?.sectionStyles?.education?.color || '#2d3436',
        '--education-margin': `${design?.sectionStyles?.education?.margin || 15}px`,
        '--education-line-height': (design?.sectionStyles?.education?.lineHeight || 140) / 100,
        '--education-letter-spacing': `${design?.sectionStyles?.education?.letterSpacing || 0}px`,
        '--education-align': design?.sectionStyles?.education?.alignment || 'left',

        // Projects styles
        '--projects-font': design?.sectionStyles?.projects?.fontFamily || design?.font || 'Inter',
        '--projects-size': `${design?.sectionStyles?.projects?.fontSize || 14}px`,
        '--projects-color': design?.sectionStyles?.projects?.color || '#2d3436',
        '--projects-margin': `${design?.sectionStyles?.projects?.margin || 15}px`,
        '--projects-line-height': (design?.sectionStyles?.projects?.lineHeight || 140) / 100,
        '--projects-letter-spacing': `${design?.sectionStyles?.projects?.letterSpacing || 0}px`,
        '--projects-align': design?.sectionStyles?.projects?.alignment || 'left',

        // Skills styles
        '--skills-font': design?.sectionStyles?.skills?.fontFamily || design?.font || 'Inter',
        '--skills-size': `${design?.sectionStyles?.skills?.fontSize || 14}px`,
        '--skills-color': design?.sectionStyles?.skills?.color || '#2d3436',
        '--skills-margin': `${design?.sectionStyles?.skills?.margin || 10}px`,
        '--skills-line-height': (design?.sectionStyles?.skills?.lineHeight || 140) / 100,
        '--skills-letter-spacing': `${design?.sectionStyles?.skills?.letterSpacing || 0}px`,
        '--skills-align': design?.sectionStyles?.skills?.alignment || 'left',
      }}
    >
      {/* Hidden measure area */}
      <div className={styles.hiddenMaster} ref={measureRef} data-html2pdf-ignore="true">
        {renderSection('header')}
        {renderSection('summary')}
        {renderSection('workExperience')}
        {renderSection('education')}
        {renderSection('projects')}
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
