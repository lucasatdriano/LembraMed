import { Contact, ContactsResponse } from '@/interfaces/contact';
import { api } from '../api';
import API_ROUTES from '../api/routes';

const contactService = {
    searchContacts: async (
        search: string = '',
        page: number = 1,
        limit: number = 12,
    ): Promise<ContactsResponse> => {
        try {
            const response = await api.get<ContactsResponse>(
                API_ROUTES.CONTACTS.SEARCH_CONTACTS,
                { params: { search, page, limit } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getContact: async (contactId: string) => {
        try {
            const response = await api.get<Contact>(
                API_ROUTES.CONTACTS.CONTACT({ contactId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createContact: async (data: {
        contactName: string;
        numberPhone: string;
    }) => {
        try {
            const response = await api.post<Contact>(
                API_ROUTES.CONTACTS.CREATE_CONTACT,
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
        contactId: string,
        data: {
            contactName?: string;
            numberPhone?: string;
        },
    ) => {
        try {
            const response = await api.put<Contact>(
                API_ROUTES.CONTACTS.UPDATE_CONTACT({ contactId }),
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

    deleteContact: async (contactId: string) => {
        try {
            const response = await api.delete(
                API_ROUTES.CONTACTS.DELETE_CONTACT({ contactId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default contactService;
