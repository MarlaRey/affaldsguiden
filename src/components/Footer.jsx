import React from 'react';
import styles from './Footer.module.scss';

const Footer = () => {
    return (
        <footer>
            <div className="footer-logo">Affaldsguiden</div>
            <div className="footer-content">
                <address>Region Nordjylland, Danmark</address>
                <div className="footer-links">
                    <a href="#">App Store</a>
                    <a href="#">Google Play</a>
                    <a href="#">Facebook</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
