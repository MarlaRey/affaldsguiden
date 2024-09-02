import React from 'react';
import styles from './Footer.module.scss';

// Importer billederne
import footerBg from '../assets/img/Footer Bg.png';
import appStore from '../assets/img/App Store.png';
import googlePlay from '../assets/img/Google Play.png';
import socialMedias from '../assets/img/Social Medias.png';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.column1}>
                    <h2>Affaldsguiden</h2>
                    <p>Øster Uttrupvej 1</p>
                    <p>9000 Aalborg</p>
                </div>
                <div className={styles.column2}>
                    <img src={appStore} alt="App Store" className={styles.storeImg} />
                    <img src={googlePlay} alt="Google Play" className={styles.storeImg} />
                </div>
                <div className={styles.column3}>
                    <img src={socialMedias} alt="Social Media" className={styles.socialImg} />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
