import axios from "axios";

// Auto-detect API URL based on environment
const getApiUrl = () => {
  // If deployed, use environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Production detection - if on Vercel, use production backend
  if (window.location.hostname.includes("vercel.app")) {
    // Replace with your deployed backend URL after deployment
    return "https://your-backend-url.onrender.com/api";
  }

  // Development - use localhost
  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
