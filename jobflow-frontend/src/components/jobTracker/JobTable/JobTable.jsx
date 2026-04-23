import React from 'react';
import styles from './JobTable.module.css';
import Badge from '../../common/Badge/Badge';

const JobTable = ({ jobs }) => {
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
            <th>DATE SAVED</th>
            <th>DEADLINE</th>
            <th>EXCITEMENT</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td className={styles.checkboxCell}>
                <input type="checkbox" />
              </td>
              <td className={styles.positionCell}>
                <div className={styles.positionName}>{job.jobTitle}</div>
              </td>
              <td className={styles.companyCell}>
                <div className={styles.companyInfo}>
                  <div className={styles.companyLogo}>
                    {job.company.charAt(0)}
                  </div>
                  <span>{job.company}</span>
                </div>
              </td>
              <td className={styles.locationCell}>{job.location || '—'}</td>
              <td className={styles.statusCell}>
                <Badge status={job.status.toLowerCase()}>{job.status}</Badge>
              </td>
              <td className={styles.dateCell}>{new Date(job.dateSaved).toLocaleDateString()}</td>
              <td className={styles.dateCell}>{job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</td>
              <td className={styles.excitementCell}>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`${styles.star} ${i < (job.excitement || 0) ? styles.filled : ''}`}
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
