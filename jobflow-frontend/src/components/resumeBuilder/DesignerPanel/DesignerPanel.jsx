import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectDesign 
} from '../../../features/resumeBuilder/resumeBuilderSelectors';
import { 
  updateDesign 
} from '../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './DesignerPanel.module.css';

const DesignerPanel = () => {
  const dispatch = useDispatch();
  const design = useSelector(selectDesign);
  const [isStylingOpen, setIsStylingOpen] = useState(true);

  const handleUpdate = (updates) => {
    dispatch(updateDesign(updates));
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
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Templates</h3>
            <button className={styles.seeAllBtn}>See All</button>
          </div>
          
          <div className={styles.templateList}>
            <div className={styles.templateCardBrowse}>
              <div className={styles.browseIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>
              <span>Browse<br/>Templates</span>
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
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Styling Section */}
        <div className={styles.section}>
          <div className={styles.accordionHeader} onClick={() => setIsStylingOpen(!isStylingOpen)}>
            <h3 className={styles.sectionTitle}>Styling</h3>
            <div className={`${styles.chevron} ${isStylingOpen ? styles.open : ''}`}>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1L6 6L11 1" stroke="#506169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {isStylingOpen && (
            <div className={styles.stylingContent}>
              {/* Font Style */}
              <div className={styles.field}>
                <label>Font Style</label>
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

              {/* Line Height */}
              <div className={styles.field}>
                <label>Line Height</label>
                <div className={styles.inputGroup}>
                  <div className={styles.numericInput}>
                    <input 
                      type="number" 
                      value={design.lineHeight} 
                      onChange={(e) => handleUpdate({ lineHeight: parseInt(e.target.value) || 100 })}
                    />
                    <span>%</span>
                  </div>
                  <input 
                    type="range" 
                    className={styles.slider} 
                    min="100" 
                    max="200" 
                    step="5"
                    value={design.lineHeight}
                    onChange={(e) => handleUpdate({ lineHeight: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {/* List Line Height */}
              <div className={styles.field}>
                <label>List Line Height</label>
                <div className={styles.inputGroup}>
                  <div className={styles.numericInput}>
                    <input 
                      type="number" 
                      value={design.listLineHeight} 
                      onChange={(e) => handleUpdate({ listLineHeight: parseInt(e.target.value) || 100 })}
                    />
                    <span>%</span>
                  </div>
                  <input 
                    type="range" 
                    className={styles.slider} 
                    min="100" 
                    max="200" 
                    step="5"
                    value={design.listLineHeight}
                    onChange={(e) => handleUpdate({ listLineHeight: parseInt(e.target.value) })}
                  />
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
                  <button className={styles.colorCircle} style={{ background: 'linear-gradient(45deg, #f09, #302)' }}>
                    {/* Custom color picker icon could go here */}
                  </button>
                </div>
              </div>

              {/* Grid: Margin & Font Size */}
              <div className={styles.gridFields}>
                <div className={styles.field}>
                  <label>Margin</label>
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
                  <label>Font Size</label>
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
      </div>
    </div>
  );
};

export default DesignerPanel;
