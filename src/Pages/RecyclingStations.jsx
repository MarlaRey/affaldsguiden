import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './RecyclingStations.module.scss';

const RecyclingStations = () => {
    // Initialiserer state til at holde genbrugsstationer
    const [stations, setStations] = useState([]);
    // Bruges til at navigere programmatisk
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStations = async () => {
            // Hent alle genbrugsstationer fra databasen
            const { data: stationsData, error: stationsError } = await supabase
                .from('recycling_sites')
                .select('*');

            if (stationsError) {
                // Logger fejl, hvis der opstår problemer med at hente stationer
                console.error('Error fetching stations:', stationsError);
                return;
            }
            // Hent anmeldelser for hver station og beregn gennemsnitligt antal stjerner
            const stationsWithReviews = await Promise.all(stationsData.map(async (station) => {
                // Hent anmeldelser for den aktuelle station baseret på stationens id
                const { data: reviewsData, error: reviewsError } = await supabase
                    .from('reviews')
                    .select('*')
                    .eq('site_id', station.id);

                if (reviewsError) {
                    // Logger fejl, hvis der opstår problemer med at hente anmeldelser
                    console.error(`Error fetching reviews for station ${station.id}:`, reviewsError);
                    // Returner stationen uden anmeldelser, hvis der er en fejl
                    return station;
                }

                // Beregn det totale antal stjerner fra anmeldelserne
                // `reviewsData.reduce` summerer `num_stars` fra hver anmeldelse
                const totalStars = reviewsData.reduce((sum, review) => sum + review.num_stars, 0);

                // Beregn antallet af anmeldelser
                const numReviews = reviewsData.length;

                // Beregn gennemsnitligt antal stjerner
                // Hvis der er anmeldelser (numReviews > 0), beregn gennemsnittet
                // Ellers, sæt gennemsnit til 0
                const averageStars = numReviews > 0 ? totalStars / numReviews : 0;

                // Returner stationen med tilføjede anmeldelser og beregnede gennemsnitlige stjerner
                // Bruger Spread Operator `...station` for at kopiere eksisterende stationsegenskaber
                // Tilføj `num_stars` og `num_reviews` til det kopierede objekt
                return {
                    ...station, // Beholder alle eksisterende egenskaber fra stationen
                    num_stars: averageStars, // Tilføjer beregnede gennemsnitlige stjerner
                    num_reviews: numReviews, // Tilføjer antal anmeldelser
                };
            }));


            // Opdater state med stationer, der nu inkluderer gennemsnitlige stjerner og antal anmeldelser
            setStations(stationsWithReviews);
        };

        // Kald fetchStations ved komponentens første rendering
        fetchStations();
    }, []);

    // Håndterer klik på en station og navigerer til stationens detaljeside baseret på dens id
    const handleStationClick = (stationId) => {
        navigate(`/recycling-stations/${stationId}`);
    };

    // Funktion til at generere stjerner baseret på vurdering
    const renderStars = (numStars) => {
        // Definer det totale antal stjerner, der skal vises (typisk 5 stjerner)
        const totalStars = 5;

        // Initialiser en tom streng til at opbygge stjernerepræsentationen
        let stars = '';

        // Loop gennem antallet af stjerner, der skal vises
        for (let i = 0; i < totalStars; i++) {
            // Tilføj en fyldt stjerne (⭐) hvis indekset er mindre end det angivne antal stjerner
            // Ellers, tilføj en tom stjerne (☆)
            stars += i < numStars ? '⭐' : '☆';
        }

        // Returner den opbyggede streng med stjerner
        return stars;
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Genbrugsstationer</h1>
            <div className={styles.grid}>
                {/* Mapper over stationer og viser hver station som et kort */}
                {stations.map((station) => (
                    <div
                        key={station.id}
                        className={styles.stationCard}
                        onClick={() => handleStationClick(station.id)} // Håndterer klik på stationen
                    >
                        <div className={styles.mapContainer}>
                            {/* Indlejret Google Maps iframe burde have været stationens placering, men det kunne jeg ikke få til at virke*/}
                            <iframe
                                src={`https://www.google.com/maps?q=${station.longitude},${station.latitude}&z=14&output=embed`}
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
                            {/* Viser stationens navn og adresse */}
                            <h2 className={styles.name}>{station.name}</h2>
                            <p className={styles.address}>{station.address}, {station.zipcode} {station.city}</p>
                        </div>
                        <div className={styles.details2}>
                            {/* Viser vurderingsstjerner */}
                            <p className={styles.stars}>{renderStars(Math.round(station.num_stars))}</p>
                            {/* Viser antal anmeldelser */}
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
