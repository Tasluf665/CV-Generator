import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCLContent,
  selectCLSelectedJobId,
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import { selectResumeData } from '../../../features/resumeBuilder/resumeBuilderSelectors';
import styles from './CoverLetterPreview.module.css';

const CoverLetterPreview = () => {
  const content = useSelector(selectCLContent);
  const resumeData = useSelector(selectResumeData);
  const jobs = useSelector((state) => state.jobs.items);
  const selectedJobId = useSelector(selectCLSelectedJobId);

  const [pages, setPages] = useState([]);
  const measureRef = useRef(null);

  const contact = resumeData?.contact || {};
  const fullName = [
    contact.firstName,
    contact.lastName,
  ].filter(Boolean).join(' ').toUpperCase() || 'YOUR NAME';

  const selectedJob = jobs?.find((j) => (j._id || j.id) === selectedJobId);

  // Split letter into lines to preserve EXACT formatting
  const lines = content ? content.split(/\r?\n/) : [];

  const PAGE_HEIGHT = 1122;
  const PADDING_TOP = 72;
  const PADDING_BOTTOM = 80;
  const MAX_CONTENT_HEIGHT = PAGE_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  useLayoutEffect(() => {
    if (measureRef.current && content) {
      const children = Array.from(measureRef.current.children);
      const newPages = [];
      let currentPageItems = [];
      let currentHeight = 0;

      // Header is always on the first page
      const header = children.find(child => child.tagName === 'HEADER');
      const headerHeight = header ? header.offsetHeight + 28 : 0; // margin-bottom: 28px

      const bodyItems = children.filter(child => child.tagName === 'P');

      currentHeight = headerHeight;
      currentPageItems = header ? [header.cloneNode(true)] : [];

      bodyItems.forEach((child) => {
        const childHeight = child.offsetHeight; // margin is 0 now

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
    } else {
      setPages([]);
    }
  }, [content, resumeData, lines.length]);

  return (
    <div className={styles.pageWrapper}>
      {/* Hidden measure area */}
      <div className={styles.hiddenMaster} ref={measureRef}>
        {content && (
          <>
            <header className={styles.letterHeader}>
              <h1 className={styles.name}>{fullName}</h1>
              <div className={styles.contactLine}>
                {[
                  contact.email,
                  contact.phone,
                  contact.city && contact.state
                    ? `${contact.city}, ${contact.state}`
                    : contact.city || contact.state,
                  contact.linkedin,
                ]
                  .filter(Boolean)
                  .map((item, i, arr) => (
                    <React.Fragment key={i}>
                      <span className={styles.contactItem}>{item}</span>
                      {i < arr.length - 1 && <span className={styles.sep}> | </span>}
                    </React.Fragment>
                  ))}
              </div>
              <div className={styles.divider} />
            </header>
            {lines.map((line, i) => (
              <p key={i} className={styles.paragraph}>
                {line || '\u00A0'}
              </p>
            ))}
          </>
        )}
      </div>

      {/* Actual Rendering */}
      {content ? (
        <div className={styles.pagedContainer}>
          {pages.length > 0 ? (
            pages.map((pageItems, pageIdx) => (
              <div key={pageIdx} className={`${styles.a4Page} cl-a4-page`}>
                {pageItems.map((item, itemIdx) => (
                  <div key={itemIdx} dangerouslySetInnerHTML={{ __html: item.outerHTML }} />
                ))}
              </div>
            ))
          ) : (
            <div className={`${styles.a4Page} cl-a4-page`}>
              <header className={styles.letterHeader}>
                <h1 className={styles.name}>{fullName}</h1>
                <div className={styles.contactLine}>
                  {[
                    contact.email,
                    contact.phone,
                    contact.city && contact.state
                      ? `${contact.city}, ${contact.state}`
                      : contact.city || contact.state,
                    contact.linkedin,
                  ]
                    .filter(Boolean)
                    .map((item, i, arr) => (
                      <React.Fragment key={i}>
                        <span className={styles.contactItem}>{item}</span>
                        {i < arr.length - 1 && <span className={styles.sep}> | </span>}
                      </React.Fragment>
                    ))}
                </div>
                <div className={styles.divider} />
              </header>
              <div className={styles.body}>
                {lines.map((line, i) => (
                  <p key={i} className={styles.paragraph}>
                    {line || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.a4Page}>
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className={styles.placeholderTitle}>Cover Letter Preview</h3>
            <p className={styles.placeholderText}>
              Select a job, choose a prompt, and click <strong>Generate Cover Letter</strong> to see your letter here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterPreview;
