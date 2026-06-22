// frontend/src/services/api.js
import axios from "axios";

// Create a custom Axios instance with our backend URL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Reads from our .env file
});

// 🪄 INTERCEPTOR: This runs BEFORE every request is sent
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        // If a token exists, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;