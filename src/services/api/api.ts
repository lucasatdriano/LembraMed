import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_BASE_URL = 'http://localhost:3000';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TIMEOUT_20_SECONDS = 20 * 1000;

const axiosConfig: AxiosRequestConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: TIMEOUT_20_SECONDS,
    withCredentials: true,
};

export const api: AxiosInstance = axios.create(axiosConfig);

export const extractAxiosError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.data) {
        return `${error.response.data.error} - ${error.response.data.details}`;
    }
    return 'Erro ao conectar ao servidor.';
};
