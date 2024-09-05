import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.scss';

// Liste over menu-elementer og deres ruter
const menuItems = [
    { name: 'Forside', path: '/' },
    { name: 'Sorteringsguide', path: '/sorting-guide' },
    { name: 'Genbrugsstationer', path: '/recycling-stations' },
    { name: 'Bestil Beholder', path: '/order-container' },
];

const Navigation = () => {
    const location = useLocation(); // Hook til at få den aktuelle rute (URL) fra routeren
    const [isMenuOpen, setMenuOpen] = useState(false); // Tilstand for menuens åbne/lukket status

    // Funktion til at skifte menuens tilstand
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    // Luk menuen, når ruten ændres
    useEffect(() => {
        setMenuOpen(false); // Lukker menuen, hvis ruten ændres
    }, [location.pathname]); // Kører kun når `location.pathname` ændrer sig

    // Funktion til at kontrollere om et menu-element skal være aktivt
    const isActive = (path) => {
        // Tjek om den nuværende rute matcher menu-elementets rute præcist eller er en under-rute
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <div className={styles.nul}>
            <div className={styles.border} /> {/* Visuel dekorativ kant */}
            <nav className={`${styles.navigation} ${isMenuOpen ? styles.active : ''}`}>
                <ul>
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            className={isActive(item.path) ? styles.active : ''} // Fremhæver det aktive menuelement baseret på den aktuelle rute
                        >
                            <Link to={item.path} onClick={() => setMenuOpen(false)}>
                                {item.name} {/* Viser menu-elementets navn */}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <button
                className={`${styles.burgerMenu} ${isMenuOpen ? styles.open : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu" // Forbedrer tilgængeligheden ved at give en beskrivelse af knappen
            >
                <span className={styles.burgerBar}></span> {/* Burger-menu ikonets første streg */}
                <span className={styles.burgerBar}></span> {/* Burger-menu ikonets anden streg */}
                <span className={styles.burgerBar}></span> {/* Burger-menu ikonets tredje streg */}
            </button>
        </div>
    );
};

export default Navigation;
