// ============================================
// api/axios.js — Axios Instance for API Calls
// ============================================
// Instead of writing the full URL every time we call the API,
// we create a reusable Axios instance with the base URL
// and authentication header pre-configured.
//
// Usage in any component:
//   import api from '../api/axios';
//   const response = await api.get('/rooms');

import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------- Request Interceptor ----------
// This runs BEFORE every request is sent.
// It automatically adds the JWT token to the Authorization header.
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

// ---------- Response Interceptor ----------
// This runs AFTER every response is received.
// If we get a 401 (Unauthorized), clear the token and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
