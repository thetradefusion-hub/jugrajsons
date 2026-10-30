import axios from 'axios';

// Get API URL from environment variable
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is set and is a valid URL
  if (envUrl) {
    // Check if it's already a full URL (starts with http:// or https://)
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
      return envUrl;
    }
    // If it's a relative path, prepend https://
    return `https://${envUrl}`;
  }
  
  // Prefer 127.0.0.1 — on Windows, `localhost` often hits IPv6 (::1) first and stalls
  return 'http://127.0.0.1:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('jugrajsonshive-user');
      localStorage.removeItem('atharva-user');
      // Redirect to admin login if on admin route, otherwise regular login
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminRoute ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

