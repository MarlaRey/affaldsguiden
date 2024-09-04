import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './RecyclingStations.module.scss';

const RecyclingStations = () => {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStations = async () => {
            // Hent alle genbrugsstationer
            const { data: stationsData, error: stationsError } = await supabase
                .from('recycling_sites')
                .select('*');

            if (stationsError) {
                console.error('Error fetching stations:', stationsError);
                return;
            }

            // Hent anmeldelser for hver station
            const stationsWithReviews = await Promise.all(stationsData.map(async (station) => {
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('site_id', station.id);

                if (reviewsError) {
                    console.error(`Error fetching reviews for station ${station.id}:`, reviewsError);
                    return station;
                }

                // Beregn gennemsnitlige stjerner
                const totalStars = reviewsData.reduce((sum, review) => sum + review.num_stars, 0);
                const numReviews = reviewsData.length;
                const averageStars = numReviews > 0 ? totalStars / numReviews : 0;

                return {
                    ...station,
                    num_stars: averageStars,
                    num_reviews: numReviews,
                };
            }));

            setStations(stationsWithReviews);
        };

        fetchStations();
    }, []);

    const handleStationClick = (stationId) => {
        navigate(`/recycling-stations/${stationId}`);
    };

    // Funktion til at generere stjerner baseret på vurdering
    const renderStars = (numStars) => {
        const totalStars = 5;
        let stars = '';
        for (let i = 0; i < totalStars; i++) {
            stars += i < numStars ? '⭐' : '☆';
        }
        return stars;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Genbrugsstationer</h1>
            <div className={styles.grid}>
                {stations.map((station) => (
                    <div
                        key={station.id}
                        className={styles.stationCard}
                        onClick={() => handleStationClick(station.id)}
                    >
                        <div className={styles.mapContainer}>
                            <iframe
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2170.211101954083!2d9.96259189469518!3d57.047926023412984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x464932b6a2b7696b%3A0x861634f2bf524040!2s%C3%98ster%20Uttrup%20Vej%201%2C%209000%20Aalborg!5e0!3m2!1sda!2sdk!4v1725436036034!5m2!1sda!2sdk`}
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map for ${station.name}`}
                            ></iframe>
                        </div>
                        <div className={styles.details}>
                            <h2 className={styles.name}>{station.name}</h2>
                            <p className={styles.address}>{station.address}, {station.zipcode} {station.city}</p>
                        </div>
                        <div className={styles.details2}>
                            <p className={styles.stars}>{renderStars(Math.round(station.num_stars))}</p>
                            <p className={styles.reviews}>
                                {station.num_reviews > 0
                                    ? `(${station.num_reviews} anmeldelser)`
                                    : 'Der er endnu ikke givet nogle anmeldelser'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecyclingStations;
