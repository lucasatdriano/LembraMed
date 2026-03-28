'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import pushNotificationService from '@/services/domains/pushNotificationService';
import { toast } from 'sonner';

export default function NotificationActivator() {
    const [status, setStatus] = useState('loading');
    const [showPrompt, setShowPrompt] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const currentStatus = await pushNotificationService.getStatus();
            setStatus(currentStatus);
            setShowPrompt(currentStatus === 'default');
        } catch (error) {
            console.error('Erro ao verificar status:', error);
            setStatus('unsupported');
        }
    };

    const handleActivate = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const success = await pushNotificationService.initialize();

            if (success) {
                setStatus('subscribed');
                setShowPrompt(false);
                toast.success('Notificações ativadas!');
            } else {
                toast.error('Não foi possível ativar as notificações');
            }
        } catch (error) {
            console.error('Erro:', error);
            toast.error('Erro ao ativar notificações');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeactivate = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await pushNotificationService.unsubscribe();
            setStatus('granted');
            toast.info('🔕 Notificações desativadas');
        } catch (error) {
            console.error('Erro:', error);
            toast.error('Erro ao desativar notificações');
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'unsupported') {
        return (
            <div
                className="text-xs text-gray-400"
                title="Seu navegador não suporta notificações"
            >
                📵 Sem suporte
            </div>
        );
    }

    return (
        <>
            {showPrompt && (
                <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-blue-200 p-4 z-50 animate-slide-up">
                    <button
                        title="Fechar prompt de notificações"
                        aria-label="Fechar prompt de notificações"
                        type="button"
                        onClick={() => setShowPrompt(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <Bell className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                                Receba notificações
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Ative as notificações para não perder o horário
                                dos seus remédios.
                            </p>

                            <div className="mt-3 flex space-x-2">
                                <button
                                    title="Ativar notificações"
                                    aria-label="Ativar notificações"
                                    type="button"
                                    onClick={handleActivate}
                                    disabled={isLoading}
                                    className="cursor-pointer px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Ativando...' : 'Ativar'}
                                </button>
                                <button
                                    title="Ignorar notificações"
                                    aria-label="Ignorar notificações"
                                    type="button"
                                    onClick={() => setShowPrompt(false)}
                                    disabled={isLoading}
                                    className="cursor-pointer px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Agora não
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
