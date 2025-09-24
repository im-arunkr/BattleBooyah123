import axios from 'axios';

// 1. Create a new axios instance. This part is unchanged.
const api = axios.create({
    // It will automatically use the correct URL for local and deployed versions.
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// 2. Create an "interceptor".
// This is a special function that runs BEFORE every single request is sent.
api.interceptors.request.use(
    (config) => {
        // --- THIS IS THE UPDATED PART ---
        // It now checks for the admin token OR the user token.
        const token = localStorage.getItem('token') || localStorage.getItem('user_token');

        // If either token exists, it adds it to the request's "Authorization" header.
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Send the request on its way
        return config;
    },
    (error) => {
        // Handle any request errors
        return Promise.reject(error);
    }
);

export default api;

