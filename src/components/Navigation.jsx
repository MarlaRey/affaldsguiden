import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.scss';

// Links for the menu
const menuItems = [
    { name: 'Forside', path: '/' },
    { name: 'Sorteringsguide', path: '/sorting-guide' },
    { name: 'Genbrugsstationer', path: '/recycling-stations' },
    { name: 'Artikler', path: '/articles' },
    { name: 'Bestil Beholder', path: '/order-container' },
];

const Navigation = () => {
    const location = useLocation(); // Hook to get the current path

    return (
    <div className={styles.nul}>
        <div className={styles.border}/>
        <nav className={styles.navigation}>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.path} className={location.pathname === item.path ? styles.active : ''}>
                        <Link to={item.path}>{item.name}</Link>
                    </li>
                ))}
            </ul>
        </nav>
       </div>
    );
};

export default Navigation;
