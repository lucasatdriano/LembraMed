import { setCookie, destroyCookie } from 'nookies';
import API_ROUTES from '../api/routes';
import { api } from '../api';

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
    deviceId: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

interface AuthService {
    forgotPassword: (email: string) => Promise<any>;
    resetPassword: (token: string, newPassword: string) => Promise<any>;
    refreshToken: (
        refreshToken: string,
        deviceId: string,
    ) => Promise<TokenResponse>;
    isTokenValid: (token: string) => boolean;
    logout: () => void;
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

    resetPassword: async (token: string, newPassword: string) => {
        try {
            const response = await api.put(API_ROUTES.AUTH.RESET_PASSWORD, {
                token,
                newPassword,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    refreshToken: async (
        refreshToken: string,
        deviceId: string,
    ): Promise<TokenResponse> => {
        if (!refreshToken || !deviceId) {
            console.error('Refresh token ou deviceId não fornecidos');
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        if (!authService.isTokenValid(refreshToken)) {
            authService.logout();
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        try {
            const response = await api.post<TokenResponse>(
                API_ROUTES.AUTH.REFRESH_TOKEN,
                {
                    refreshToken,
                    deviceId,
                },
            );

            if (!response.data?.accessToken) {
                throw new Error('Resposta inválida do servidor');
            }

            console.log('Tokens renovados com sucesso:', {
                access: response.data.accessToken?.slice(0, 10) + '...',
                refresh: response.data.refreshToken?.slice(0, 10) + '...',
            });

            setCookie(null, 'accessToken', response.data.accessToken, {
                maxAge: 60 * 60, // 1h
                path: '/',
            });

            setCookie(null, 'refreshToken', response.data.refreshToken, {
                maxAge: 60 * 24 * 60 * 60, // 60d
                path: '/',
            });

            setCookie(null, 'deviceId', deviceId, {
                maxAge: 60 * 24 * 60 * 60, // 60d
                path: '/',
            });

            return {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
            };
        } catch (error) {
            console.error('Falha no refresh token:', error);

            authService.logout();

            throw new Error('Falha ao renovar sessão');
        }
    },

    isTokenValid: (token: string): boolean => {
        try {
            if (!token) return false;

            const parts = token.split('.');
            if (parts.length !== 3) return false;

            const base64Url = parts[1];
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

            const currentTime = Date.now() / 1000;
            return payload?.exp > currentTime;
        } catch (error) {
            console.error('Token inválido:', error);
            return false;
        }
    },

    logout: () => {
        try {
            destroyCookie(null, 'accessToken');
            destroyCookie(null, 'refreshToken');
            destroyCookie(null, 'deviceId');
            destroyCookie(null, 'userId');

            if (typeof window !== 'undefined') {
                localStorage.removeItem('currentAccount');
                sessionStorage.clear();
            }

            console.log('Logout realizado com sucesso');
        } catch (error) {
            console.error('Erro durante logout:', error);
        }
    },
};

export default authService;
