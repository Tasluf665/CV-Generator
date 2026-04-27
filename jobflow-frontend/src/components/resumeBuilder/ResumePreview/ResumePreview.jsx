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
        
        {/* Work Experience */}
        {workExperience?.length > 0 && (
          <section className={styles.section}>
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
        )}

        {/* Education Header */}
        {education?.length > 0 && education.some(edu => edu.isVisible) && (
          <section className={styles.section}>
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
        )}

        {/* Projects Header */}
        {projects?.length > 0 && projects.some(p => p.isVisible) && (
          <section className={styles.section}>
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
