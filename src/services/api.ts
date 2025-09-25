import { authStore } from '@/stores/authStore';
import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const authModule = authStore()
        const authToken = authModule.getAuthToken
        if (authToken) { config.headers.Authorization = `Bearer ${authToken}`; }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);