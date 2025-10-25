import { z } from 'zod';

export const contactValidationSchema = z.object({
    contactName: z.string().min(1, 'Nome do contato é obrigatório'),
    phoneNumber: z.string().min(1, 'Número de telefone é obrigatório'),
});

export type ContactFormData = z.infer<typeof contactValidationSchema>;
