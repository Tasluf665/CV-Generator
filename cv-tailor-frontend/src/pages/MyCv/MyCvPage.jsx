import React from 'react';

const MyCvPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My CVs</h1>
        <p className="lead">Manage and edit your CV versions.</p>
      </div>
      <div className="empty-state-card">
        <p>No CVs found. Create your first CV to get started!</p>
      </div>
    </div>
  );
};

export default MyCvPage;
