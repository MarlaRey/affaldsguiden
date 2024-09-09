import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './StationsDetails.module.scss';
import supabase from '../../supabase';

const StationDetails = ({ user }) => {
    // Hent 'id' parameteren fra URL'en
    const { id } = useParams();
    // Håndter navigation
    const navigate = useNavigate();
    
    // State til at holde stationens data
    const [station, setStation] = useState(null);
    // State til at holde anmeldelserne
    const [reviews, setReviews] = useState([]);
    // State til at håndtere indholdet af en ny anmeldelse
    const [newReview, setNewReview] = useState('');
    // State til at håndtere antallet af stjerner i en ny anmeldelse
    const [newStars, setNewStars] = useState(1);
    // State til at håndtere emnet for en ny anmeldelse
    const [subject, setSubject] = useState('');
    // State til at håndtere redigering af en eksisterende anmeldelse
    const [editingReview, setEditingReview] = useState(null);
    // State til at håndtere fejlmeddelelser
    const [errorMessage, setErrorMessage] = useState('');

    // Effekt der henter stationens data og anmeldelser fra Supabase
    useEffect(() => {
        // Funktion til at hente stationens data
        const fetchStation = async () => {
            const { data, error } = await supabase
                .from('recycling_sites') // Vælg tabellen 'recycling_sites'
                .select('*') // Vælg alle kolonner
                .eq('id', id) // Filtrer på stationens id
                .single(); // Hent kun én post

            if (error) {
                // Log fejl hvis der opstår en
                console.error('Error fetching station:', error);
            } else {
                // Sæt stationens data i state
                setStation(data);
            }
        };

        // Funktion til at hente anmeldelser for stationen
        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews') // Vælg tabellen 'reviews'
                .select('*') // Vælg alle kolonner
                .eq('site_id', id); // Filtrer på stationens id

            if (error) {
                // Log fejl hvis der opstår en
                console.error('Error fetching reviews:', error);
            } else {
                // Sæt anmeldelserne i state
                setReviews(data);
            }
        };

        // Kald funktionerne for at hente data
        fetchStation();
        fetchReviews();
    }, [id]); // Kør effekt hver gang id ændres

    // Håndter anmeldelsesindsendelse
    const handleReviewSubmit = async (e) => {
        e.preventDefault(); // Forhindre standard formularhandling

        // Kontrollér om brugeren er logget ind
        if (!user) {
            setErrorMessage('Du skal være logget ind for at skrive en anmeldelse.');
            return;
        }

        // Data for den nye anmeldelse
        const reviewData = {
            site_id: id,
            subject: subject,
            comment: newReview,
            num_stars: newStars,
            user_id: user.id,
            is_active: true,
            created_at: new Date().toISOString(),
        };

        try {
            // Hvis vi redigerer en anmeldelse, opdater den
            if (editingReview) {
                const { error } = await supabase.from('reviews').update(reviewData).eq('id', editingReview.id);
                if (error) throw error;
            } else {
                // Ellers indsæt en ny anmeldelse
                const { error } = await supabase.from('reviews').insert([reviewData]);
                if (error) throw error;
            }

            // Nulstil formularfelter og state
            setNewReview('');
            setSubject('');
            setNewStars(1);
            setEditingReview(null);
            setErrorMessage('');

            // Opdater anmeldelserne
            const { data, error: fetchError } = await supabase
                .from('reviews')
                .select('*')
                .eq('site_id', id);
            if (fetchError) throw fetchError;
            setReviews(data);

        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage('Der opstod en fejl ved indsendelse af anmeldelsen.');
        }
    };

    // Håndter redigering af anmeldelse
    const handleEdit = (review) => {
        setEditingReview(review);
        setSubject(review.subject);
        setNewReview(review.comment);
        setNewStars(review.num_stars);
    };

    // Håndter sletning af anmeldelse
    const handleDelete = async (reviewId) => {
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
            if (error) throw error;

            // Opdater anmeldelserne efter sletning
            const { data, error: fetchError } = await supabase
                .from('reviews')
                .select('*')
                .eq('site_id', id);
            if (fetchError) throw fetchError;
            setReviews(data);

        } catch (error) {
            console.error('Error deleting review:', error);
            setErrorMessage('Der opstod en fejl ved sletning af anmeldelsen.');
        }
    };

    // Funktion til at generere stjerner baseret på vurdering
    const renderStars = (numStars) => {
        const totalStars = 5;
        let stars = '';
        for (let i = 0; i < totalStars; i++) {
            // Tilføj fyldte stjerner (⭐) eller tomme stjerner (☆)
            stars += i < numStars ? '⭐' : '☆';
        }
        return stars;
    };

    // Funktion til at formatere dato
    const formatDate = (dateString) => {
        const options = { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return new Intl.DateTimeFormat('da-DK', options).format(new Date(dateString));
    };

    // Hvis stationen ikke er hentet endnu, vis en "Loading..." besked
    if (!station) return <p>Loading...</p>;

    // Beregn gennemsnitlige stjerner baseret på anmeldelser
    const averageStars = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.num_stars, 0) / reviews.length
        : 0;

    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
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
                <div className={styles.infoContainer}>
                    <h1 className={styles.stationName}>{station.name}</h1>
                    <p className={styles.stationAddress}>{station.address}</p>
                    <p className={styles.stationAddress}>{station.zipcode} {station.city}</p>
                    <br />
                    <p className={styles.stationEmail}>Email: {station.email}</p>
                    <p className={styles.stationPhone}>Telefon: {station.phone}</p>
                </div>
                <div className={styles.starsContainer}>
                    <p className={styles.stationStars}>{renderStars(Math.round(averageStars))}</p>
                </div>
            </div>

            {/* Formularen til at skrive anmeldelser */}
            {user ? (
                <div className={styles.addReview}>
                    <h3 className={styles.addReviewHeader}>{editingReview ? 'Rediger anmeldelse' : 'Skriv en anmeldelse'}</h3>
                    <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                        <input
                            type="text"
                            placeholder="Emne"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Skriv en anmeldelse"
                            required
                            className={styles.textarea}
                        ></textarea>
                         
                        <div className={styles.starsSelection}>
                            <label htmlFor="num_stars">Vælg antal stjerner: </label>
                            <select
                                id="num_stars"
                                value={newStars}
                                onChange={(e) => setNewStars(parseInt(e.target.value, 10))}
                                className={styles.select}
                            >{/* En callback-funktion, der kaldes, når brugerens valg ændres.
                                e er en begivenhedsobjektet, der indeholder information om den ændrede <select>.
                                e.target.value er den nye værdi, som brugeren har valgt.
                                parseInt(e.target.value, 10) konverterer denne værdi fra en streng til et heltal.
                                setNewStars(...) opdaterer state-variablen newStars med den nye værdi, som brugeren har valgt. */}
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            {editingReview ? 'Opdater anmeldelse' : 'Indsend anmeldelse'}
                        </button>
                    </form>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                </div>
            ) : null}

            {/* Kommentarer vises nedenunder formularen */}
            <div className={styles.reviewsSection}>
                <h2 className={styles.commentsHeader}>Kommentarer</h2>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className={styles.review}>
                            <h3 className={styles.reviewSubject}>{review.subject}</h3>
                            <p className={styles.reviewDetails}>
                                {formatDate(review.created_at)}
                            </p>
                            <p className={styles.reviewContent}>{review.comment}</p>
                            <p className={styles.reviewStars}>{renderStars(review.num_stars)}</p>
                            {user?.id === review.user_id && (
                                <div className={styles.editDeleteButtons}>
                                    <button 
                                        className={styles.editDeleteButton}
                                        onClick={() => handleEdit(review)}
                                    >
                                        Rediger
                                    </button>
                                    <button 
                                        className={styles.editDeleteButton}
                                        onClick={() => handleDelete(review.id)}
                                    >
                                        Slet
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Der er endnu ikke givet nogle anmeldelser</p>
                )}
            </div>
            {!user && (
                <div className={styles.loginMessage}>
                    <p>Du skal være logget ind for at skrive en anmeldelse</p>    
                    <button onClick={() => navigate('/login')} className={styles.loginButton}>Log ind</button>
                </div>
            )}
        </div>
    );
};

export default StationDetails;
