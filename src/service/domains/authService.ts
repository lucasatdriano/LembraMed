import { AxiosError, AxiosResponse } from 'axios';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import API_ROUTES from '../api/routes';
import api from '../api/index';

interface TokenResponse {
    accessToken: string;
    refreshToken?: string;
}

interface AuthService {
    forgotPassword: (email: string) => Promise<any>;
    resetPassword: (password: string) => Promise<any>;
    refreshToken: (refreshToken: string) => Promise<TokenResponse>;
    isRefreshTokenValid: (token: string) => boolean;
}

const authService: AuthService = {
    forgotPassword: async (email: string) => {
        try {
            const response = await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, {
                email,
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const errorMessage = `${error.response.data.error} - ${error.response.data.details}`;
                throw new Error(errorMessage);
            }
            throw new Error('Erro ao conectar ao servidor.');
        }
    },
    resetPassword: async (password: string) => {
        try {
            const response = await api.put(API_ROUTES.AUTH.RESET_PASSWORD, {
                password,
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const errorMessage = `${error.response.data.error} - ${error.response.data.details}`;
                throw new Error(errorMessage);
            }
            throw new Error('Erro ao conectar ao servidor.');
        }
    },
    refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
        if (!refreshToken) {
            console.error('Nenhum refresh token fornecido');
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        console.log('Validando refresh token...');
        if (!authService.isRefreshTokenValid(refreshToken)) {
            await localStorageUtil.remove('accessToken');
            await localStorageUtil.remove('refreshToken');
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        try {
            console.log('Enviando requisição de refresh...');
            const response: AxiosResponse<TokenResponse> = await api.post(
                API_ROUTES.AUTH.REFRESH_TOKEN,
                { refresh_token: refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${refreshToken}`,
                    },
                },
            );

            if (!response.data?.accessToken) {
                throw new Error('Resposta inválida do servidor');
            }

            console.log('Tokens recebidos:', {
                access: response.data.accessToken?.slice(0, 10) + '...',
                refresh: response.data.refreshToken?.slice(0, 10) + '...',
            });

            await localStorageUtil.set(
                'accessToken',
                response.data.accessToken,
            );
            if (response.data.refreshToken) {
                await localStorageUtil.set(
                    'refreshToken',
                    response.data.refreshToken,
                );
            }

            return {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            };
        } catch (error) {
            console.error('Falha no refresh token:', error);

            await localStorageUtil.remove('accessToken');
            await localStorageUtil.remove('refreshToken');

            if (error instanceof AxiosError) {
                const serverMessage =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Erro no servidor';
                throw new Error(serverMessage);
            }

            throw new Error('Falha ao renovar sessão');
        }
    },
    isRefreshTokenValid: (token: string): boolean => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(
                        (c) =>
                            '%' +
                            ('00' + c.charCodeAt(0).toString(16)).slice(-2),
                    )
                    .join(''),
            );

            const payload = JSON.parse(jsonPayload);
            return payload?.exp > Date.now() / 1000;
        } catch (error) {
            console.error('Token inválido:', error);
            return false;
        }
    },
};

export default authService;
