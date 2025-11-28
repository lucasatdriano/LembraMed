import { setCookie } from 'nookies';
import { api } from '../api';
import API_ROUTES from '../api/routes';

export interface User {
    id: string;
    name: string;
    username: string;
    createdat: string;
}

export interface RegisterRequest {
    name: string;
    password: string;
}

export interface LoginMultiRequest {
    username: string;
    password: string;
    deviceId: string;
    deviceName?: string;
}

export interface LoginResponse {
    success: boolean;
    user: {
        id: string;
        name: string;
        username: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
    deviceId: string;
}

export interface LogoutRequest {
    userid: string;
    deviceId: string;
}

const userService = {
    register: async (data: RegisterRequest) => {
        try {
            const response = await api.post<User>(
                API_ROUTES.USERS.REGISTER,
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    loginMulti: async (data: LoginMultiRequest): Promise<LoginResponse> => {
        try {
            const response = await api.post<LoginResponse>(
                API_ROUTES.USERS.LOGIN_MULTI,
                data,
            );

            if (response.data.success) {
                setCookie(
                    null,
                    'accessToken',
                    response.data.tokens.accessToken,
                    {
                        maxAge: 60 * 60, // 1h
                        path: '/',
                    },
                );

                setCookie(
                    null,
                    'refreshToken',
                    response.data.tokens.refreshToken,
                    {
                        maxAge: 60 * 24 * 60 * 60, // 60d
                        path: '/',
                    },
                );

                setCookie(null, 'deviceId', response.data.deviceId, {
                    maxAge: 60 * 24 * 60 * 60, // 60d
                    path: '/',
                });

                setCookie(null, 'userId', response.data.user.id, {
                    maxAge: 60 * 24 * 60 * 60, // 60d
                    path: '/',
                });

                if (typeof window !== 'undefined') {
                    localStorage.setItem(
                        'currentAccount',
                        JSON.stringify({
                            userId: response.data.user.id,
                            username: response.data.user.username,
                            name: response.data.user.name,
                        }),
                    );
                }
            }

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getProfile: async (userId: string): Promise<User> => {
        try {
            const response = await api.get<User>(
                API_ROUTES.USERS.PROFILE({ userId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async (data: LogoutRequest) => {
        try {
            const response = await api.post(API_ROUTES.USERS.LOGOUT, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;
