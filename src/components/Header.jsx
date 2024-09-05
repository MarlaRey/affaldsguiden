import React from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './Header.module.scss';
import logo from '../assets/img/logo.png';
import logoutIcon from '../assets/img/logout.png';

const Header = ({ user, setUser }) => {
    // Funktion til at håndtere brugerlogout
    const handleLogout = async () => {
        await supabase.auth.signOut(); // Logger brugeren ud fra Supabase
        setUser(null); // Nulstiller bruger-tilstanden til null (ingen bruger er logget ind)
    };

    return (
        <header className={styles.header}>
            <Link to="/" className={styles.logo}>
                <img src={logo} alt="Logo" /> {/* Viser logoet med et alternativt tekst, hvis billedet ikke kan indlæses */}
            </Link>
            <nav className={styles.navigation}>
                {user ? ( // Hvis der er en bruger logget ind
                    <>
                        <span className={styles.username}>You are logged in as {user.email} </span> {/* Viser brugerens email */}
                        <button onClick={handleLogout} className={styles.logoutButton}>
                            <img src={logoutIcon} alt="Logout" /> {/* Viser logout-ikonet */}
                        </button>
                    </>
                ) : ( // Hvis ingen bruger er logget ind
                    <Link to="/login" className={styles.loginButton}>
                        <span>Login</span> {/* Viser en login-knap */}
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
