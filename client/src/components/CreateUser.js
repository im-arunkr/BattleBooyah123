import React, { useState } from "react";
import api from "../api";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function CreateUser() {
    const [userId, setUserId] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [points, setPoints] = useState(''); // Use string for better input handling

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        if (!userId || !mobileNumber || !password) {
            setError("UserID, Mobile Number, and Password are required.");
            setLoading(false);
            return;
        }

        try {
            // UPDATED: Now uses the smart 'api' helper
            const { data } = await api.post("/api/admin/users", { // Correct endpoint
                userId,
                mobileNumber,
                password,
                points: Number(points) || 0,
            });

            setMessage(data.message || "User created successfully!");
            // Reset form fields
            setUserId("");
            setMobileNumber("");
            setPassword("");
            setPoints('');
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#121218] p-6 md:p-8 rounded-lg border border-[#27272a] max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Create New User Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="userId">
                            UserID
                        </label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="input-field w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Enter unique UserID"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="mobileNumber">
                            Mobile Number
                        </label>
                        <input
                            id="mobileNumber"
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="input-field w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Enter 10-digit mobile number"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Set a strong password"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="points">
                            Initial Points (Optional)
                        </label>
                        <input
                            id="points"
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="input-field w-full bg-[#0a0a0f] border border-[#27272a] rounded-lg py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g., 100"
                        />
                    </div>
                </div>
                
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            "Create User Account"
                        )}
                    </button>
                </div>
            </form>
            
            {message && 
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    <span>{message}</span>
                </div>
            }
            {error && 
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg flex items-center gap-3">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            }
        </div>
    );
}

export default CreateUser;

