import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './StationsDetails.module.scss';
import supabase from '../../supabase';

const StationDetails = ({ user }) => {
    const { id } = useParams();
    const [station, setStation] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');

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
            alert('Du skal være logget ind for at skrive en anmeldelse.');
            return;
        }

        const { error } = await supabase.from('reviews').insert([
            {
                site_id: id,
                content: newReview,
                user_id: user.id,
            },
        ]);

        if (error) console.error('Error submitting review:', error);
        else {
            setNewReview('');
            setReviews([...reviews, { content: newReview, user_id: user.id }]);
        }
    };

    if (!station) return <p>Loading...</p>;

    return (
        <div className="station-details">
            <h1>{station.name}</h1>
            <p>{station.address}</p>
            <p>⭐ {station.num_stars}</p>
            <div className="map">
                <iframe
                    title="station-map"
                    src={`https://www.google.com/maps?q=${station.latitude},${station.longitude}&z=15&output=embed`}
                    width="600"
                    height="450"
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
            <div className="reviews">
                <h2>Anmeldelser</h2>
                {reviews.map((review, index) => (
                    <div key={index} className="review">
                        <p>{review.content}</p>
                        {user?.id === review.user_id && (
                            <button>Rediger / Slet</button>
                        )}
                    </div>
                ))}
            </div>
            <div className="add-review">
                <h3>Skriv en anmeldelse</h3>
                <form onSubmit={handleReviewSubmit}>
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">Indsend</button>
                </form>
            </div>
        </div>
    );
};

export default StationDetails;
