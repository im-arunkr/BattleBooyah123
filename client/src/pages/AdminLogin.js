import React, { useState } from 'react';
import axios from 'axios';

function AdminLogin({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            const { data } = await axios.post(
                'http://localhost:5000/api/admin/login',
                { username, password },
                config
            );
            
            // [FIX] Token ko sahi key 'adminToken' se save karna zaroori hai
            if (data.token) {
                localStorage.setItem('adminToken', data.token);
                onLoginSuccess(); // App.js ko batao ki login ho gaya
            } else {
                setError('Login failed: No token received from server.');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- JSX for the form ---
    return (
        <div style={{
            backgroundColor: '#0A0A0A', color: 'white', height: '100vh', display: 'flex',
            justifyContent: 'center', alignItems: 'center', fontFamily: "'Poppins', sans-serif",
        }}>
            <div style={{
                backgroundColor: '#111111', padding: '40px', borderRadius: '10px',
                border: '1px solid #27272A', width: '100%', maxWidth: '400px', textAlign: 'center',
            }}>
                <h1 style={{
                    background: 'linear-gradient(90deg, #F97316, #8B5CF6)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    fontSize: '2rem', marginBottom: '30px',
                }}>Admin Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%', padding: '12px', backgroundColor: '#0A0A0A',
                            border: '1px solid #27272A', borderRadius: '8px', color: 'white', marginBottom: '20px',
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%', padding: '12px', backgroundColor: '#0A0A0A',
                            border: '1px solid #27272A', borderRadius: '8px', color: 'white', marginBottom: '20px',
                        }}
                    />
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
                        color: 'white', fontWeight: 'bold', cursor: 'pointer',
                        backgroundImage: 'linear-gradient(to right, #F97316 0%, #8B5CF6 51%, #F97316 100%)',
                        backgroundSize: '200% auto', transition: 'all 0.3s ease', opacity: loading ? 0.5 : 1,
                    }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p style={{ color: '#E94560', marginTop: '10px' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;

