import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';
import styles from './PageLayout.module.scss';

const PageLayout = ({ children, user, setUser }) => {
    return (
        <div className={styles.pageLayout}>
            <Header user={user} setUser={setUser} />
            <Navigation />
            <div className={styles.bgFade}>
                <main className={styles.main}>
                    {children} {/* Indholdet skifter her alt efter hvilken side du er på */}
                </main>
            </div>
            <Footer className={styles.footer} />
        </div>
    );
};

export default PageLayout;
