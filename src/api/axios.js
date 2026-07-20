import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // API base URL local
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Opcional: Interceptores para manejar tokens o errores
api.interceptors.request.use(
  (config) => {
    // Ejemplo: Añadir token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;