import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateJob } from '../../../../features/jobTracker/jobSlice';
import Button from '../../../common/Button/Button';
import styles from './NotesTab.module.css';

const NotesTab = ({ job }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  useEffect(() => {
    setNotesContent(job?.notes || '');
  }, [job?.notes]);

  const handleSave = () => {
    dispatch(updateJob({ id: job._id || job.id, jobData: { notes: notesContent } }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotesContent(job?.notes || '');
    setIsEditing(false);
  };

  if (!job) return null;

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.editArea}>
          <textarea
            className={styles.textarea}
            value={notesContent}
            onChange={(e) => setNotesContent(e.target.value)}
            placeholder="Write your notes here... (e.g. Interview tips, company culture, follow-up strategies)"
            autoFocus
          />
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSave}>Save Notes</Button>
          </div>
        </div>
      ) : (
        <div 
          className={styles.displayArea} 
          onClick={() => setIsEditing(true)}
        >
          {notesContent ? (
            <div className={styles.notesText}>{notesContent}</div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>📓</div>
              <h3>Add Notes</h3>
              <p>Click here to add notes about company culture, interview tips, or follow-up strategies.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesTab;
