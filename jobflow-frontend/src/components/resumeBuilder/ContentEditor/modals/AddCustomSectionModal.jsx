import React, { useState } from 'react';
import Input from '../../../common/Input/Input';
import styles from './AddCustomSectionModal.module.css';

const AddCustomSectionModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Add Custom Section</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <p className={styles.hint}>Enter a title for your new section (e.g., Certifications, Languages, Volunteering).</p>
            <Input
              label="Section Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Certifications"
              autoFocus
            />
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.addBtn} disabled={!title.trim()}>
              Add Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomSectionModal;
