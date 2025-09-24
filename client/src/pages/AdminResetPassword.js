import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // UPDATED: Now imports our smart api helper
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            // --- THIS IS THE UPDATED PART ---
            // The API call now uses our smart 'api' helper
            const { data } = await api.post(
                `/api/admin/reset-password/${token}`,
                { password }
            );
            
            setMessage(data.message + " Redirecting to login...");
            setTimeout(() => {
                navigate('/admin/login');
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;700&family=Inter:wght@400;600;700&display=swap');
        :root { --color-red: #ff3b3b; --color-blue: #3b82f6; --bg-primary: #0a0a0f; --bg-secondary: #121218; --border-color: #27272a; }
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
        @keyframes gradient-shine { to { background-position: 300% center; } }
    `;

    return (
        <>
            <style>{customStyles}</style>
            <div className="min-h-screen flex items-center justify-center bg-primary font-sans p-4" style={{ background: 'var(--bg-primary)'}}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <Link to="/" className="text-4xl font-display font-bold tracking-wider text-white">
                            Battle<span className="text-gradient-animated">Booyah</span>
                        </Link>
                    </div>

                    <div className="bg-secondary border border-border-color rounded-lg p-8 shadow-lg" style={{background: 'var(--bg-secondary)', borderColor: 'var(--border-color)'}}>
                        <h2 className="text-3xl font-display text-center text-white mb-6">Reset Your Password</h2>
                        
                        {message && (
                            <div className="p-4 rounded-md text-center bg-green-500/10 text-green-400 flex flex-col items-center gap-2">
                                <CheckCircle2 />
                                {message}
                            </div>
                        )}
                        
                        {error && !message && (
                             <div className="p-4 rounded-md text-center bg-red-500/10 text-red-400 flex flex-col items-center gap-2">
                                <AlertCircle />
                                {error}
                            </div>
                        )}

                        {!message && (
                            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-primary border border-border-color text-white rounded-md py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{background: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="relative">
                                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-primary border border-border-color text-white rounded-md py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        style={{background: 'var(--bg-primary)', borderColor: 'var(--border-color)'}}
                                    />
                                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center font-bold py-3 px-4 rounded-md text-white bg-gradient-to-r from-red-500 to-blue-600 hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminResetPassword;

