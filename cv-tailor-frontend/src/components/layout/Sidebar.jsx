import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Wand2, 
  Mail, 
  Settings 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/my-cv', label: 'My CV', icon: FileText },
    { path: '/jobs', label: 'My Jobs', icon: Briefcase },
    { path: '/tailor', label: 'Tailor CV', icon: Wand2 },
    { path: '/cover-letter', label: 'Cover Letter', icon: Mail },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"><Wand2 size={24} color="white" /></div>
        <span className="logo-text">CV Tailor</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">JD</div>
          <div className="user-info">
            <p className="user-name">John Doe</p>
            <p className="user-plan">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
