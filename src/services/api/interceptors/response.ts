'use client';

import {
    AxiosInstance,
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import authService from '@/services/domains/authService';
import { accountManager } from '@/services/domains/accountManagerService';

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

export const setupResponseInterceptor = (api: AxiosInstance) => {
    api.interceptors.response.use(
        (response: AxiosResponse) => {
            if (process.env.NODE_ENV === 'development') {
                console.group(
                    `[Axios] Resposta de sucesso: ${response.status} ${response.config.url}`,
                );
                console.info('Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data,
                    headers: response.headers,
                    config: {
                        method: response.config.method,
                        url: response.config.url,
                        params: response.config.params,
                    },
                });
                console.groupEnd();
            }

            return response;
        },
        async (error: AxiosError) => {
            if (!error.config) {
                return Promise.reject(error);
            }

            const originalRequest =
                error.config as InternalAxiosRequestConfig & {
                    _retry?: boolean;
                };

            console.group('[Axios] Erro na resposta');

            if (error.response) {
                console.error('Detalhes do erro:', {
                    status: error.response.status,
                    data: error.response.data,
                    request: {
                        method: error.config.method,
                        url: error.config.url,
                    },
                });

                if (error.response.status === 401 && !originalRequest._retry) {
                    const publicEndpoints = [
                        '/auth/forgotPassword',
                        '/auth/resetPassword',
                        '/auth/refresh-token',
                        '/users/register',
                        '/users/login-multi',
                    ];

                    if (
                        publicEndpoints.some((endpoint) =>
                            originalRequest.url?.includes(endpoint),
                        )
                    ) {
                        console.groupEnd();
                        return Promise.reject(error);
                    }

                    const cookies = parseCookies();
                    const refreshToken = cookies.refreshToken;
                    const deviceId = cookies.deviceId;

                    if (!refreshToken || !deviceId) {
                        console.error(
                            'Refresh token ou deviceId não encontrados',
                        );
                        authService.logout();
                        window.location.href = '/login';
                        console.groupEnd();
                        return Promise.reject(error);
                    }

                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            refreshQueue.push((token: string) => {
                                if (token) {
                                    originalRequest.headers =
                                        originalRequest.headers || {};
                                    originalRequest.headers[
                                        'Authorization'
                                    ] = `Bearer ${token}`;
                                    resolve(api(originalRequest));
                                } else {
                                    reject(new Error('Falha no refresh token'));
                                }
                            });
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    // No bloco do try do refresh token, adicione:
                    try {
                        const tokens = await authService.refreshToken(
                            refreshToken,
                            deviceId,
                        );

                        // ATUALIZA O HEADER GLOBAL
                        api.defaults.headers.common[
                            'Authorization'
                        ] = `Bearer ${tokens.accessToken}`;

                        // PROCESSAR FILA DE REQUISIÇÕES PENDENTES
                        refreshQueue.forEach((callback) =>
                            callback(tokens.accessToken),
                        );
                        refreshQueue = [];

                        // ATUALIZA A REQUISIÇÃO ORIGINAL
                        originalRequest.headers = originalRequest.headers || {};
                        originalRequest.headers[
                            'Authorization'
                        ] = `Bearer ${tokens.accessToken}`;

                        console.log(
                            '✅ [Interceptor] Token renovado com sucesso, reenviando requisição...',
                        );
                        console.groupEnd();

                        return api(originalRequest);
                    } catch (refreshError) {
                        console.error(
                            '❌ [Interceptor] Erro ao renovar token:',
                            refreshError,
                        );

                        // LIMPA A FILA COM ERRO
                        refreshQueue.forEach((callback) => callback(''));
                        refreshQueue = [];

                        // LOGOUT APENAS DA CONTA ATUAL
                        const currentAccount =
                            accountManager.getAccountByDeviceId(deviceId);
                        if (currentAccount) {
                            accountManager.logoutAccount(currentAccount.userId);
                        } else {
                            authService.logout();
                        }

                        // REDIRECIONA PARA LOGIN APENAS SE FOR A CONTA ATUAL
                        if (
                            typeof window !== 'undefined' &&
                            currentAccount?.userId ===
                                accountManager.getCurrentAccount()?.userId
                        ) {
                            window.location.href = '/login';
                        }

                        console.groupEnd();
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                if (error.response.status === 401) {
                    const cookies = parseCookies();
                    if (cookies.accessToken) {
                        console.log(
                            'Token inválido, redirecionando para login...',
                        );
                        authService.logout();
                        window.location.href = '/login';
                    }
                }
            } else if (error.request) {
                console.error('Erro de rede/timeout:', {
                    message: error.message,
                    request: error.request,
                });
            } else {
                console.error('Erro ao configurar requisição:', error.message);
            }

            console.groupEnd();
            return Promise.reject(error);
        },
    );
};
