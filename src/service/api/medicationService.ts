import { AxiosError } from 'axios';
import API_ROUTES from '@/src/service/routes';
import api from '@/src/service/index';

const medicationService = {
    medications: async (userId: string, search: string = '') => {
        try {
            const response = await api.get(
                API_ROUTES.MEDICATIONS.MEDICATIONS({ userId }),
                { params: { search } },
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
        data: {
            medicationName: string;
            hourFirstDose: string;
            intervalInHours: number;
            periodStart?: string;
            periodEnd?: string;
        },
    ) => {
        try {
            const response = await api.post(
                API_ROUTES.MEDICATIONS.CREATE_MEDICATION({ userId }),
                {
                    name: data.medicationName,
                    hourfirstdose: data.hourFirstDose,
                    intervalinhours: data.intervalInHours,
                    periodstart: data.periodStart,
                    periodend: data.periodEnd,
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
        data: {
            medicationName?: string;
            hourNextDose?: string;
            intervalInHours?: number;
            periodStart?: string;
            periodEnd?: string;
        },
    ) => {
        try {
            const response = await api.put(
                API_ROUTES.MEDICATIONS.UPDATE_MEDICATION({
                    userId,
                    medicationId,
                }),
                {
                    name: data.medicationName,
                    hournextdose: data.hourNextDose,
                    intervalinhours: data.intervalInHours,
                    periodstart: data.periodStart,
                    periodend: data.periodEnd,
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
