import { Contact, ContactsResponse } from '@/interfaces/contact';
import { api } from '../api';
import API_ROUTES from '../api/routes';

const contactService = {
    searchContacts: async (
        userId: string,
        search: string = '',
        page: number = 1,
        limit: number = 12,
    ): Promise<ContactsResponse> => {
        try {
            const response = await api.get<ContactsResponse>(
                API_ROUTES.CONTACTS.SEARCH_CONTACTS({ userId }),
                { params: { search, page, limit } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getContacts: async (
        userId: string,
        page: number = 1,
        limit: number = 12,
    ): Promise<ContactsResponse> => {
        try {
            const response = await api.get<ContactsResponse>(
                API_ROUTES.CONTACTS.CONTACT({ userId }),
                { params: { page, limit } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getContact: async (userId: string, contactId: string) => {
        try {
            const response = await api.get<Contact>(
                API_ROUTES.CONTACTS.CONTACT({ userId, contactId }),
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
