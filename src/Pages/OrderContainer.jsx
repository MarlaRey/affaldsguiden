import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabase';
import styles from './OrderContainer.module.scss';

const OrderContainer = () => {
    // State til at holde data om tilgængelige containere
    const [containers, setContainers] = useState([]);
    // State til at holde ID'et på den valgte container
    const [selectedContainerId, setSelectedContainerId] = useState(null);
    // State til at holde formularens data
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        zipcode: '',
        city: '',
        email: '',
        phone: '',
        container_id: '',
    });
    // State til at håndtere success-tilstand
    const [success, setSuccess] = useState(false);
    // Håndter navigation
    const navigate = useNavigate();

    // Effekt der henter container data fra Supabase ved komponentens første rendering
    useEffect(() => {
        const fetchContainers = async () => {
            const { data, error } = await supabase.from('containers').select('*');
            if (error) {
                // Log fejl, hvis der opstår en
                console.error('Error fetching containers:', error);
            } else {
                // Opdater state med de hentede containere
                setContainers(data);
            }
        };

        fetchContainers();
    }, []); // Tom dependency array sikrer, at denne effekt kun kører én gang ved komponentens første rendering

    // Funktion til at håndtere valg af container
    const handleContainerSelect = (containerId) => {
        // Opdater state med den valgte container ID
        setSelectedContainerId(containerId);
        // Opdater formData med den valgte container ID
        setFormData({ ...formData, container_id: containerId });
    };

    // Funktion til at håndtere ændringer i formularfelter
    const handleChange = (e) => {
        // Opdater state med de nye værdier fra formularen
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Funktion til at håndtere formularindsendelse
    const handleSubmit = async (e) => {
        e.preventDefault(); // Forhindre standard formularhandling

        // Indsend ordre til Supabase
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
            // Log fejl, hvis der opstår en ved indsending af ordren
            console.error('Error submitting order:', error);
        } else {
            // Opdater success state og naviger til tak-siden
            navigate('/thank-you');
            // Rul til toppen af siden
            window.scrollTo(0, 0);
        }
    };



    return (
        <div className={styles.container}>
            <h1>Bestil Affaldscontainer</h1>
            <h2>Hvis I mangler en affaldscontainer i din husstand, kan du bestille en ved at udfylde og sende formularen herunder.</h2>

            <p>Vælg en af følgende container typer:</p>
            <div className={styles.containerTypes}>
                {/* Loop gennem de tilgængelige containere og generer knapper */}
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
                {/* Formularfelter til at indsamle brugerens oplysninger */}
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
                {/* Send-knap er deaktiveret, hvis ingen container er valgt */}
                <button type="submit" className={styles.submitButton} disabled={!selectedContainerId}>
                    SEND
                </button>
            </form>
        </div>
    );
};

export default OrderContainer;
