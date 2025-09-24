import axios from "axios";

// 1. Create a new "instance" of axios with your base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 2. Create an "interceptor"
// This is a special function that runs BEFORE every request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from the browser's localStorage
    const token = localStorage.getItem("token");

    // If the token exists, add it to the request's "Authorization" header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Send the request on its way
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  },
);

export default api;
