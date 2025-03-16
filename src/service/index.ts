import axios from 'axios';
import { useRouter } from 'expo-router';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import authService from './api/authService';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

api.interceptors.request.use(
    async (config: any) => {
        const tokenAuthorization = await localStorageUtil.get('accessToken');
        if (tokenAuthorization) {
            config.headers = config.headers || {};
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${tokenAuthorization}`;
            }
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response: any) => {
        return response;
    },
    async (error: any) => {
        const originalRequest = error.config;
        const router = useRouter();

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = await localStorageUtil.get('refreshToken');

            if (!refreshToken) {
                router.navigate('/login');
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve) => {
                    refreshQueue.push((token) => {
                        originalRequest.headers[
                            'Authorization'
                        ] = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const data = await authService.refreshToken(refreshToken);
                await localStorageUtil.set('accessToken', data.accessToken);

                api.defaults.headers[
                    'Authorization'
                ] = `Bearer ${data.accessToken}`;

                refreshQueue.forEach((callback) => callback(data.accessToken));
                refreshQueue = [];

                return api(originalRequest);
            } catch (refreshError) {
                console.error('Erro ao renovar o token', refreshError);
                await localStorageUtil.remove('accessToken');
                await localStorageUtil.remove('refreshToken');
                router.replace('/login');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default api;
