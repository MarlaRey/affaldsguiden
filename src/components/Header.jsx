import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';

// Importer billederne
import logo from '../assets/img/logo.png';
import loginIcon from '../assets/img/IconLogin.png';
import Navigation from './Navigation';

const Header = ({ user }) => {
    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                <img src={logo} alt="Logo" />
            </Link>
            <Link to="/login" className={styles.loginButton}>
                <span>Login </span>
                <img src={loginIcon} alt="Login Icon" className={styles.loginIcon} />
            </Link>

        </header>
    );
};

export default Header;
