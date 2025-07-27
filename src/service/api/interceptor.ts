import { localStorageUtil } from '@/src/util/localStorageUtil';
import authService from '../domains/authService';
import api from '@/src/service/api/index';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const tokenAuthorization = await localStorageUtil.get('accessToken');
        if (tokenAuthorization) {
            config.headers = config.headers || {};
            if (!config.headers['Authorization']) {
                config.headers[
                    'Authorization'
                ] = `Bearer ${tokenAuthorization}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        if (!error.config) {
            return Promise.reject(error);
        }

        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refreshToken = await localStorageUtil.get('refreshToken');

            if (!refreshToken) {
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

                api.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${data.accessToken}`;

                refreshQueue.forEach((callback) => callback(data.accessToken));
                refreshQueue = [];

                return api(originalRequest);
            } catch (refreshError) {
                console.error('Erro ao renovar o token', refreshError);
                await localStorageUtil.remove('accessToken');
                await localStorageUtil.remove('refreshToken');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);
