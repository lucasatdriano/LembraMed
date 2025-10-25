import { z } from 'zod';

export const updateMedicationValidationSchema = z.object({
    medicationName: z.string().min(1, 'Nome do remédio é obrigatório'),
    interval: z.string().min(1, 'Intervalo é obrigatório'),
    period: z.string().nullable().optional(),
});

export type UpdateMedicationFormData = z.infer<
    typeof updateMedicationValidationSchema
>;
