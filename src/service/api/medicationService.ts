import { AxiosError } from 'axios';
import API_ROUTES from '@/src/service/routes';
import api from '@/src/service/index';

const medicationService = {
    medications: async (userId: string) => {
        try {
            const response = await api.get(
                API_ROUTES.MEDICATIONS.MEDICATIONS({ userId }),
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
    createMedication: async (
        userId: string,
        medicationName: string,
        numberPhone: string,
        hourFirstDose: string,
        intervalInHours: number,
        periodStart?: string,
        periodEnd?: string,
    ) => {
        try {
            const response = await api.post(
                API_ROUTES.MEDICATIONS.CREATE_MEDICATION({ userId }),
                {
                    medicationName,
                    numberPhone,
                    hourFirstDose,
                    intervalInHours,
                    periodStart,
                    periodEnd,
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
    medication: async (userId: string, medicationId: string) => {
        try {
            const response = await api.get(
                API_ROUTES.MEDICATIONS.MEDICATION({ userId, medicationId }),
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
    updateMedication: async (
        userId: string,
        medicationId: string,
        medicationName?: string,
        hourFirstDose?: string,
        intervalInHours?: number,
        periodStart?: string,
        periodEnd?: string,
    ) => {
        try {
            const response = await api.put(
                API_ROUTES.MEDICATIONS.UPDATE_MEDICATION({
                    userId,
                    medicationId,
                }),
                {
                    medicationName,
                    hourFirstDose,
                    intervalInHours,
                    periodStart,
                    periodEnd,
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
    deleteMedication: async (userId: string, medicationId: string) => {
        try {
            const response = await api.delete(
                API_ROUTES.MEDICATIONS.DELETE_MEDICATION({
                    userId,
                    medicationId,
                }),
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

export default medicationService;
