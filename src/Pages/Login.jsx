import React, { useState, useEffect } from 'react';
import supabase from '../../supabase';
import styles from './Login.module.scss';

const Login = ({ setUser, user }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [comments, setComments] = useState([]);

    // Validering af email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Hent kommentarer
const fetchComments = async () => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('user_id', user.id); // Henter kommentarer fra Supabase hvor user_id matcher
        if (error) throw error;
        setComments(data); // Opdaterer tilstanden med de hentede kommentarer
    } catch (error) {
        setError(error.message); // Viser en generel fejlbesked hvis noget går galt
    }
};


    // Håndter autentificering (login/tilmelding)
    const handleAuth = async (e) => {
        e.preventDefault(); // Forhindrer formularens standardadfærd (siden opdateres ikke)
        setError(''); // Nulstiller fejlbeskeder
        setEmailError('');
        setPasswordError('');
    
        if (!validateEmail(email)) {
            setEmailError('Ugyldig emailadresse');
            return; // Stopper, hvis emailen er ugyldig
        }
    
        try {
            if (isSignup) {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setUser(data.user); // Sætter den autentificerede bruger
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.status === 400) {
                        setPasswordError('Forkert adgangskode');
                    } else {
                        throw error;
                    }
                } else {
                    setUser(data.user); // Sætter den autentificerede bruger
                }
            }
        } catch (error) {
            setError(error.message); // Generel fejlbesked vises ved problemer
        }
    
        // Nulstiller inputfelterne
        setEmail('');
        setPassword('');
    };
    

    useEffect(() => {
        if (user) {
            fetchComments(); // Henter kommentarer, når brugeren er logget ind
        }
    }, [user]); // Kører kun når `user` ændrer sig (dvs. når brugeren logger ind/ud)
    

    return (
        <div className={styles.container}>
      
                <div className={styles.form}>
                    <h1>{isSignup ? 'Opret Konto' : 'Login'}</h1>
                    {error && <p className={styles.error}>{error}</p>}
                    <form onSubmit={handleAuth} className={styles.form}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={emailError ? styles.inputError : ''}
                        />
                        {emailError && <p className={styles.error}>{emailError}</p>}
                        <input
                            type="password"
                            placeholder="Adgangskode"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={passwordError ? styles.inputError : ''}
                        />
                        {passwordError && <p className={styles.error}>{passwordError}</p>}
                        <button type="submit" className={styles.submitButton}>
                            {isSignup ? 'Opret Konto' : 'Login'}
                        </button>
                    </form>
                    <button onClick={() => setIsSignup(!isSignup)} className={styles.toggleButton}>
                        {isSignup ? 'Har du allerede en konto? Login' : 'Har du ikke en konto? Opret en'}
                    </button>
                </div>
    
        </div>
    );
};

export default Login;
