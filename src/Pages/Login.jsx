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
                .from('comments') // Erstat 'comments' med din tabelnavn
                .select('*')
                .eq('user_id', user.id); // Antager at du har en user_id kolonne
            if (error) throw error;
            setComments(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // Håndter autentificering (login/tilmelding)
    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setEmailError('');
        setPasswordError('');

        if (!validateEmail(email)) {
            setEmailError('Ugyldig emailadresse');
            return;
        }

        try {
            if (isSignup) {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setUser(data.user);
            } else {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.status === 400) {
                        setPasswordError('Forkert adgangskode');
                    } else {
                        throw error;
                    }
                } else {
                    setUser(data.user);
                }
            }
        } catch (error) {
            setError(error.message);
        }

        // Ryd felterne efter submit
        setEmail('');
        setPassword('');
    };

    // Håndter logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);  // Nulstiller brugeren ved log ud
        setEmail('');    // Tømmer email-feltet
        setPassword(''); // Tømmer adgangskode-feltet
        setIsSignup(false); // Tilbage til login-tilstand
    };

    // Hent kommentarer når komponenten er mountet
    useEffect(() => {
        if (user) {
            fetchComments();
        }
    }, [user]);

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
