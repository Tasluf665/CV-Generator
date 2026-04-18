import React from 'react';

const DashboardPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="lead">Welcome back! Here's an overview of your CV tailoring activity.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total CVs</p>
          <p className="stat-value">12</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Tailored Today</p>
          <p className="stat-value">3</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Job Matches</p>
          <p className="stat-value">24</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
