import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import supabase from '../../supabase'; 
// Importerer supabase-instansen til datahentning fra databasen.

import styles from './SorteringsGuide.module.scss'; 


const SorteringsGuide = () => {
    const [sections, setSections] = useState([]); 
    // useState hook, der gemmer sektioner hentet fra databasen.

    const navigate = useNavigate(); 
    // useNavigate hook initialiseres for at navigere til andre sider programmatisk.

    useEffect(() => {
        // useEffect hook, der henter data fra Supabase ved komponentens første render.

        const fetchSections = async () => {
            try {
                // Asynkron funktion til at hente sektioner fra 'trash_sections'-tabellen i databasen.
                const { data, error } = await supabase
                    .from('trash_sections') // Vælger tabellen 'trash_sections'.
                    .select('*'); // Henter alle kolonner.

                if (error) throw error; // viser en fejl, hvis datahentning mislykkes.
                setSections(data); // Sætter den hentede data som tilstanden sections.
            } catch (error) {
                console.error('Error fetching sections:', error); 
                // Logger en fejl, hvis der opstår en.
            }
        };

        fetchSections(); // Kalder datahentningsfunktionen, når komponenten mountes.
    }, []); 
    // Tomt dependency array, så effekten kun kører én gang ved første render.

    const handleSectionClick = (section) => {
        // Funktion, der håndterer klik på en sektion og navigerer til SorteringsGuideDetails

        navigate(`/sorting-guide/${section.id}`, { 
            // Navigerer med sektionens id som parameter.
            state: { sectionTitle: section.title } 
            // Sender sektionens titel med som state til den nye side.
        });
    };
    
    return (
        <div className={styles.container}>
            
            <h1 className={styles.title}>Sorteringsguide</h1>
            <h2 className={styles.subtitle}>Vælg en sektion</h2>
            
            <div className={styles.grid}>
                {/* Mapper over sections-arrayet og genererer en boks for hver sektion */}
                {sections.map(section => (
                    <div 
                        key={section.id} 
                        className={styles.sectionBox} 
                        // Sætter baggrundsfarven dynamisk baseret på sektionens data (section.color).
                        style={{ backgroundColor: section.color }}
                        onClick={() => handleSectionClick(section)}  
                        // Event handler, der kalder handleSectionClick, når en sektion klikkes på.
                    >
                        <div className={styles.textContainer}>
                            {/* Viser sektionens titel */}
                            <h3 className={styles.sectionTitle}>{section.title}</h3>
                        </div>
                        <div className={styles.imageContainer}>
                            {/* Viser sektionens billede */}
                            <img 
                                src={section.image_url} 
                                alt={section.title} 
                                className={styles.sectionImage} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SorteringsGuide;
