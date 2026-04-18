import React from 'react';

const MyJobsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Jobs</h1>
        <p className="lead">Keep track of jobs you're applying to.</p>
      </div>
      <div className="empty-state-card">
        <p>No jobs tracked yet. Add a job description to start tailoring!</p>
      </div>
    </div>
  );
};

export default MyJobsPage;
