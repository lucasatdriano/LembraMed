import { Login } from '@/src/interfaces/login';
import { secureStorageUtil } from '@/src/util/secureStorageUtil';
import api from '../api/index';
import API_ROUTES from '../api/routes';

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
            throw error;
        }
    },
    resetPassword: async (password: string) => {
        try {
            const response = await api.put(API_ROUTES.AUTH.RESET_PASSWORD, {
                password,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
        if (!refreshToken) {
            console.error('Nenhum refresh token fornecido');
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        if (!authService.isRefreshTokenValid(refreshToken)) {
            await secureStorageUtil.remove('accessToken');
            await secureStorageUtil.remove('refreshToken');
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        try {
            const response = await api.post<Login>(
                API_ROUTES.AUTH.REFRESH_TOKEN,
                { refresh_token: refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${refreshToken}`,
                    },
                },
            );

            if (!response.data?.accesstoken) {
                throw new Error('Resposta inválida do servidor');
            }

            console.log('Tokens recebidos:', {
                access: response.data.accesstoken?.slice(0, 10) + '...',
                refresh: response.data.refreshtoken?.slice(0, 10) + '...',
            });

            await secureStorageUtil.set(
                'accessToken',
                response.data.accesstoken,
            );
            if (response.data.refreshtoken) {
                await secureStorageUtil.set(
                    'refreshToken',
                    response.data.refreshtoken,
                );
            }

            return {
                accessToken: response.data.accesstoken,
                refreshToken: response.data.refreshtoken,
            };
        } catch (error) {
            console.error('Falha no refresh token:', error);

            await secureStorageUtil.remove('accessToken');
            await secureStorageUtil.remove('refreshToken');

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
