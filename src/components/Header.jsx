import React from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './Header.module.scss';
import logo from '../assets/img/logo.png';
import logoutIcon from '../assets/img/logout.png';

const Header = ({ user, setUser }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                <img src={logo} alt="Logo" />
            </Link>
            <nav className={styles.navigation}>
                {user ? (
                    <>
                        <span className={styles.username}>You are logged in as {user.email}     </span>
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            <img src={logoutIcon} alt="Logout" />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className={styles.loginButton}>
                        <span>Login</span>
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
