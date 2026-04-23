import React from 'react';
import styles from './Pagination.module.css';
import Button from '../../common/Button/Button';

const Pagination = ({ currentPage, totalEntries, entriesPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const start = totalEntries === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const end = Math.min(currentPage * entriesPerPage, totalEntries);

  if (totalPages <= 1 && totalEntries !== 0) return null;

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Showing {start} to {end} of {totalEntries} entries
      </div>
      <div className={styles.controls}>
        <Button 
          variant="secondary" 
          size="sm" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div className={styles.pages}>
          {[...Array(totalPages)].map((_, i) => (
            <Button 
              key={i + 1}
              variant={currentPage === i + 1 ? "primary" : "secondary"} 
              size="sm" 
              className={styles.pageBtn}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
