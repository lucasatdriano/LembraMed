import { AxiosError } from 'axios';
import API_ROUTES from '@/src/service/routes';
import api from '@/src/service/index';

const contactService = {
    contacts: async (userId: string) => {
        try {
            const response = await api.get(
                API_ROUTES.CONTACTS.CONTACTS({ userId }),
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
    createContact: async (
        userId: string,
        contactName: string,
        numberPhone: string,
    ) => {
        try {
            const response = await api.post(
                API_ROUTES.CONTACTS.CREATE_CONTACT({ userId }),
                {
                    name: contactName,
                    numberPhone,
                },
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
    contact: async (userId: string, contactId: string) => {
        try {
            const response = await api.get(
                API_ROUTES.CONTACTS.CONTACT({ userId, contactId }),
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
    updateContact: async (
        userId: string,
        contactId: string,
        contactName?: string,
        numberPhone?: string,
    ) => {
        try {
            const response = await api.put(
                API_ROUTES.CONTACTS.UPDATE_CONTACT({ userId, contactId }),
                {
                    contactName,
                    numberPhone,
                },
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
    deleteContact: async (userId: string, contactId: string) => {
        try {
            const response = await api.delete(
                API_ROUTES.CONTACTS.DELETE_CONTACT({ userId, contactId }),
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

export default contactService;
