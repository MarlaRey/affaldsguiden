// src/Pages/SorteringsGuide.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate
import supabase from '../../supabase';
import styles from './SorteringsGuide.module.scss';

const SorteringsGuide = () => {
    const [sections, setSections] = useState([]);
    const navigate = useNavigate(); // Initialiser useNavigate

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const { data, error } = await supabase
                    .from('trash_sections')
                    .select('*');
                
                if (error) throw error;
                setSections(data);
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        fetchSections();
    }, []);

    const handleSectionClick = (section) => {
        navigate(`/sorting-guide/${section.id}`, { 
            state: { sectionTitle: section.title }
        });
    };
    

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sorteringsguide</h1>
            <h2 className={styles.subtitle}>Vælg en sektion</h2>
            <div className={styles.grid}>
            {sections.map(section => (
    <div 
        key={section.id} 
        className={styles.sectionBox} 
        style={{ backgroundColor: section.color }}
        onClick={() => handleSectionClick(section)}  // Send hele sektionen
    >
        <div className={styles.textContainer}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
        </div>
        <div className={styles.imageContainer}>
            <img src={section.image_url} alt={section.title} className={styles.sectionImage} />
        </div>
    </div>
))}

            </div>
        </div>
    );
};

export default SorteringsGuide;
