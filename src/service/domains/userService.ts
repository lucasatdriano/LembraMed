import { Login } from '@/src/interfaces/login';
import api from '../api/index';
import API_ROUTES from '../api/routes';

const userService = {
    register: async (name: string, password: string) => {
        try {
            const response = await api.post(API_ROUTES.USERS.REGISTER, {
                name,
                password,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    login: async (name: string, password: string) => {
        try {
            const reponse = await api.post<Login>(API_ROUTES.USERS.LOGIN, {
                name,
                password,
            });
            return reponse.data;
        } catch (error) {
            throw error;
        }
    },
    profile: async (userId: string) => {
        try {
            const response = await api.get<Login>(
                API_ROUTES.USERS.PROFILE({ userId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logout: async (userId: string) => {
        try {
            const response = await api.post(
                API_ROUTES.USERS.LOGOUT({ userId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;
