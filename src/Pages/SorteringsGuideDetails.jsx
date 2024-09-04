import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Husk at importere useLocation
import supabase from '../../supabase';
import styles from './SorteringsGuideDetails.module.scss';
import drop from '../assets/img/Icon FoldNed.png';

const SorteringsGuideDetails = () => {
    const { sectionId } = useParams();
    const location = useLocation(); // Bruger useLocation til at hente state
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [typeMap, setTypeMap] = useState({});
    const [openDropdown, setOpenDropdown] = useState(null);

    // Hent sectionTitle fra location.state
    const sectionTitle = location.state?.sectionTitle || 'Default Title';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('trash_categories')
                    .select('*')
                    .eq('section_id', sectionId);

                if (error) throw error;
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchTypes = async () => {
            try {
                const { data, error } = await supabase
                    .from('trash_types')
                    .select('*');

                if (error) throw error;
                setTypes(data);
                // Create a map of types for quick lookup
                const typeMapping = data.reduce((acc, type) => {
                    acc[type.id] = type;
                    return acc;
                }, {});
                setTypeMap(typeMapping);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        fetchCategories();
        fetchTypes();
    }, [sectionId]);

    const handleDropdownToggle = async (categoryId) => {
        if (openDropdown === categoryId) {
            setOpenDropdown(null);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('trash_category_type_rel')
                .select('type_id, is_allowed')
                .eq('category_id', categoryId);

            if (error) throw error;

            // Ensure types is an array and create allowed/notAllowed arrays
            const allowedTypes = [];
            const notAllowedTypes = [];
            
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

            // Update state with filtered types
            setTypes(prev => ({ ...prev, [categoryId]: { allowed: allowedTypes, notAllowed: notAllowedTypes } }));

            setOpenDropdown(categoryId);
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{sectionTitle}</h1>
            <h2 className={styles.subtitle}>Vælg en kategori</h2>
            <div className={styles.categoryList}>
                {categories.map(category => (
                    <div 
                        key={category.id} 
                        className={`${styles.categoryBox} ${openDropdown === category.id ? styles.expanded : ''}`}
                    >
                        <div className={styles.topSection}>
                            <div className={styles.iconContainer}>
                                <img src={category.icon_url} alt={category.title} className={styles.icon} />
                            </div>
                            <div className={styles.titleContainer}>
                                <h3 className={styles.categoryTitle}>{category.title}</h3>
                            </div>
                            <div className={styles.imageContainer}>
                                <img src={category.image_url} alt={category.title} className={styles.categoryImage} />
                            </div>
                            <div 
                                className={styles.dropdownToggle} 
                                onClick={() => handleDropdownToggle(category.id)}
                            >
                                <img src={drop} alt="Dropdown" />
                            </div>
                        </div>
                        {openDropdown === category.id && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.dropdownSection}>
                                    <h4>Ja tak</h4>
                                    <ul>
                                        {types[category.id]?.allowed.map(type => (
                                            <li key={type.id}>{type.title}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className={styles.dropdownSection}>
                                    <h4>Nej tak</h4>
                                    <ul>
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
