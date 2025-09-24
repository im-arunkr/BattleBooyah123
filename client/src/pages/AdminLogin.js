import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api'; // UPDATED: Now imports our smart api helper
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // --- THIS IS THE UPDATED PART ---
            // The API call now uses our smart 'api' helper
            const { data } = await api.post(
                "/api/admin/login", // The URL is now short and clean
                { username, password }
            );

            if (data.token) {
                localStorage.setItem("token", data.token);
                onLoginSuccess();
                navigate("/admin/dashboard");
            } else {
                setError("Login failed: No token received from server.");
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "Login failed. Please check credentials.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] font-sans p-4">
            <div className="w-full max-w-md bg-[#121218] p-8 rounded-lg border border-[#27272a]">
                <div className="text-center">
                    <h1 className="text-4xl font-display uppercase tracking-wider text-white">
                        Admin <span className="text-gradient-animated">Panel</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Please log in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-gray-400 mb-2"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field w-full"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-400 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field w-full pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-300"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="text-right mt-2">
                            <Link
                                to="/admin/forgot-password"
                                className="text-sm text-blue-500 hover:text-blue-400 transition"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Log In"}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
                :root { --color-red: #ff3b3b; --color-blue: #3b82f6; --color-sky: #87ceeb; --bg-primary: #0a0a0f; --bg-secondary: #121218; --border-color: #27272a; }
                .font-display { font-family: 'Teko', sans-serif; }
                .font-sans { font-family: 'Inter', sans-serif; }
                .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
                @keyframes gradient-shine { to { background-position: 300% center; } }
                .btn { font-weight: bold; padding: 0.8rem 1.2rem; border-radius: 0.375rem; transition: all 0.3s; }
                .btn:hover { transform: translateY(-2px); }
                .btn-primary { background: linear-gradient(90deg, var(--color-red), var(--color-blue)); background-size: 200% auto; color: #fff; }
                .btn-primary:hover { background-position: right center; box-shadow: 0 0 25px rgba(59, 130, 246, 0.5); }
                .btn:disabled { cursor: not-allowed; background: #555; opacity: 0.6; transform: none; box-shadow: none; }
                .input-field { background-color: var(--bg-primary); border: 1px solid var(--border-color); color: #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; }
                .input-field:focus { outline: none; border-color: var(--color-blue); }
            `}</style>
        </div>
    );
};

export default AdminLogin;

