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
    // ⚠️ REMOVIDO: status não pode ser atualizado diretamente!
    // Use registerPendingConfirmation ou cancelPendingDose
}

export interface MedicationHistoryFilters {
    startDate?: string;
    endDate?: string;
    status?: 'taken' | 'missed' | 'all';
    page?: number;
    limit?: number;
}

// 🟢 NOVOS TIPOS PARA O FLUXO DE CONFIRMAÇÃO
export interface PendingConfirmationResponse {
    message: string;
    medication: Medication & {
        pendingConfirmation: boolean;
        pendingUntil: string;
    };
}

export interface ConfirmDoseResponse {
    message: string;
    medication: Medication;
}

const medicationService = {
    searchMedications: async (
        search: string = '',
        page: number = 1,
        limit: number = 12,
    ): Promise<MedicationsResponse> => {
        try {
            const response = await api.get<MedicationsResponse>(
                API_ROUTES.MEDICATIONS.SEARCH_MEDICATIONS,
                { params: { search, page, limit } },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMedication: async (medicationId: string) => {
        try {
            // ⚠️ REMOVER CHECK_AND_UPDATE - isso é responsabilidade do scheduler!
            // await api.post(API_ROUTES.MEDICATIONS.CHECK_AND_UPDATE({ medicationId }));

            const response = await api.get<Medication>(
                API_ROUTES.MEDICATIONS.MEDICATION({ medicationId }),
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMedicationHistory: async (
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
                    medicationId,
                }),
                { params },
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createMedication: async (data: CreateMedicationRequest) => {
        try {
            const response = await api.post<Medication>(
                API_ROUTES.MEDICATIONS.CREATE_MEDICATION,
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ✅ NOVO: Iniciar confirmação de 3 minutos
    registerPendingConfirmation: async (medicationId: string) => {
        try {
            const response = await api.post<PendingConfirmationResponse>(
                API_ROUTES.MEDICATIONS.REGISTER_PENDING_CONFIRMATION({
                    medicationId,
                }),
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao registrar confirmação pendente:', error);
            throw error;
        }
    },

    // ✅ NOVO: Cancelar confirmação pendente
    cancelPendingDose: async (medicationId: string) => {
        try {
            const response = await api.post<ConfirmDoseResponse>(
                API_ROUTES.MEDICATIONS.CANCEL_PENDING_DOSE({ medicationId }),
            );
            return response.data;
        } catch (error) {
            console.error('Erro ao cancelar confirmação:', error);
            throw error;
        }
    },

    updateMedication: async (
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
                    medicationId,
                }),
                data,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteMedication: async (medicationId: string) => {
        try {
            const response = await api.delete<{
                success: boolean;
                message: string;
            }>(
                API_ROUTES.MEDICATIONS.DELETE_MEDICATION({
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
