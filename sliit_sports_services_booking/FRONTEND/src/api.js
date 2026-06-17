import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('sports_user');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid/expired (e.g. database was reset)
            localStorage.removeItem('sports_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
