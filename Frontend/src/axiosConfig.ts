// src/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Intercepteur : récupération du CSRF token
api.interceptors.request.use(async (config) => {
  if (!document.cookie.includes('XSRF-TOKEN')) {
    await api.get('/sanctum/csrf-cookie');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
