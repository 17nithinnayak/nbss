import axios from "axios";

// Set VITE_API_URL in a .env file (frontend/.env) for local dev, and as
// an environment variable in Vercel's project settings for production.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nbss_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, boot the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nbss_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
