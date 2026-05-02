import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import SectionCard from '../../../common/SectionCard/SectionCard';
import Input from '../../../common/Input/Input';
import TextArea from '../../../common/TextArea/TextArea';
import Button from '../../../common/Button/Button';
import {
  updateCustomSection,
  removeCustomSection,
  addCustomSectionItem,
  updateCustomSectionItem,
  removeCustomSectionItem,
  addCustomSectionBullet,
  updateCustomSectionBullet,
  removeCustomSectionBullet
} from '../../../../features/resumeBuilder/resumeBuilderSlice';
import styles from './WorkExperienceSection.module.css'; // Reusing styles for consistency

const CustomSectionCard = ({ section }) => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'add' or 'edit'
  const [editingItemId, setEditingItemId] = useState(null);
  const [isSectionExpanded, setIsSectionExpanded] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(section.title);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    description: '',
  });

  const handleAddClick = () => {
    setFormData({
      title: '',
      subtitle: '',
      date: '',
      description: '',
    });
    setViewMode('add');
    setIsSectionExpanded(true);
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      date: item.date,
      description: item.description || '',
    });
    setViewMode('edit');
  };

  const handleSaveTitle = () => {
    dispatch(updateCustomSection({ id: section.id, updates: { title: tempTitle } }));
    setIsEditingTitle(false);
  };

  const icon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );

  return (
    <SectionCard
      title={
        isEditingTitle ? (
          <div className={styles.titleEditContainer} onClick={(e) => e.stopPropagation()}>
            <input
              className={styles.titleInput}
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              autoFocus
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
            />
          </div>
        ) : (
          <span onDoubleClick={() => setIsEditingTitle(true)}>{section.title}</span>
        )
      }
      icon={icon}
      isExpanded={isSectionExpanded}
      onToggle={() => setIsSectionExpanded(!isSectionExpanded)}
      onAdd={handleAddClick}
      rightAction={
        <button
          className={styles.deleteSectionBtn}
          title="Delete Section"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Are you sure you want to delete the "${section.title}" section? This will remove all items inside it.`)) {
              dispatch(removeCustomSection(section.id));
            }
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      }
    >
      {viewMode === 'list' ? (
        <div className={styles.container}>
          {section.items.map((item) => (
            <div key={item.id} className={styles.jobItem}>
              <div className={styles.jobHeader}>
                <div
                  className={`${styles.checkbox} ${item.isVisible ? styles.checkboxSelected : ''}`}
                  onClick={() => dispatch(updateCustomSectionItem({
                    sectionId: section.id,
                    itemId: item.id,
                    updates: { isVisible: !item.isVisible }
                  }))}
                >
                  {item.isVisible && (
                    <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className={styles.jobInfo} onClick={() => handleEditClick(item)}>
                  <div className={styles.companyName}>{item.title || 'No Title'}</div>
                  <div className={styles.jobRole}>{item.subtitle}</div>
                  <div className={styles.jobDates}>{item.date}</div>
                  {item.description && (
                    <div className={styles.itemDescription} style={{ marginTop: '4px', fontSize: '13px', color: '#636e72', whiteSpace: 'pre-wrap' }}>
                      {item.description}
                    </div>
                  )}
                </div>
                <button
                  className={styles.deleteBtn}
                  title="Delete Item"
                  onClick={(e) => { e.stopPropagation(); dispatch(removeCustomSectionItem({ sectionId: section.id, itemId: item.id })); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>

              {/* Bullets Section */}
              <div className={styles.bulletList}>
                {item.bullets?.map((bullet, bIndex) => (
                  <div key={bIndex} className={styles.bulletItem}>
                    <div
                      className={`${styles.checkbox} ${bullet.isVisible ? styles.checkboxSelected : ''}`}
                      onClick={() => dispatch(updateCustomSectionBullet({
                        sectionId: section.id,
                        itemId: item.id,
                        bulletIndex: bIndex,
                        updates: { isVisible: !bullet.isVisible }
                      }))}
                    >
                      {bullet.isVisible && (
                        <svg className={styles.checkIcon} width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className={styles.bulletText}>
                      <Input
                        variant="minimal"
                        value={bullet.text}
                        onChange={(e) => dispatch(updateCustomSectionBullet({
                          sectionId: section.id,
                          itemId: item.id,
                          bulletIndex: bIndex,
                          updates: { text: e.target.value }
                        }))}
                        placeholder="Add details..."
                      />
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => dispatch(removeCustomSectionBullet({ sectionId: section.id, itemId: item.id, bulletIndex: bIndex }))}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
                <button className={styles.addBulletBtn} onClick={() => dispatch(addCustomSectionBullet({ sectionId: section.id, itemId: item.id }))}>
                  <span>+</span> Add Bullet
                </button>
              </div>
            </div>
          ))}
          {section.items.length === 0 && (
            <p className={styles.emptyText}>No items added. Click + to add one.</p>
          )}
        </div>
      ) : (
        <div className={styles.editForm}>
          <div className={styles.formBox}>
            <div className={styles.formGrid}>
              <Input
                label="Item Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Certification Name"
              />
              <Input
                label="Subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Issuing Organization"
              />
            </div>

            <div className={styles.formGrid}>
              <Input
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="Month YYYY"
              />
            </div>

            <div className={styles.formRow} style={{ marginTop: '1rem' }}>
              <TextArea
                label="Description (Plain Text)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add plain text content here..."
                rows={4}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => setViewMode('list')}>Cancel</button>
            <button className={styles.saveBtn} onClick={() => {
              if (viewMode === 'add') {
                dispatch(addCustomSectionItem({ sectionId: section.id, initialData: formData }));
              } else {
                dispatch(updateCustomSectionItem({ sectionId: section.id, itemId: editingItemId, updates: formData }));
              }
              setViewMode('list');
              setEditingItemId(null);
            }}>Save</button>
          </div>
        </div>
      )}
    </SectionCard>
  );
};

export default CustomSectionCard;
