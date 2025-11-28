import { Medication, MedicationsResponse } from '@/interfaces/medication';
import {
    MedicationHistory,
    MedicationHistoryResponse,
} from '@/interfaces/medicationHistory';
import { api } from '../api';
import API_ROUTES from '../api/routes';

export interface CreateMedicationRequest {
    name: string;
    hourfirstdose: string;
    intervalinhours: number;
    periodstart?: string;
    periodend?: string;
}

export interface UpdateMedicationRequest {
    name?: string;
    hournextdose?: string;
    periodstart?: string;
    periodend?: string;
    intervalinhours?: number;
    status?: boolean;
}

export interface MedicationHistoryFilters {
    startDate?: string;
    endDate?: string;
    status?: 'taken' | 'missed' | 'all';
    page?: number;
    limit?: number;
}

const medicationService = {
    searchMedications: async (
        userId: string,
        search: string = '',
        page: number = 1,
        limit: number = 12,
    ): Promise<MedicationsResponse> => {
        try {
            const response = await api.get<MedicationsResponse>(
                API_ROUTES.MEDICATIONS.SEARCH_MEDICATIONS({ userId }),
                { params: { search, page, limit } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUserMedications: async (
        userId: string,
        page: number = 1,
        limit: number = 12,
    ): Promise<MedicationsResponse> => {
        try {
            const response = await api.get<MedicationsResponse>(
                API_ROUTES.MEDICATIONS.MEDICATION({ userId }),
                { params: { page, limit } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMedication: async (userId: string, medicationId: string) => {
        try {
            const response = await api.get<Medication>(
                API_ROUTES.MEDICATIONS.MEDICATION({ userId, medicationId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMedicationHistory: async (
        userId: string,
        medicationId: string,
        filters?: MedicationHistoryFilters,
    ): Promise<MedicationHistoryResponse> => {
        try {
            const params: Record<string, string> = {};

            if (filters?.startDate) params.startDate = filters.startDate;
            if (filters?.endDate) params.endDate = filters.endDate;
            if (filters?.status && filters.status !== 'all')
                params.status = filters.status;
            if (filters?.page) params.page = filters.page.toString();
            if (filters?.limit) params.limit = filters.limit.toString();

            const response = await api.get<MedicationHistoryResponse>(
                API_ROUTES.MEDICATIONS.MEDICATION_HISTORY({
                    userId,
                    medicationId,
                }),
                { params },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createMedication: async (userId: string, data: CreateMedicationRequest) => {
        try {
            const response = await api.post<Medication>(
                API_ROUTES.MEDICATIONS.CREATE_MEDICATION({ userId }),
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    markAsTaken: async (userId: string, medicationId: string) => {
        try {
            const response = await api.post<{
                message: string;
                medication: Medication;
            }>(API_ROUTES.MEDICATIONS.MARK_AS_TAKEN({ userId, medicationId }));
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    registerMissedDose: async (userId: string, medicationId: string) => {
        try {
            const response = await api.post<{
                message: string;
            }>(
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

    forceDoseAdvance: async (medicationId: string, userid: string) => {
        try {
            const response = await api.post<{
                message: string;
                medication: Medication;
            }>(API_ROUTES.MEDICATIONS.FORCE_DOSE_ADVANCE({ medicationId }), {
                userid,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateMedication: async (
        userId: string,
        medicationId: string,
        data: UpdateMedicationRequest,
    ) => {
        try {
            const response = await api.put<{
                success: boolean;
                message: string;
                medication: Medication;
            }>(
                API_ROUTES.MEDICATIONS.UPDATE_MEDICATION({
                    userId,
                    medicationId,
                }),
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteMedication: async (userId: string, medicationId: string) => {
        try {
            const response = await api.delete<{
                success: boolean;
                message: string;
            }>(
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
