import { authStore } from '@/stores/authStore';
import axios from 'axios';

export const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,
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