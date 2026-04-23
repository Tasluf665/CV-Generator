import React from 'react';
import styles from './AuthFooter.module.css';

const AuthFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.copyright}>
          © {currentYear} JobFlow Inc. All rights reserved.
        </div>
        <div className={styles.links}>
          <a href="#" className={styles.link}>Privacy Policy</a>
          <a href="#" className={styles.link}>Terms of Service</a>
          <a href="#" className={styles.link}>Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;
