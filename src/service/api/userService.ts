import { AxiosError } from 'axios';
import API_ROUTES from '@/src/service/routes';
import api from '@/src/service/index';

const userService = {
    register: async (name: string, email: string, password: string) => {
        try {
            const response = await api.post(API_ROUTES.USERS.REGISTER, {
                name,
                email,
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
    login: async (email: string, password: string) => {
        try {
            const reponse = await api.post(API_ROUTES.USERS.LOGIN, {
                email,
                password,
            });
            return reponse.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const errorMessage = `${error.response.data.error} - ${error.response.data.details}`;
                throw new Error(errorMessage);
            }
            throw new Error('Erro ao conectar ao servidor.');
        }
    },
    profile: async (userId: string) => {
        try {
            const response = await api.get(
                API_ROUTES.USERS.PROFILE({ userId }),
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const errorMessage = `${error.response.data.error} - ${error.response.data.details}`;
                throw new Error(errorMessage);
            }
            throw new Error('Erro ao conectar ao servidor.');
        }
    },
    logout: async (userId: string) => {
        try {
            const response = await api.post(
                API_ROUTES.USERS.LOGOUT({ userId }),
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data) {
                const errorMessage = `${error.response.data.error} - ${error.response.data.details}`;
                throw new Error(errorMessage);
            }
            throw new Error('Erro ao conectar ao servidor.');
        }
    },
};

export default userService;
