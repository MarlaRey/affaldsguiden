import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './RecyclingStations.module.scss';

const RecyclingStations = () => {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStations = async () => {
            const { data, error } = await supabase.from('recycling_sites').select('*');
            if (error) {
                console.error('Error fetching stations:', error);
            } else {
                setStations(data);
            }
        };

        fetchStations();
    }, []);

    const handleStationClick = (stationId) => {
        navigate(`/recycling-stations/${stationId}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Genbrugsstationer</h1>
            <div className={styles.grid}>
                {stations.map((station) => (
                    <div 
                        key={station.id} 
                        className={styles.stationBox} 
                        onClick={() => handleStationClick(station.id)}
                    >
                        <div className={styles.details}>
                            <h2 className={styles.name}>{station.name}</h2>
                            <p className={styles.address}>{station.address}, {station.zipcode} {station.city}</p>
                            <p className={styles.stars}>⭐ {station.num_stars}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecyclingStations;
