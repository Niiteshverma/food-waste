import axios from 'axios';

let rawApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (!rawApi.startsWith('http://') && !rawApi.startsWith('https://')) {
    rawApi = `https://${rawApi}`;
}
if (!rawApi.endsWith('/api')) {
    rawApi = rawApi.replace(/\/$/, '') + '/api';
}
export const BASE_URL = rawApi;

let rawImg = import.meta.env.VITE_IMG_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (!rawImg.startsWith('http://') && !rawImg.startsWith('https://')) {
    rawImg = `https://${rawImg}`;
}
rawImg = rawImg.replace(/\/api\/?$/, '').replace(/\/$/, '');
export const IMG_BASE_URL = rawImg;

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('foodsave_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// On 401, clear stale auth so user is redirected to login
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('foodsave_token');
            localStorage.removeItem('foodsave_user');
        }
        return Promise.reject(err);
    }
);

export default api;
