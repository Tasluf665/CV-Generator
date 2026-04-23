import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import styles from './AppShell.module.css';

const AppShell = ({ children }) => {
  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <Topbar />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
