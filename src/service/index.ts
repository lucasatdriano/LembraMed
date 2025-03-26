import axios from 'axios';

const API_BASE_URL = 'https://lembramed-server.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default api;
