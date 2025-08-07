import { Medication } from '@/src/interfaces/medication';
import api from '../api/index';
import API_ROUTES from '../api/routes';

const medicationService = {
    medications: async (userId: string, search: string = '') => {
        try {
            const response = await api.get<Medication[]>(
                API_ROUTES.MEDICATIONS.MEDICATIONS({ userId }),
                { params: { search } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    medication: async (userId: string, medicationId: string) => {
        try {
            const response = await api.get<Medication>(
                API_ROUTES.MEDICATIONS.MEDICATION({ userId, medicationId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    medicationHistory: async (userId: string, medicationId: string) => {
        try {
            const response = await api.get(
                API_ROUTES.MEDICATIONS.MEDICATION_HISTORY({
                    userId,
                    medicationId,
                }),
            );
            return response.data;
        } catch (error) {
            throw error;
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
            const response = await api.post<Medication>(
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
            throw error;
        }
    },
    registerMissedDose: async (userId: string, medicationId: string) => {
        try {
            const response = await api.post(
                API_ROUTES.MEDICATIONS.REGISTER_MISSED_DOSE({
                    userId,
                    medicationId,
                }),
            );
            return response.data;
        } catch (error) {
            throw error;
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
            status?: boolean;
        },
    ) => {
        try {
            const response = await api.put<Medication>(
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
                    status: data.status,
                },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateMedicationStatus: async (
        userId: string,
        medicationId: string,
        data: {
            status: boolean;
        },
    ) => {
        try {
            const response = await api.put(
                API_ROUTES.MEDICATIONS.UPDATE_STATUS_MEDICATION({
                    userId,
                    medicationId,
                }),
                {
                    status: data.status,
                },
            );
            return response.data;
        } catch (error) {
            throw error;
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
            throw error;
        }
    },
};

export default medicationService;
