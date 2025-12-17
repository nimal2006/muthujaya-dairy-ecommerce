import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage");
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`;
        }
      } catch (e) {
        console.error("Error parsing auth token");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
