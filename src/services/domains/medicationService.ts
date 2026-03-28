import { Medication, MedicationsResponse } from '@/interfaces/medication';
import { MedicationHistoryResponse } from '@/interfaces/medicationHistory';
import { api } from '../api';
import API_ROUTES from '../api/routes';
import { toast } from 'sonner';

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
}

export interface MedicationHistoryFilters {
    startDate?: string;
    endDate?: string;
    doseStatus?: 'taken' | 'missed' | 'all';
    page?: number;
    limit?: number;
}

export interface PendingConfirmationResponse {
    message: string;
    medication: Medication;
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
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.info('Nenhum medicamento encontrado');
            } else {
                toast.error('Erro ao buscar medicamentos');
            }
            throw error;
        }
    },

    getMedication: async (medicationId: string) => {
        try {
            const response = await api.get<Medication>(
                API_ROUTES.MEDICATIONS.MEDICATION({ medicationId }),
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.error('Medicamento não encontrado');
            } else {
                toast.error('Erro ao buscar medicamento');
            }
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
            if (filters?.doseStatus && filters.doseStatus !== 'all')
                params.doseStatus = filters.doseStatus;
            if (filters?.page) params.page = filters.page.toString();
            if (filters?.limit) params.limit = filters.limit.toString();

            const response = await api.get<MedicationHistoryResponse>(
                API_ROUTES.MEDICATIONS.MEDICATION_HISTORY({
                    medicationId,
                }),
                { params },
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.info('Nenhum histórico encontrado');
            } else {
                toast.error('Erro ao buscar histórico');
            }
            throw error;
        }
    },

    createMedication: async (data: CreateMedicationRequest) => {
        try {
            const response = await api.post<Medication>(
                API_ROUTES.MEDICATIONS.CREATE_MEDICATION,
                data,
            );

            toast.success('Medicamento criado com sucesso!');
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
                    toast.error(errorData.error || 'Erro ao criar medicamento');
                }
            } else {
                toast.error('Erro ao criar medicamento. Tente novamente.');
            }
            throw error;
        }
    },

    registerPendingConfirmation: async (medicationId: string) => {
        try {
            const response = await api.post<PendingConfirmationResponse>(
                API_ROUTES.MEDICATIONS.REGISTER_PENDING_CONFIRMATION({
                    medicationId,
                }),
            );

            toast.success(response.data.message);
            return response.data;
        } catch (error: any) {
            console.error('Erro ao registrar confirmação pendente:', error);

            if (error.response?.status === 400) {
                const errorData = error.response.data;

                if (errorData.error) {
                    toast.error(errorData.error);
                } else if (Array.isArray(errorData.details)) {
                    errorData.details.forEach((err: string) => {
                        toast.error(err);
                    });
                } else {
                    toast.error('Não foi possível marcar como tomado');
                }
            } else if (error.response?.status === 404) {
                toast.error('Medicamento não encontrado');
            } else {
                toast.error('Erro ao registrar confirmação');
            }
            throw error;
        }
    },

    cancelPendingDose: async (medicationId: string) => {
        try {
            const response = await api.post<ConfirmDoseResponse>(
                API_ROUTES.MEDICATIONS.CANCEL_PENDING_DOSE({ medicationId }),
            );

            toast.info('Confirmação da dose cancelada');
            return response.data;
        } catch (error: any) {
            console.error('Erro ao cancelar confirmação:', error);

            if (error.response?.status === 404) {
                toast.error('Medicamento não encontrado');
            } else {
                toast.error('Erro ao cancelar confirmação');
            }
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

            toast.success('Medicamento atualizado com sucesso!');
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
                    toast.error(
                        errorData.error || 'Erro ao atualizar medicamento',
                    );
                }
            } else if (error.response?.status === 404) {
                toast.error('Medicamento não encontrado');
            } else {
                toast.error('Erro ao atualizar medicamento. Tente novamente.');
            }
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

            toast.success(
                response.data.message || 'Medicamento removido com sucesso!',
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.error('Medicamento não encontrado');
            } else if (error.response?.status === 400) {
                const errorData = error.response.data;
                toast.error(errorData.error || 'Erro ao remover medicamento');
            } else {
                toast.error('Erro ao remover medicamento. Tente novamente.');
            }
            throw error;
        }
    },
};

export default medicationService;
