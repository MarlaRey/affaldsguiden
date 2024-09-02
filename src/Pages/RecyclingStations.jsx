import React, { useState, useEffect } from 'react';
import styles from './RecyclingStations.module.scss';
import supabase from '../../supabase';

const RecyclingStations = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        const fetchStations = async () => {
            const { data, error } = await supabase.from('recycling_sites').select('*');
            if (error) console.error('Error fetching stations:', error);
            else setStations(data);
        };

        fetchStations();
    }, []);

    return (
        <div className="recycling-stations">
            <h1>Genbrugsstationer</h1>
            <div className="station-list">
                {stations.map((station) => (
                    <div key={station.id} className="station-box">
                        <h2>{station.name}</h2>
                        <p>{station.address}</p>
                        <p>⭐ {station.num_stars}</p>
                        <button onClick={() => window.location.href = `/recycling-stations/${station.id}`}>
                            Se detaljer
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecyclingStations;
