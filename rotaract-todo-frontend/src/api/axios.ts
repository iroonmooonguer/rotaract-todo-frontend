import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000', // apunta al prefijo de tu API
});

// Agrega el token de auth en cada petición si existe
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
