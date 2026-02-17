import { Contact, ContactsResponse } from '@/interfaces/contact';
import { api } from '../api';
import API_ROUTES from '../api/routes';
import { toast } from 'sonner';

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

            toast.success('Contato criado com sucesso!');
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
                    toast.error(errorData.error || 'Erro ao criar contato');
                }
            } else {
                toast.error('Erro ao criar contato. Tente novamente.');
            }
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

            toast.success('Contato atualizado com sucesso!');
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
                    toast.error(errorData.error || 'Erro ao atualizar contato');
                }
            } else {
                toast.error('Erro ao atualizar contato. Tente novamente.');
            }
            throw error;
        }
    },

    deleteContact: async (contactId: string) => {
        try {
            const response = await api.delete(
                API_ROUTES.CONTACTS.DELETE_CONTACT({ contactId }),
            );

            toast.success('Contato removido com sucesso!');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.error('Contato não encontrado');
            } else {
                toast.error('Erro ao remover contato. Tente novamente.');
            }
            throw error;
        }
    },
};

export default contactService;
