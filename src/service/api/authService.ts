import { AxiosError } from 'axios';
import API_ROUTES from '@/src/service/routes';
import api from '@/src/service/index';
import { localStorageUtil } from '@/src/util/localStorageUtil';

const authService = {
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
    refreshToken: async (refreshToken: string) => {
        if (!refreshToken) {
            throw new Error('Refresh token não encontrado');
        }

        const isRefreshTokenValid = (refreshToken: string) => {
            try {
                const payloadBase64 = refreshToken.split('.')[1];
                const payload = JSON.parse(atob(payloadBase64));
                console.log('Refresh token decodificado:', payload);

                return (
                    payload && payload.exp && payload.exp > Date.now() / 1000
                );
            } catch (error) {
                console.error('Erro ao decodificar o refresh token:', error);
                return false;
            }
        };

        if (!isRefreshTokenValid(refreshToken)) {
            throw new Error('Refresh token expirado ou inválido');
        }

        try {
            const response = await api.post(API_ROUTES.AUTH.REFRESH_TOKEN, {
                refreshToken,
            });

            if (!response.data.accessToken) {
                throw new Error('Access token não encontrado na resposta');
            }

            const { accessToken, refreshToken: newRefreshToken } =
                response.data;

            await localStorageUtil.set('accessToken', accessToken);
            if (newRefreshToken) {
                await localStorageUtil.set('refreshToken', newRefreshToken);
            }

            console.log('Token renovado com sucesso!');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const errorMessage = `${error.response.data.error} - ${error.response.data.details}`;
                console.error('Erro na requisição:', errorMessage);
                throw new Error(errorMessage);
            }
            console.error('Erro ao conectar ao servidor:', error);
            throw new Error('Erro ao conectar ao servidor.');
        }
    },
};

export default authService;
