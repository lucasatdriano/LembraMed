import { z } from 'zod';

export const registerValidationSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Nome de usuário obrigatório')
            .max(50, 'Nome muito longo'),
        password: z
            .string()
            .min(4, 'A senha deve ter no mínimo 4 caracteres')
            .max(100, 'Senha muito longa'),
        confirmPassword: z.string().min(1, 'Confirmação de senha obrigatória'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas devem ser iguais',
        path: ['confirmPassword'],
    });

export type RegisterFormData = z.infer<typeof registerValidationSchema>;
