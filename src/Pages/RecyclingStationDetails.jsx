import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './RecyclingStationDetails.module.scss';

const RecyclingStationDetails = () => {
    const { stationId } = useParams();
    const [station, setStation] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ subject: '', comment: '', num_stars: 1 });
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const user = await supabase.auth.user();
            setUser(user);
        };

        const fetchStationDetails = async () => {
            const { data, error } = await supabase
                .from('recycling_sites')
                .select('*')
                .eq('id', stationId)
                .single();
            
            if (error) console.error('Error fetching station details:', error);
            else setStation(data);
        };

        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('site_id', stationId);
            
            if (error) console.error('Error fetching reviews:', error);
            else setReviews(data);
        };

        fetchUser();
        fetchStationDetails();
        fetchReviews();
    }, [stationId]);

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Du skal være logget ind for at indsende en anmeldelse.');
            return;
        }

        const { subject, comment, num_stars } = newReview;

        if (!subject || !comment || num_stars < 1 || num_stars > 5) {
            setError('Alle felter skal udfyldes korrekt.');
            return;
        }

        const { error } = await supabase
            .from('reviews')
            .insert([{
                subject,
                comment,
                num_stars: parseInt(num_stars),
                site_id: stationId,
                user_id: user.id
            }]);

        if (error) {
            console.error('Error submitting review:', error);
            setError('Der opstod en fejl under indsendelsen af din anmeldelse.');
        } else {
            setError('');
            setNewReview({ subject: '', comment: '', num_stars: 1 });
            // Reload reviews after submission
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('site_id', stationId);
            setReviews(data);
        }
    };

    if (!station) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <img 
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${station.latitude},${station.longitude}&zoom=15&size=600x300&markers=color:red%7C${station.latitude},${station.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`} 
                    alt={`${station.name} map`} 
                    className={styles.mapImage} 
                />
            </div>
            <div className={styles.details}>
                <h1 className={styles.stationName}>{station.name}</h1>
                <p className={styles.stationAddress}>{station.address}, {station.zipcode} {station.city}, {station.country}</p>
                <p className={styles.stationStars}>⭐ {station.num_stars}</p>
            </div>
            <div className={styles.reviewsSection}>
                <h2>Anmeldelser</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className={styles.review}>
                            <h4>{review.subject}</h4>
                            <p>{review.comment}</p>
                            <p>⭐ {review.num_stars}</p>
                        </div>
                    ))
                ) : (
                    <p>Ingen anmeldelser endnu.</p>
                )}
                {user ? (
                    <div className={styles.reviewForm}>
                        <h3>Skriv en anmeldelse</h3>
                        {error && <p className={styles.error}>{error}</p>}
                        <form onSubmit={handleReviewSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">Emne</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    name="subject" 
                                    value={newReview.subject} 
                                    onChange={handleReviewChange} 
                                    required 
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="comment">Kommentar</label>
                                <textarea 
                                    id="comment" 
                                    name="comment" 
                                    value={newReview.comment} 
                                    onChange={handleReviewChange} 
                                    required 
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="num_stars">Stjerner</label>
                                <select 
                                    id="num_stars" 
                                    name="num_stars" 
                                    value={newReview.num_stars} 
                                    onChange={handleReviewChange}
                                    required
                                >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                            <button type="submit">Indsend anmeldelse</button>
                        </form>
                    </div>
                ) : (
                    <p>Du skal være logget ind for at indsende en anmeldelse.</p>
                )}
            </div>
        </div>
    );
};

export default RecyclingStationDetails;
