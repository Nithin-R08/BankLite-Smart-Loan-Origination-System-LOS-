import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject authorization token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("banklite_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors (e.g. expired tokens)
api.interceptors.response.use(
  (response) => {
    // If the response is wrapped, we check for success field
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message || "Request failed"));
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        sessionStorage.removeItem("banklite_token");
        sessionStorage.removeItem("banklite_role");
        // We can let the AuthContext handle redirection if needed
      }
      
      // Extract custom error message from backend ApiResponse schema
      const backendMessage = error.response.data?.message;
      return Promise.reject(new Error(backendMessage || error.message || "An error occurred"));
    }
    return Promise.reject(error);
  }
);

export default api;
