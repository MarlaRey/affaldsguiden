import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './OrderContainer.module.scss';

const OrderContainer = () => {
    const [containers, setContainers] = useState([]);
    const [selectedContainerId, setSelectedContainerId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        zipcode: '',
        city: '',
        email: '',
        phone: '',
        container_id: '',
    });
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContainers = async () => {
            const { data, error } = await supabase.from('containers').select('*');
            if (error) console.error('Error fetching containers:', error);
            else setContainers(data);
        };

        fetchContainers();
    }, []);

    const handleContainerSelect = (containerId) => {
        setSelectedContainerId(containerId);
        setFormData({ ...formData, container_id: containerId });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { error } = await supabase.from('orders').insert([
            {
                address: formData.address,
                zipcode: formData.zipcode,
                city: formData.city,
                email: formData.email,
                phone: formData.phone,
                container_id: formData.container_id,
            }
        ]);
    
        if (error) {
            console.error('Error submitting order:', error);
        } else {
            setSuccess(true);
            navigate('/thank-you');
        }
    };

    if (success) {
        return <p>Tak for din bestilling!</p>;
    }

    return (
        <div className={styles.container}>
            <h1>Bestil Affaldscontainer</h1>
            <h2>Hvis I mangler en affaldscontainer i din husstand, kan du bestille en ved at udfylde og sende formularen herunder.</h2>
            
            <p>Vælg en af følgende container typer:</p>
            <div className={styles.containerTypes}>
                {containers.map((container) => (
                    <button
                        key={container.id}
                        className={`${styles.containerButton} ${selectedContainerId === container.id ? styles.selected : ''}`}
                        onClick={() => handleContainerSelect(container.id)}
                    >
                        
                        <span className={styles.containerTypeName}>{container.name}</span>

                        <div 
                            className={styles.icon} 
                            dangerouslySetInnerHTML={{ __html: container.icon_svg }} 
                        />
                    </button>
                ))}
            </div>

            <p>Containeren leveres til:</p>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                    name="zipcode"
                    placeholder="Postnummer"
                    value={formData.zipcode}
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
                <button type="submit" className={styles.submitButton} disabled={!selectedContainerId}>
                    SEND
                </button>
            </form>
        </div>
    );
};

export default OrderContainer;
