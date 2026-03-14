import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? null  // Disable API calls in production - let frontend work standalone
  : 'http://localhost:5003';

// Only create axios instance if we have an API URL
const api = API_BASE_URL ? axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}) : null;

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
