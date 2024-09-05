import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Importerer hooks til at få adgang til URL-parametre og lokal tilstand
import supabase from '../../supabase'; // Importerer supabase-instansen til databaseinteraktion
import styles from './SorteringsGuideDetails.module.scss'; // Importerer SCSS-styles
import drop from '../assets/img/Icon FoldNed.png'; // Importerer dropdown-ikon

const SorteringsGuideDetails = () => {
    // Henter sektion ID fra URL-parametre
    const { sectionId } = useParams();
    // Bruger useLocation til at hente enhver tilstand sendt fra navigationen
    const location = useLocation();
    // State hooks til at gemme data
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [typeMap, setTypeMap] = useState({});
    const [openDropdown, setOpenDropdown] = useState(null);

    // Henter sektionstitel fra navigationens tilstand (default til 'Default Title' hvis ikke tilgængelig)
    const sectionTitle = location.state?.sectionTitle || 'Default Title';

    useEffect(() => {
        // Asynkron funktion til at hente kategorier fra database
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('trash_categories')
                    .select('*')
                    .eq('section_id', sectionId); // Filtrerer efter section_id  (eq. = eguals = lig med)

                if (error) throw error; // viser en fejl, hvis datahentningen fejler
                setCategories(data); // Opdaterer state med hentede data
            } catch (error) {
                console.error('Error fetching categories:', error); // Logger fejl
            }
        };

        // Asynkron funktion til at hente affaldstyper fra database
        const fetchTypes = async () => {
            try {
                const { data, error } = await supabase
                    .from('trash_types')
                    .select('*'); // Henter alle typer

                if (error) throw error; // viser en fejl, hvis datahentningen fejler
                setTypes(data); // Opdaterer state med hentede data
                // Opretter et type-map for hurtigere opslag. 
                //typeMapping et objekt, og i dette tilfælde bliver hver type fra databasen gemt med sin id som nøgle. Dette gør det lettere og hurtigere at finde en type baseret på dens ID.
                const typeMapping = data.reduce((acc, type) => {
                    acc[type.id] = type;
                    return acc;
                }, {});
                setTypeMap(typeMapping); // Opdaterer state med type-map
            } catch (error) {
                console.error('Error fetching types:', error); // Logger fejl
            }
        };

        fetchCategories(); // Henter kategorier ved komponentens mount
        fetchTypes(); // Henter typer ved komponentens mount
    }, [sectionId]); // Beder om at køre effekten igen, hvis sectionId ændres i dette dependency array

    // Håndterer klik på dropdown-toggle
    const handleDropdownToggle = async (categoryId) => {
        // Kontrollerer om dropdown-menuen for den aktuelle kategori allerede er åben
        if (openDropdown === categoryId) {
            // Lukker dropdown-menuen, hvis den allerede er åben
            setOpenDropdown(null);
            return; // Afslutter funktionen, da der ikke er behov for at hente data
        }

        // Hvis dropdown-menuen ikke er åben for den valgte kategori
        try {
            // Henter forholdet mellem kategorier og affaldstyper fra databasen
            const { data, error } = await supabase
                .from('trash_category_type_rel')
                .select('type_id, is_allowed')
                .eq('category_id', categoryId);

            if (error) throw error; // viser en fejl, hvis datahentning fejler

            // Opretter to arrays for tilladte og ikke-tilladte affaldstyper
            const allowedTypes = [];
            const notAllowedTypes = [];

            // Gennemgår de hentede data og opdeler dem i tilladte og ikke-tilladte typer
            data.forEach(rel => {
                const type = typeMap[rel.type_id];
                if (type) {
                    if (rel.is_allowed) {
                        allowedTypes.push(type);
                    } else {
                        notAllowedTypes.push(type);
                    }
                }
            });

            // Opdaterer state med de filtrerede typer for den valgte kategori
            setTypes(prev => ({ ...prev, [categoryId]: { allowed: allowedTypes, notAllowed: notAllowedTypes } }));

            // Åbner dropdown-menuen for den valgte kategori
            setOpenDropdown(categoryId);
        } catch (error) {
            console.error('Error fetching types:', error); // Logger fejl, hvis der opstår en
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{sectionTitle}</h1>
            <h2 className={styles.subtitle}>Vælg en kategori</h2>
            <div className={styles.categoryList}>
                {/* Mapper over alle kategorier og viser hver enkelt som en boks  
                "expanded" er en betinget Klasse:
                 ${openDropdown === category.id ? styles.expanded : ''}: Denne del er et betinget udtryk.
                openDropdown === category.id: Tjekker om openDropdown er lig med den aktuelle kategori's ID (category.id).
                ? styles.expanded : '': Hvis betingelsen er sand (dvs. dropdown-menuen for den aktuelle kategori er åben), 
                tilføjes klassen styles.expanded. Hvis betingelsen er falsk, tilføjes en tom streng (dvs. ingen yderligere klasse).*/}

                {categories.map(category => (
                    <div
                        key={category.id}
                        className={`${styles.categoryBox} ${openDropdown === category.id ? styles.expanded : ''}`}
                    >
                        {/* Sektion for ikon, titel og billede */}
                        <div className={styles.topSection}>
                            {/* Container til kategoriikon */}
                            <div className={styles.iconContainer}>
                                <img src={category.icon_url} alt={category.title} className={styles.icon} />
                            </div>

                            {/* Container til kategoriens titel */}
                            <div className={styles.titleContainer}>
                                <h3 className={styles.categoryTitle}>{category.title}</h3>
                            </div>

                            {/* Container til kategoriens billede */}
                            <div className={styles.imageContainer}>
                                <img src={category.image_url} alt={category.title} className={styles.categoryImage} />
                            </div>

                            {/* Dropdown-toggle, som åbner eller lukker dropdown-menuen */}
                            <div
                                className={styles.dropdownToggle}
                                onClick={() => handleDropdownToggle(category.id)}
                            >
                                <img src={drop} alt="Dropdown" />
                            </div>
                        </div>

                        {/* Viser dropdown-menu, hvis betingelsen er sand */}
                        {openDropdown === category.id && (
                            <div className={styles.dropdownMenu}>
                                {/* Sektion for tilladte affaldstyper */}
                                <div className={styles.dropdownSection}>
                                    <h4>Ja tak</h4>
                                    <ul>
                                        {/* Mapper over tilladte affaldstyper og viser dem som listepunkter */}
                                        {types[category.id]?.allowed.map(type => (
                                            <li key={type.id}>{type.title}</li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Sektion for ikke-tilladte affaldstyper */}
                                <div className={styles.dropdownSection}>
                                    <h4>Nej tak</h4>
                                    <ul>
                                        {/* Mapper over ikke-tilladte affaldstyper og viser dem som listepunkter */}
                                        {types[category.id]?.notAllowed.map(type => (
                                            <li key={type.id}>{type.title}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default SorteringsGuideDetails;
