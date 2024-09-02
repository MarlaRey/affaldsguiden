import React, { useState, useEffect } from 'react';

import styles from './SorteringsGuide.module.scss';
import supabase from '../../supabase';

const SortingGuide = () => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const data = await supabase();
            setSections(data);
        };
        getData();
    }, []);

    return (
        <div className="sorting-guide">
            <h1>Sorteringsguide</h1>
            <div className="sections">
                {sections.map(section => (
                    <div key={section.id} className="section-box" style={{ backgroundColor: section.color }}>
                        <h2>{section.name}</h2>
                        <img src={section.image_url} alt={section.name} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SortingGuide;
