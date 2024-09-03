import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.scss';

const menuItems = [
    { name: 'Forside', path: '/' },
    { name: 'Sorteringsguide', path: '/sorting-guide' },
    { name: 'Genbrugsstationer', path: '/recycling-stations' },

    { name: 'Bestil Beholder', path: '/order-container' },
];

const Navigation = () => {
    const location = useLocation();
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles.nul}>
            <div className={styles.border} />
            <nav className={`${styles.navigation} ${isMenuOpen ? styles.active : ''}`}>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path} className={location.pathname === item.path ? styles.active : ''}>
                            <Link to={item.path}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <button
                className={`${styles.burgerMenu} ${isMenuOpen ? styles.open : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <span className={styles.burgerBar}></span>
                <span className={styles.burgerBar}></span>
                <span className={styles.burgerBar}></span>
            </button>
        </div>
    );
};

export default Navigation;
