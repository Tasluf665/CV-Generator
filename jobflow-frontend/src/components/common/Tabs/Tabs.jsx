import React from 'react';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`${styles.tabsContainer} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
          {tab.badge && <span className={styles.badge}>{tab.badge}</span>}
          {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
