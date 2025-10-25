import { Contact } from '@/interfaces/contact';
import { api } from '../api';
import API_ROUTES from '../api/routes';

const contactService = {
    contacts: async (userId: string, search: string = '') => {
        try {
            const response = await api.get<Contact[]>(
                API_ROUTES.CONTACTS.CONTACTS({ userId }),
                { params: { search } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createContact: async (
        userId: string,
        data: {
            contactName: string;
            numberPhone: string;
        },
    ) => {
        try {
            const response = await api.post<Contact>(
                API_ROUTES.CONTACTS.CREATE_CONTACT({ userId }),
                {
                    name: data.contactName,
                    numberphone: data.numberPhone,
                },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    contact: async (userId: string, contactId: string) => {
        try {
            const response = await api.get<Contact>(
                API_ROUTES.CONTACTS.CONTACT({ userId, contactId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateContact: async (
        userId: string,
        contactId: string,
        data: {
            contactName?: string;
            numberPhone?: string;
        },
    ) => {
        try {
            const response = await api.put<Contact>(
                API_ROUTES.CONTACTS.UPDATE_CONTACT({ userId, contactId }),
                {
                    name: data.contactName,
                    numberphone: data.numberPhone,
                },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteContact: async (userId: string, contactId: string) => {
        try {
            const response = await api.delete(
                API_ROUTES.CONTACTS.DELETE_CONTACT({ userId, contactId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default contactService;
