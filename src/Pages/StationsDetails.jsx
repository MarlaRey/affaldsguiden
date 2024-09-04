import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './StationsDetails.module.scss';
import supabase from '../../supabase';

const StationDetails = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [station, setStation] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [newStars, setNewStars] = useState(1);
    const [subject, setSubject] = useState('');
    const [editingReview, setEditingReview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchStation = async () => {
            const { data, error } = await supabase
                .from('recycling_sites')
                .select('*')
                .eq('id', id)
                .single();

            if (error) console.error('Error fetching station:', error);
            else setStation(data);
        };

        const fetchReviews = async () => {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('site_id', id);

            if (error) console.error('Error fetching reviews:', error);
            else setReviews(data);
        };

        fetchStation();
        fetchReviews();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setErrorMessage('Du skal være logget ind for at skrive en anmeldelse.');
            return;
        }

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
            if (editingReview) {
                const { error } = await supabase.from('reviews').update(reviewData).eq('id', editingReview.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('reviews').insert([reviewData]);
                if (error) throw error;
            }

            setNewReview('');
            setSubject('');
            setNewStars(1);
            setEditingReview(null);
            setErrorMessage('');

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

    const handleEdit = (review) => {
        setEditingReview(review);
        setSubject(review.subject);
        setNewReview(review.comment);
        setNewStars(review.num_stars);
    };

    const handleDelete = async (reviewId) => {
        try {
            const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
            if (error) throw error;

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

    const renderStars = (numStars) => {
        const totalStars = 5;
        let stars = '';
        for (let i = 0; i < totalStars; i++) {
            stars += i < numStars ? '⭐' : '☆';
        }
        return stars;
    };

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

    if (!station) return <p>Loading...</p>;

    const averageStars = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.num_stars, 0) / reviews.length
        : 0;

    return (
        <div className={styles.container}>
            <div className={styles.mapContainer}>
                <iframe
                    title="station-map"
                    src={`https://www.google.com/maps?q=${station.latitude},${station.longitude}&z=15&output=embed`}
                    className={styles.map}
                    allowFullScreen=""
                    loading="lazy"
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
                            >
                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <button type="submit" className={styles.submitButton}>
                            {editingReview ? 'Opdater anmeldelse' : 'Indsend anmeldelse'}
                        </button>
                    </form>
                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                </div>
            ) : (
                <div >
              
                  
                </div>
            )}

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

            </div>      <div className={styles.loginMessage} ><p >Du skal være logget ind for at skrive en kommentar</p>    
            <button onClick={() => navigate('/login')} className={styles.loginButton}>Log ind</button>
                  
              </div> 
        </div>
    );
};

export default StationDetails;
