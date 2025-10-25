'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Phone, User, Edit, Trash2 } from 'lucide-react';
import { parseCookies } from 'nookies';
import contactService from '@/services/domains/contactService';
import Masks from '@/utils/masks';
import UpdateContactModal from '../modals/contact/UpdateContactModal';
import { Contact } from '@/interfaces/contact';
import Formatters from '@/utils/formatters';

interface CardContactProps {
    contactId: string;
    onUpdate?: () => void;
}

export default function CardContact({ contactId, onUpdate }: CardContactProps) {
    const [contactData, setContactData] = useState<Contact | null>(null);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const lastTap = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cookies = parseCookies();
    const userId = cookies.userId;

    const fetchContact = useCallback(async () => {
        if (!userId) return;

        setIsFetching(true);
        try {
            const response = await contactService.contact(userId, contactId);
            setContactData(response);
        } catch (error) {
            console.error('Erro ao carregar contato:', error);
        } finally {
            setIsFetching(false);
        }
    }, [userId, contactId]);

    useEffect(() => {
        if (userId) {
            fetchContact();
        }
    }, [userId, fetchContact]);

    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            handleCall();
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                setIsUpdateModalVisible(true);
            }, DOUBLE_PRESS_DELAY);
        }
    };

    const handleCall = () => {
        if (contactData?.numberphone) {
            const cleanNumber = contactData.numberphone.replace(/\D/g, '');
            window.open(`tel:${cleanNumber}`, '_self');
        } else {
            console.error('Número de telefone não disponível.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este contato?')) {
            return;
        }

        setIsLoading(true);
        try {
            await contactService.deleteContact(userId, contactId);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao excluir contato:', error);
            alert('Erro ao excluir contato.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContactUpdated = () => {
        fetchContact();
        onUpdate?.();
    };

    if (isFetching) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!contactData) {
        return <div className="hidden"></div>;
    }

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handlePress}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
                            <User className="w-4 h-4 text-gray-500 mr-2" />
                            <h3 className="font-semibold text-gray-900 text-lg">
                                {Formatters.formatName(contactData.name)}
                            </h3>
                        </div>

                        <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-gray-600">
                                {Masks.phone(contactData.numberphone)}
                            </span>
                        </div>

                        <div className="mt-2 text-xs text-gray-400">
                            Clique para editar • Clique duas vezes para ligar
                        </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                        <button
                            title="Editar contato"
                            aria-label="Editar contato"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsUpdateModalVisible(true);
                            }}
                            disabled={isLoading}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            title="Excluir contato"
                            aria-label="Excluir contato"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            disabled={isLoading}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <UpdateContactModal
                visible={isUpdateModalVisible}
                onClose={() => setIsUpdateModalVisible(false)}
                userId={userId}
                contactId={contactId}
                onContactUpdated={handleContactUpdated}
            />
        </>
    );
}
