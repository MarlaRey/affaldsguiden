import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import styles from './PageLayout.module.scss';

const PageLayout = ({ children }) => {
    return (
        <div className={styles.pageLayout}>
            <Header />
            <Navigation />
            <div className={styles.bgFade}>
            <main className={styles.main}>
                {children} {/* Indholdet skifter her alt efter hvilken side du er på */}
            </main>
            </div>
            <Footer />
        </div>
    );
};

export default PageLayout;
