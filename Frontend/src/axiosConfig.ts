// src/axiosConfig.ts
import axios from 'axios';

// Configurer Axios globalement avec les credentials
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Récupération automatique du CSRF Token avant chaque requête
axios.interceptors.request.use(async (config) => {
  if (!document.cookie.includes('XSRF-TOKEN')) {
    await axios.get('/sanctum/csrf-cookie');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axios;
