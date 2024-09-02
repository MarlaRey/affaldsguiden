import React, { useState, useEffect } from 'react';
import styles from './OrderContainer.module.scss';
import supabase from '../../supabase';

const OrderContainer = () => {
    const [containers, setContainers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        postal_code: '',
        city: '',
        email: '',
        phone: '',
        container_id: '',
    });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchContainers = async () => {
            const { data, error } = await supabase.from('containers').select('*');
            if (error) console.error('Error fetching containers:', error);
            else setContainers(data);
        };

        fetchContainers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('orders').insert([formData]);

        if (error) console.error('Error submitting order:', error);
        else setSuccess(true);
    };

    if (success) return <p>Tak for din bestilling!</p>;

    return (
        <div className="order-container">
            <h1>Bestil Container</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Navn"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="postal_code"
                    placeholder="Postnummer"
                    value={formData.postal_code}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="By"
                    value={formData.city}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Telefonnummer"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <select
                    name="container_id"
                    value={formData.container_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Vælg en container</option>
                    {containers.map((container) => (
                        <option key={container.id} value={container.id}>
                            {container.type}
                        </option>
                    ))}
                </select>
                <button type="submit">Bestil</button>
            </form>
        </div>
    );
};

export default OrderContainer;
