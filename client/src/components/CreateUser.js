import React, { useState } from 'react';
// [FIX] 'axios' ko hatakar 'api' ko import kiya gaya hai
import api from '../api';

function CreateUser() {
    const [userId, setUserId] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [points, setPoints] = useState(0);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state for button

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setMessage('');
        setError('');

        if (!userId || !mobileNumber || !password) {
            setError('UserID, Mobile Number, and Password are required.');
            setLoading(false); // Stop loading
            return;
        }

        try {
            // [FIX] Manual token handling aur config object hata diya gaya hai
            // 'axios.post' ko 'api.post' se badal diya gaya hai aur URL ko chota kar diya gaya hai
            const { data } = await api.post(
                '/api/admin/create-user',
                { userId, mobileNumber, password, points }
            );
            
            setMessage(data.message);
            // Form fields ko reset karein
            setUserId('');
            setMobileNumber('');
            setPassword('');
            setPoints(0);

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            setError(errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-white">Create New User</h2>
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg">
                <form onSubmit={handleSubmit}>
                    {/* UserID Input */}
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="userId">
                            UserID
                        </label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Enter unique UserID"
                        />
                    </div>
                    {/* Mobile Number Input */}
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="mobileNumber">
                            Mobile Number
                        </label>
                        <input
                            id="mobileNumber"
                            type="text"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Enter unique 10-digit mobile number"
                        />
                    </div>
                    {/* Password Input */}
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Set a password for the user"
                        />
                    </div>
                    {/* Points Input */}
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="points">
                            Initial Points (Optional)
                        </label>
                        <input
                            id="points"
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading} // Disable button when loading
                        className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                </form>
                {message && <p className="mt-4 text-green-400">{message}</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}

export default CreateUser;
