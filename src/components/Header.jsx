import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.scss';


const Header = ({ user }) => {
    return (
        <header>
            <div className="logo">
                <Link to="/">Affaldsguiden</Link>
            </div>
            <nav>
                <Link to="/">Forside</Link>
                <Link to="/sorting-guide">Sorteringsguide</Link>
                <Link to="/recycling-stations">Genbrugsstationer</Link>
                <Link to="/order-container">Bestil Beholder</Link>
            </nav>
            <div className="auth">
                {user ? (
                    <>
                        <span>{user.name}</span>
                        <button>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </header>
    );
};

export default Header;
