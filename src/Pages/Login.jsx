import React, { useState } from 'react';
import styles from './Login.module.scss';
import supabase from '../../supabase';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) setError('Login failed. Check your credentials.');
        else setUser(data.user);
    };

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
