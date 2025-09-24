import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../api"; // UPDATED: Now imports our smart api helper

const UserLoginPage = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Added for button loading state

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // --- THIS IS THE UPDATED PART ---
            // It now uses our 'api' helper, which automatically sets the correct URL
            // and will handle the token for future requests.
            const response = await api.post(
                "/api/users/login", // The URL is now short and clean
                {
                    userId: userId,
                    password: password,
                },
            );

            const token = response.data.token;
            
            // This name 'user_token' must match what the api.js file is looking for
            localStorage.setItem("user_token", token); 
            
            navigate("/dashboard");

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError("Cannot connect to the server. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;700&family=Inter:wght@400;600;700&display=swap');
        :root { --color-red: #ff3b3b; --color-blue: #3b82f6; --color-sky: #87ceeb; --bg-primary: #0a0a0f; --bg-secondary: #121218; --border-color: #27272a; }
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .text-gradient-animated { background: linear-gradient(90deg, var(--color-red), var(--color-blue), var(--color-sky), var(--color-red)); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
        @keyframes gradient-shine { to { background-position: 300% center; } }
        .card-sharp { background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 2rem; position: relative; overflow: hidden; }
        .card-sharp::before { content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: linear-gradient(180deg, var(--color-red), var(--color-blue)); }
        .btn { font-weight: bold; padding: 0.7rem 1.8rem; border-radius: 0.375rem; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.5s ease; display: inline-flex; align-items: center; justify-content: center; width: 100%; text-align: center; }
        .btn:hover { transform: scale(1.02); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-primary { background: linear-gradient(90deg, var(--color-red), var(--color-blue)); background-size: 200% auto; color: #fff; }
        .btn-primary:hover { background-position: right center; box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
        .input-field { background-color: var(--bg-primary); border: 1px solid var(--border-color); color: #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .input-field:focus { outline: none; border-color: var(--color-blue); box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
    `;

    return (
        <>
            <style>{customStyles}</style>
            <div
                className="min-h-screen flex items-center justify-center font-sans p-4"
                style={{ background: "var(--bg-primary)" }}
            >
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <Link
                            to="/"
                            className="text-4xl font-display font-bold tracking-wider text-white"
                        >
                            Battle<span className="text-gradient-animated">Booyah</span>
                        </Link>
                    </div>
                    <div className="card-sharp">
                        <h2 className="text-4xl font-display text-center text-white mb-6">
                            Welcome Back
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="userId"
                                    className="block text-sm font-semibold text-gray-400 mb-2"
                                >
                                    UserID or Mobile Number
                                </label>
                                <input
                                    id="userId"
                                    name="userId"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="input-field"
                                    placeholder="Enter your UserID or Mobile Number"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-gray-400 mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    placeholder=""
                                />
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                            <div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
                                </button>
                            </div>
                        </form>
                        <p className="mt-8 text-center text-gray-500">
                            Don't have an account?{" "}
                            <a
                                href="https://wa.me/919608039938?text=I%20want%20an%20ID"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-500 hover:text-blue-400"
                            >
                                Register Now
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserLoginPage;
