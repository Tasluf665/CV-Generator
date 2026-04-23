import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes/routePaths';
import Button from '../../components/common/Button/Button';

const NotFound = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '64px', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to={ROUTE_PATHS.HOME}>
        <Button variant="primary">Go Back Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
