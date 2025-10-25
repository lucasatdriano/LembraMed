'use client';

import { accountManager } from '@/services/domains/accountManagerService';
import React, { Fragment } from 'react';
import { toast } from 'sonner';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, LogOut, User } from 'lucide-react';

interface UserSwitcherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccountSwitch?: () => void;
}

export default function UserSwitcherModal({
    isOpen,
    onClose,
    onAccountSwitch,
}: UserSwitcherModalProps) {
    const accounts = accountManager.getAllAccounts();
    const currentAccount = accountManager.getCurrentAccount();

    const handleSwitchAccount = (userId: string) => {
        try {
            accountManager.switchAccount(userId);
            toast.success(
                `Conta alterada para ${
                    accountManager.getCurrentAccount()?.name
                }`,
            );
            onAccountSwitch?.();
            onClose();
        } catch (error) {
            toast.error('Erro ao alternar conta');
        }
    };

    const handleAddAccount = () => {
        onClose();
        window.location.href = '/login';
    };

    const handleLogoutAccount = (userId: string, accountName: string) => {
        if (accounts.length <= 1) {
            toast.error('Não é possível sair da única conta logada');
            return;
        }

        if (window.confirm(`Deseja sair da conta ${accountName}?`)) {
            accountManager.logoutAccount(userId);
            toast.success(`Conta ${accountName} removida`);

            if (userId === currentAccount?.userId) {
                const remainingAccounts = accountManager.getAllAccounts();
                if (remainingAccounts.length > 0) {
                    handleSwitchAccount(remainingAccounts[0].userId);
                } else {
                    onClose();
                }
            }

            onAccountSwitch?.();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed bottom-0 w-full overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:justify-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacity-0 translate-y-full"
                            enterTo="opacity-100 translate-y-0"
                            leave="ease-in duration-300"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-full"
                        >
                            <Dialog.Panel className="w-full transform overflow-hidden rounded-t-2xl bg-white text-left align-middle shadow-xl transition-all sm:mx-auto">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                    {currentAccount?.name ||
                                                        'Usuário'}
                                                </Dialog.Title>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {accounts.length} conta(s) logada(s)
                                    </p>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {accounts.map((account) => (
                                        <div
                                            key={account.userId}
                                            className={`flex items-center justify-between p-4 border-b border-gray-100 ${
                                                account.userId ===
                                                currentAccount?.userId
                                                    ? 'bg-blue-50'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                    {account.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {account.name}
                                                    </p>

                                                    {account.userId ===
                                                        currentAccount?.userId && (
                                                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            Atual
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2 ml-3">
                                                {account.userId !==
                                                currentAccount?.userId ? (
                                                    <button
                                                        title={`Trocar para a conta ${account.name}`}
                                                        aria-label={`Trocar para a conta ${account.name}`}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSwitchAccount(
                                                                account.userId,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 cursor-pointer bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        Usar
                                                    </button>
                                                ) : (
                                                    <span className="px-3 py-1.5"></span>
                                                )}

                                                {accounts.length > 1 && (
                                                    <button
                                                        title={`Sair da conta ${account.name}`}
                                                        aria-label={`Sair da conta ${account.name}`}
                                                        type="button"
                                                        onClick={() =>
                                                            handleLogoutAccount(
                                                                account.userId,
                                                                account.name,
                                                            )
                                                        }
                                                        className="p-2 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    >
                                                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 border-t border-gray-200">
                                    <button
                                        title="Adicionar outra conta"
                                        aria-label="Adicionar outra conta"
                                        type="button"
                                        onClick={handleAddAccount}
                                        className="w-full cursor-pointer py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="font-medium">
                                            Adicionar outra conta
                                        </span>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
