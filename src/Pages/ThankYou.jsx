// ThankYou.jsx
import React from 'react';
import styles from './ThankYou.module.scss';

const ThankYou = () => {
    return (
        <div className={styles.container}>
            <h1>Tak for din bestilling!</h1>
            <p>Din ordre er modtaget og vil blive behandlet snarest muligt.</p>
        </div>
    );
};

export default ThankYou;
