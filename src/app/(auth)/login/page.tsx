'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { setCookie } from 'nookies';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import InputAuthField from '@/components/forms/InputAuthField';
import CustomButton from '@/components/buttons/CustomButton';
import userService from '@/services/domains/userService';
import { LoginFormData, loginValidationSchema } from '@/validations';
import { toast } from 'sonner';
import { accountManager } from '@/services/domains/accountManagerService';
import { Account } from '@/interfaces/account';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deviceId, setDeviceId] = useState<string>('');
    const [hasExistingAccounts, setHasExistingAccounts] = useState(false);
    const [existingAccounts, setExistingAccounts] = useState<Account[]>([]);
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
    const router = useRouter();

    useEffect(() => {
        let storedDeviceId = localStorage.getItem('deviceId');
        if (!storedDeviceId) {
            storedDeviceId = uuidv4();
            localStorage.setItem('deviceId', storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        const accounts = accountManager.getAllAccounts();
        const current = accountManager.getCurrentAccount();

        setExistingAccounts(accounts);
        setHasExistingAccounts(accounts.length > 0);
        setCurrentAccount(current);
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setValue,
        watch,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginValidationSchema),
    });

    const handleFormSubmit = async (
        data: LoginFormData,
        event?: React.BaseSyntheticEvent,
    ) => {
        if (event) {
            event.preventDefault();
        }

        if (!deviceId) {
            toast.error('Erro de dispositivo. Recarregue a página.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await userService.loginMulti({
                username: data.name,
                password: data.password,
                deviceId: deviceId,
                deviceName: 'Meu Dispositivo',
            });

            if (!response.success) {
                throw new Error('Falha no login');
            }

            accountManager.addAccount(response);
            accountManager.switchAccount(response.user.id);

            toast.success(`Bem-vindo, ${response.user.name}!`);
            router.replace('/contacts');
        } catch (error) {
            console.error('Erro no login:', error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Credenciais inválidas ou erro de conexão.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Login
                    </h1>
                    <p className="text-gray-600">
                        {hasExistingAccounts
                            ? 'Adicione outra conta ou troque de usuário'
                            : 'Faça login na sua conta'}
                    </p>
                </div>

                {hasExistingAccounts && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                            Contas logadas:
                        </h3>
                        <div className="space-y-2">
                            {existingAccounts.map((account) => (
                                <div
                                    key={account.userId}
                                    className={`flex items-center justify-between p-3 rounded border ${
                                        account.userId ===
                                        currentAccount?.userId
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {account.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {account.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {account.username}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        title={`Trocar para a conta ${account.name}`}
                                        aria-label={`Trocar para a conta ${account.name}`}
                                        type="button"
                                        onClick={() => {
                                            accountManager.switchAccount(
                                                account.userId,
                                            );
                                            router.replace('/contacts');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {account.userId ===
                                        currentAccount?.userId
                                            ? 'Atual'
                                            : 'Usar'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hasExistingAccounts && (
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                ou adicione nova conta
                            </span>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit((data) => handleFormSubmit(data, e))();
                    }}
                    className="space-y-6"
                >
                    <InputAuthField
                        type="username"
                        placeholder="Nome de usuário"
                        value={watch('name') || ''}
                        onChange={(value) => setValue('name', value)}
                        onBlur={() => {}}
                        touched={touchedFields.name}
                        error={errors.name?.message}
                    />

                    <InputAuthField
                        type="password"
                        placeholder="Senha"
                        value={watch('password') || ''}
                        onChange={(value) => setValue('password', value)}
                        onBlur={() => {}}
                        touched={touchedFields.password}
                        error={errors.password?.message}
                        showPassword={showPassword}
                        togglePasswordVisibility={() =>
                            setShowPassword(!showPassword)
                        }
                    />

                    <CustomButton
                        title="Entrar"
                        aria-label="Entrar"
                        type="submit"
                        text={
                            hasExistingAccounts ? 'Adicionar Conta' : 'Entrar'
                        }
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

                    <Link href="/registration" className="block w-full">
                        <CustomButton
                            title="Cadastre-se"
                            aria-label="Cadastre-se"
                            type="button"
                            text={
                                hasExistingAccounts
                                    ? 'Cadastrar uma Nova Conta'
                                    : 'Cadastre-se'
                            }
                            className="w-full bg-transparent ring-1 ring-primary"
                        />
                    </Link>
                </form>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
                        <p>
                            <strong>Device ID:</strong> {deviceId}
                        </p>
                        <p>
                            <strong>Contas:</strong> {existingAccounts.length}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
