import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL

});


api.interceptors.request.use(
    (config) => {
        // First check sessionStorage (existing method)
        let token = sessionStorage.getItem(ACCESS_TOKEN);
        
        // If not in sessionStorage, check localStorage
        if (!token) {
            token = localStorage.getItem('token');
        }
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api

