import { setCookie } from 'nookies';
import { api } from '../api';
import API_ROUTES from '../api/routes';
import { toast } from 'sonner';

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
    deviceId: string;
}

const userService = {
    register: async (data: RegisterRequest) => {
        try {
            const response = await api.post<User>(
                API_ROUTES.USERS.REGISTER,
                data,
            );

            toast.success('Cadastro realizado com sucesso!');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                const errorData = error.response.data;

                if (Array.isArray(errorData.details)) {
                    errorData.details.forEach((err: string) => {
                        toast.error(err);
                    });
                } else if (errorData.details) {
                    toast.error(errorData.details);
                } else {
                    toast.error(errorData.error || 'Erro ao cadastrar');
                }
            } else if (error.response?.status === 409) {
                toast.error(
                    'Este nome de usuário já está em uso. Tente outro.',
                );
            } else {
                toast.error('Erro ao cadastrar. Tente novamente.');
            }
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

                toast.success(`Bem-vindo, ${response.data.user.name}!`);
            }

            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                const errorData = error.response.data;

                if (Array.isArray(errorData.details)) {
                    errorData.details.forEach((err: string) => {
                        toast.error(err);
                    });
                } else if (errorData.details) {
                    toast.error(errorData.details);
                } else {
                    toast.error(errorData.error || 'Erro ao fazer login');
                }
            } else if (error.response?.status === 401) {
                toast.error('Credenciais inválidas');
            } else {
                toast.error('Erro ao fazer login. Tente novamente.');
            }
            throw error;
        }
    },

    getProfile: async (): Promise<User> => {
        try {
            const response = await api.get<User>(API_ROUTES.USERS.PROFILE);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async (data: LogoutRequest) => {
        try {
            const response = await api.post(API_ROUTES.USERS.LOGOUT, data);

            setCookie(null, 'accessToken', '', { maxAge: -1, path: '/' });
            setCookie(null, 'refreshToken', '', { maxAge: -1, path: '/' });
            setCookie(null, 'deviceId', '', { maxAge: -1, path: '/' });

            if (typeof window !== 'undefined') {
                localStorage.removeItem('currentAccount');
            }

            toast.success('Logout realizado com sucesso!');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error('Erro ao fazer logout');
            } else {
                toast.error('Erro ao fazer logout. Tente novamente.');
            }
            throw error;
        }
    },
};

export default userService;
