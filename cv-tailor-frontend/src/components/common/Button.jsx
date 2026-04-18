import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false, 
  icon: Icon,
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'is-loading' : ''}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="spinner"></span>
      ) : (
        <>
          {Icon && <Icon size={18} className="btn-icon" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
