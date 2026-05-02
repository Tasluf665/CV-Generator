import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectDesign,
  selectSectionOrder,
  selectCustomSections
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import {
  updateDesign,
  moveSection
} from '../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './DesignerPanel.module.css';

const SectionAccordion = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className={styles.sectionAccordion}>
      <div className={styles.accordionHeader} onClick={onToggle}>
        <span className={styles.accordionTitle}>{title}</span>
        <div className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="#506169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {isOpen && <div className={styles.accordionContent}>{children}</div>}
    </div>
  );
};

const DesignerPanel = () => {
  const dispatch = useDispatch();
  const design = useSelector(selectDesign);
  const sectionOrder = useSelector(selectSectionOrder) || ['summary', 'workExperience', 'education', 'skills', 'projects'];
  const customSections = useSelector(selectCustomSections);
  
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);
  const [isArrangementOpen, setIsArrangementOpen] = useState(true);
  const [isStylingOpen, setIsStylingOpen] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleUpdate = (updates) => {
    dispatch(updateDesign(updates));
  };

  const handleSectionUpdate = (sectionId, updates) => {
    const sectionStyles = { ...design.sectionStyles };
    sectionStyles[sectionId] = { ...sectionStyles[sectionId], ...updates };
    dispatch(updateDesign({ sectionStyles }));
  };

  const handleMove = (index, direction) => {
    dispatch(moveSection({ index, direction }));
  };

  const getSectionLabel = (id) => {
    switch (id) {
      case 'summary': return 'Summary';
      case 'workExperience': return 'Work Experience';
      case 'education': return 'Education';
      case 'skills': return 'Skills';
      case 'projects': return 'Projects';
      default:
        const custom = customSections?.find(s => s.id === id);
        return custom ? custom.title : id;
    }
  };

  const fonts = [
    { id: 'Inter', name: 'Inter' },
    { id: 'Poppins', name: 'Poppins' },
    { id: 'Roboto', name: 'Roboto' },
    { id: 'Open Sans', name: 'Open Sans' },
    { id: 'Montserrat', name: 'Montserrat' },
    { id: 'Lato', name: 'Lato' },
    { id: 'Playfair Display', name: 'Playfair Display' },
    { id: 'Merriweather', name: 'Merriweather' },
  ];

  const accentColors = [
    '#00b894', '#0984e3', '#6c5ce7', '#d63031', '#e84393',
    '#fdcb6e', '#2d3436', '#131d21', '#506169', '#bbcac3'
  ];

  return (
    <div className={styles.container}>
      <div className={styles.scrollContent}>
        {/* Template Section */}
        <div className={styles.section}>
          <div className={styles.accordionHeader} onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}>
            <h3 className={styles.sectionTitle}>Templates</h3>
            <div className={`${styles.chevron} ${isTemplatesOpen ? styles.open : ''}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1L6 6L11 1" stroke="#506169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {isTemplatesOpen && (
            <div className={styles.templateList}>
              <div className={styles.templateCardBrowse}>
                <div className={styles.browseIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <span>Browse<br />Templates</span>
              </div>

              <div
                className={`${styles.templateCard} ${design.template === 'modern' ? styles.activeTemplate : ''}`}
                onClick={() => handleUpdate({ template: 'modern' })}
              >
                <div className={styles.templatePreviewModern}>
                  <div className={styles.miniHeader}></div>
                  <div className={styles.miniBody}>
                    <div className={styles.miniSidebar}></div>
                    <div className={styles.miniMain}></div>
                  </div>
                </div>
                {design.template === 'modern' && (
                  <div className={styles.selectedBadge}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

              <div
                className={`${styles.templateCard} ${design.template === 'professional' ? styles.activeTemplate : ''}`}
                onClick={() => handleUpdate({ template: 'professional' })}
              >
                <div className={styles.templatePreviewProfessional}>
                  <div className={styles.miniHeaderProf}></div>
                  <div className={styles.miniBodyProf}></div>
                </div>
                {design.template === 'professional' && (
                  <div className={styles.selectedBadge}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Section Arrangement */}
        <div className={styles.section}>
          <div className={styles.accordionHeader} onClick={() => setIsArrangementOpen(!isArrangementOpen)}>
            <h3 className={styles.sectionTitle}>Section Arrangement</h3>
            <div className={`${styles.chevron} ${isArrangementOpen ? styles.open : ''}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1L6 6L11 1" stroke="#506169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {isArrangementOpen && (
            <div className={styles.arrangementList}>
              {sectionOrder.map((sectionId, index) => (
                <div key={sectionId} className={styles.orderItem}>
                  <div className={styles.orderItemContent}>
                    <div className={styles.dragHandle}>
                      <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
                        <circle cx="4" cy="4" r="1.5" fill="#94a3b8"/>
                        <circle cx="8" cy="4" r="1.5" fill="#94a3b8"/>
                        <circle cx="4" cy="9" r="1.5" fill="#94a3b8"/>
                        <circle cx="8" cy="9" r="1.5" fill="#94a3b8"/>
                        <circle cx="4" cy="14" r="1.5" fill="#94a3b8"/>
                        <circle cx="8" cy="14" r="1.5" fill="#94a3b8"/>
                      </svg>
                    </div>
                    <span className={styles.sectionLabel}>{getSectionLabel(sectionId)}</span>
                  </div>
                  <div className={styles.orderActions}>
                    <button 
                      className={styles.orderBtn}
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      title="Move Up"
                    >
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                        <path d="M1 6L6 1L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button 
                      className={styles.orderBtn}
                      disabled={index === sectionOrder.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      title="Move Down"
                    >
                      <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Global Styling Section */}
        <div className={styles.section}>
          <div className={styles.accordionHeader} onClick={() => setIsStylingOpen(!isStylingOpen)}>
            <h3 className={styles.sectionTitle}>Global Styling</h3>
            <div className={`${styles.chevron} ${isStylingOpen ? styles.open : ''}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1L6 6L11 1" stroke="#506169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {isStylingOpen && (
            <div className={styles.stylingContent}>
              {/* Font Style */}
              <div className={styles.field}>
                <label>Default Font</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={design.font}
                    onChange={(e) => handleUpdate({ font: e.target.value })}
                    style={{ fontFamily: design.font }}
                  >
                    {fonts.map(font => (
                      <option key={font.id} value={font.id} style={{ fontFamily: font.id }}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Accent Color */}
              <div className={styles.field}>
                <label>Accent Color</label>
                <div className={styles.colorGrid}>
                  {accentColors.map(color => (
                    <button
                      key={color}
                      className={`${styles.colorCircle} ${design.accentColor === color ? styles.activeColor : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleUpdate({ accentColor: color })}
                    >
                      {design.accentColor === color && <div className={styles.colorRing} style={{ borderColor: color }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Page Margin & Base Font Size */}
              <div className={styles.gridFields}>
                <div className={styles.field}>
                  <label>Page Margin</label>
                  <div className={styles.numericInput} style={{ width: '100%' }}>
                    <input
                      type="number"
                      value={design.margin}
                      onChange={(e) => handleUpdate({ margin: parseInt(e.target.value) || 0 })}
                    />
                    <span>px</span>
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Base Font Size</label>
                  <div className={styles.numericInput} style={{ width: '100%' }}>
                    <input
                      type="number"
                      value={design.fontSize}
                      onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) || 12 })}
                    />
                    <span>px</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section Styling */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Section Styles</h3>
          </div>

          {[
            { id: 'title', name: 'Title' },
            { id: 'contact', name: 'Contact Information' },
            { id: 'summary', name: 'Summary' },
            { id: 'experience', name: 'Work Experience' },
            { id: 'education', name: 'Education' },
            { id: 'projects', name: 'Projects' },
            { id: 'skills', name: 'Skills' },
            ...(customSections || []).map(s => ({ id: s.id, name: s.title }))
          ].map((sec) => (
            <SectionAccordion
              key={sec.id}
              title={sec.name}
              isOpen={expandedSection === sec.id}
              onToggle={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
            >
              <div className={styles.stylingContent}>
                {/* Font Family */}
                <div className={styles.field}>
                  <label>Font Family</label>
                  <div className={styles.selectWrapper}>
                    <select
                      value={design.sectionStyles?.[sec.id]?.fontFamily || design.font}
                      onChange={(e) => handleSectionUpdate(sec.id, { fontFamily: e.target.value })}
                      style={{ fontFamily: design.sectionStyles?.[sec.id]?.fontFamily || design.font }}
                    >
                      {fonts.map(font => (
                        <option key={font.id} value={font.id} style={{ fontFamily: font.id }}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Font Size & Color */}
                <div className={styles.gridFields}>
                  <div className={styles.field}>
                    <label>Font Size</label>
                    <div className={styles.numericInput}>
                      <input
                        type="number"
                        value={design.sectionStyles?.[sec.id]?.fontSize || 14}
                        onChange={(e) => handleSectionUpdate(sec.id, { fontSize: parseInt(e.target.value) || 12 })}
                      />
                      <span>px</span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Color</label>
                    <div className={styles.colorInputWrapper}>
                      <input
                        type="color"
                        value={design.sectionStyles?.[sec.id]?.color || '#2d3436'}
                        onChange={(e) => handleSectionUpdate(sec.id, { color: e.target.value })}
                        className={styles.colorPicker}
                      />
                      <span className={styles.colorHex}>{design.sectionStyles?.[sec.id]?.color || '#2d3436'}</span>
                    </div>
                  </div>
                </div>

                {/* Line Height & Letter Spacing */}
                <div className={styles.gridFields}>
                  <div className={styles.field}>
                    <label>Line Height</label>
                    <div className={styles.numericInput}>
                      <input
                        type="number"
                        value={design.sectionStyles?.[sec.id]?.lineHeight || 140}
                        onChange={(e) => handleSectionUpdate(sec.id, { lineHeight: parseInt(e.target.value) || 100 })}
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Letter Spacing</label>
                    <div className={styles.numericInput}>
                      <input
                        type="number"
                        step="0.1"
                        value={design.sectionStyles?.[sec.id]?.letterSpacing || 0}
                        onChange={(e) => handleSectionUpdate(sec.id, { letterSpacing: parseFloat(e.target.value) || 0 })}
                      />
                      <span>px</span>
                    </div>
                  </div>
                </div>

                {/* Margin & Alignment */}
                <div className={styles.gridFields}>
                  <div className={styles.field}>
                    <label>Bottom Margin</label>
                    <div className={styles.numericInput}>
                      <input
                        type="number"
                        value={design.sectionStyles?.[sec.id]?.margin || 10}
                        onChange={(e) => handleSectionUpdate(sec.id, { margin: parseInt(e.target.value) || 0 })}
                      />
                      <span>px</span>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Alignment</label>
                    <div className={styles.alignmentToggle}>
                      {['left', 'center', 'right'].map(align => (
                        <button
                          key={align}
                          className={`${styles.alignBtn} ${design.sectionStyles?.[sec.id]?.alignment === align ? styles.activeAlign : ''}`}
                          onClick={() => handleSectionUpdate(sec.id, { alignment: align })}
                          title={align.charAt(0).toUpperCase() + align.slice(1)}
                        >
                          {align === 'left' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="18" y2="18"></line></svg>}
                          {align === 'center' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>}
                          {align === 'right' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="9" y1="12" x2="21" y2="12"></line><line x1="6" y1="18" x2="21" y2="18"></line></svg>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SectionAccordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignerPanel;
