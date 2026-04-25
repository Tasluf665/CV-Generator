import React, { useState } from 'react';
import styles from './JobTable.module.css';
import Badge from '../../common/Badge/Badge';

const STATUS_OPTIONS = ['Bookmarked', 'Applied', 'Interviewing', 'Accepted', 'Ghosted', 'Closed'];

const SORTABLE_FIELDS = {
  dateSaved: 'DATE SAVED',
  deadline: 'DEADLINE',
  excitement: 'EXCITEMENT',
};

const JobTable = ({ jobs, onRowClick, onUpdateJob, sortConfig, onSort }) => {
  const [editingCell, setEditingCell] = useState(null); // { id, field }
  const [tempValue, setTempValue] = useState('');

  const handleCellClick = (e, id, field, initialValue) => {
    e.stopPropagation();
    setEditingCell({ id, field });
    setTempValue(initialValue || '');
  };

  const handleUpdate = (id, field, value) => {
    if (onUpdateJob) {
      onUpdateJob(id, { [field]: value });
    }
    setEditingCell(null);
  };

  const renderEditableCell = (job, field, content) => {
    const isEditing = editingCell?.id === job._id && editingCell?.field === field;

    const formatDate = (dateStr) => {
      if (!dateStr) return '—';
      try {
        // Use the ISO string date part to avoid timezone shifts
        const isoDate = new Date(dateStr).toISOString().split('T')[0];
        const [year, month, day] = isoDate.split('-');
        return `${month}/${day}/${year}`;
      } catch (e) {
        return '—';
      }
    };

    const displayContent = (field === 'dateSaved' || field === 'deadline')
      ? formatDate(job[field])
      : content;

    const initialValue = (field === 'dateSaved' || field === 'deadline') && job[field]
      ? new Date(job[field]).toISOString().split('T')[0]
      : job[field];

    if (isEditing) {
      if (field === 'status') {
        return (
          <select
            className={styles.editSelect}
            value={tempValue}
            autoFocus
            onChange={(e) => {
              const newValue = e.target.value;
              setTempValue(newValue);
              handleUpdate(job._id, 'status', newValue);
            }}
            onBlur={() => setEditingCell(null)}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }

      return (
        <input
          type={(field === 'dateSaved' || field === 'deadline') ? 'date' : 'text'}
          className={styles.editInput}
          value={tempValue}
          autoFocus
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => {
            // For dates, only update if we have a value and it's different from the initial date part
            if ((field === 'dateSaved' || field === 'deadline')) {
              if (tempValue && tempValue !== initialValue) {
                handleUpdate(job._id, field, tempValue);
              } else {
                setEditingCell(null);
              }
            } else {
              if (tempValue !== initialValue) {
                handleUpdate(job._id, field, tempValue);
              } else {
                setEditingCell(null);
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if ((field === 'dateSaved' || field === 'deadline') && !tempValue) {
                setEditingCell(null);
              } else {
                handleUpdate(job._id, field, tempValue);
              }
            }
            if (e.key === 'Escape') setEditingCell(null);
          }}
        />
      );
    }

    return (
      <div
        className={styles.editableValue}
        onClick={(e) => handleCellClick(e, job._id, field, initialValue)}
      >
        {displayContent}
      </div>
    );
  };

  const renderSortIndicator = (field) => {
    if (sortConfig?.key !== field) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCell}>
              <input type="checkbox" />
            </th>
            <th>JOB POSITION</th>
            <th>COMPANY</th>
            <th>LOCATION</th>
            <th>STATUS</th>
            {Object.entries(SORTABLE_FIELDS).map(([field, label]) => (
              <th key={field}>
                <button
                  type="button"
                  className={`${styles.sortHeaderButton} ${sortConfig?.key === field ? styles.activeSortHeader : ''}`}
                  onClick={() => onSort && onSort(field)}
                  aria-label={`Sort by ${label}`}
                  aria-sort={sortConfig?.key === field ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <span>{label}</span>
                  <span className={styles.sortIndicator}>{renderSortIndicator(field)}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td className={styles.checkboxCell}>
                <input type="checkbox" />
              </td>
              <td
                className={`${styles.positionCell} ${styles.navCell}`}
                onClick={() => onRowClick && onRowClick(job._id)}
              >
                <div className={styles.positionName}>{job.jobTitle}</div>
              </td>
              <td
                className={`${styles.companyCell} ${styles.navCell}`}
                onClick={() => onRowClick && onRowClick(job._id)}
              >
                <div className={styles.companyInfo}>
                  <span>{job.company}</span>
                </div>
              </td>
              <td className={styles.locationCell}>
                {renderEditableCell(job, 'location', job.location || '—')}
              </td>
              <td className={styles.statusCell}>
                {renderEditableCell(job, 'status', (
                  <Badge status={job.status.toLowerCase()}>{job.status}</Badge>
                ))}
              </td>
              <td className={styles.dateCell}>
                {renderEditableCell(job, 'dateSaved', null)}
              </td>
              <td className={styles.dateCell}>
                {renderEditableCell(job, 'deadline', null)}
              </td>
              <td className={styles.excitementCell}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`${styles.star} ${i < (job.excitement || 0) ? styles.filled : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdate(job._id, 'excitement', i + 1);
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;

