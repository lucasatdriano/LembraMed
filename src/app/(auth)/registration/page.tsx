'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import CustomButton from '@/components/buttons/CustomButton';
import userService from '@/services/domains/userService';
import { RegisterFormData, registerValidationSchema } from '@/validations';
import InputAuthField from '@/components/forms/InputAuthField';
import { toast } from 'sonner';

export default function RegistrationPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setValue,
        watch,
        reset,
        trigger,
        setFocus,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerValidationSchema),
        mode: 'onChange',
    });

    const handleFormSubmit = async (data: RegisterFormData) => {
        console.log('apertou');
        setIsLoading(true);
        try {
            console.log(data);
            await userService.register(data.name, data.password);

            reset();
            toast.success(
                'Cadastro realizado com sucesso! Faça login para continuar.',
            );
            router.replace('/login');
        } catch (error) {
            console.error('Erro no cadastro:', error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Ocorreu um erro ao se cadastrar.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldChange = (
        fieldName: keyof RegisterFormData,
        value: string,
    ) => {
        setValue(fieldName, value, {
            shouldValidate: true,
            shouldTouch: true,
        });
    };

    const handleFieldBlur = (fieldName: keyof RegisterFormData) => {
        trigger(fieldName);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Cadastrar
                </h1>

                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className="space-y-6"
                >
                    <InputAuthField
                        type="username"
                        placeholder="Nome de usuário"
                        value={watch('name') || ''}
                        onChange={(value) => handleFieldChange('name', value)}
                        onBlur={() => handleFieldBlur('name')}
                        touched={touchedFields.name}
                        error={errors.name?.message}
                    />

                    <InputAuthField
                        type="password"
                        placeholder="Senha"
                        value={watch('password') || ''}
                        onChange={(value) =>
                            handleFieldChange('password', value)
                        }
                        onBlur={() => handleFieldBlur('password')}
                        touched={touchedFields.password}
                        error={errors.password?.message}
                        showPassword={showPassword}
                        togglePasswordVisibility={() =>
                            setShowPassword(!showPassword)
                        }
                    />

                    <InputAuthField
                        type="confirmPassword"
                        placeholder="Confirme sua senha"
                        value={watch('confirmPassword') || ''}
                        onChange={(value) =>
                            handleFieldChange('confirmPassword', value)
                        }
                        onBlur={() => handleFieldBlur('confirmPassword')}
                        touched={touchedFields.confirmPassword}
                        error={errors.confirmPassword?.message}
                        showPassword={showConfirmPassword}
                        togglePasswordVisibility={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    />

                    <CustomButton
                        title="Cadastrar"
                        aria-label="Cadastrar"
                        type="submit"
                        text="Cadastrar"
                        loading={isLoading}
                        disabled={isLoading}
                        className="w-full"
                    />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                ou
                            </span>
                        </div>
                    </div>

                    <Link href="/login" className="block w-full">
                        <CustomButton
                            title="Ir para o Login"
                            aria-label="Ir para o Login"
                            type="button"
                            text="Ir para o Login"
                            className="w-full bg-transparent ring-1 ring-primary"
                        />
                    </Link>
                </form>
            </div>
        </div>
    );
}
