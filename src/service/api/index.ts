import axios from "axios";

const API_BASE_URL = 'https://lembramed-server.onrender.com';
// const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

export default api;
