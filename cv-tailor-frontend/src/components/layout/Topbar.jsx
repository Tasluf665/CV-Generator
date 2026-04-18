import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import './Topbar.css';

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search for jobs or CVs..." />
      </div>
      
      <div className="topbar-actions">
        <button className="icon-btn">
          <HelpCircle size={20} />
        </button>
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge-dot"></span>
        </button>
        <button className="upgrade-btn">Upgrade to Pro</button>
      </div>
    </header>
  );
};

export default Topbar;
