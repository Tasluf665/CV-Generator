import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../common/Logo/Logo';
import styles from './AuthNavbar.module.css';

const AuthNavbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <Logo size={28} />
        </Link>
        <Link to="/register" className={styles.signUpLink}>
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar;
