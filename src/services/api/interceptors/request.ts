'use client';

import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { parseCookies } from 'nookies';

export const setupRequestInterceptor = (api: AxiosInstance) => {
    api.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const cookies = parseCookies();
            const accessToken = cookies.accessToken;

            if (accessToken) {
                config.headers = config.headers || {};
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
            }

            const deviceId = cookies.deviceId;
            if (deviceId && config.data && typeof config.data === 'object') {
                config.data.deviceId = deviceId;
            }

            if (process.env.NODE_ENV === 'development') {
                console.group(
                    `[Axios] Requisição: ${config.method?.toUpperCase()} ${
                        config.url
                    }`,
                );
                console.info('Config:', {
                    method: config.method,
                    url: config.url,
                    headers: { ...config.headers },
                    params: config.params,
                    data: config.data,
                });
                console.groupEnd();
            }

            return config;
        },
        (error: AxiosError) => {
            console.error('[Axios] Erro no interceptor de requisição:', error);
            return Promise.reject(error);
        },
    );
};
