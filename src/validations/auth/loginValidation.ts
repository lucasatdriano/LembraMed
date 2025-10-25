import { z } from 'zod';

export const loginValidationSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome de usuário obrigatório')
        .max(50, 'Nome muito longo'),
    password: z
        .string()
        .min(4, 'A senha deve ter no mínimo 4 caracteres')
        .max(100, 'Senha muito longa'),
});

export type LoginFormData = z.infer<typeof loginValidationSchema>;
