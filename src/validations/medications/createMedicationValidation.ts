import { z } from 'zod';

export const medicationValidationSchema = z.object({
    medicationName: z.string().min(1, 'Nome do remédio é obrigatório'),
    hour: z.string().min(1, 'Horário é obrigatório'),
    interval: z.string().min(1, 'Intervalo é obrigatório'),
    period: z.string().nullable().optional(),
});

export type MedicationFormData = z.infer<typeof medicationValidationSchema>;
