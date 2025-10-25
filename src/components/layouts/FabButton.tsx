'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { parseCookies } from 'nookies';
import CreateContactModal from '../modals/contact/CreateContactModal';
import CreateMedicationModal from '../modals/medication/CreateMedicationModal';

interface FloatingActionButtonProps {
    screen: 'contactScreen' | 'medicationScreen';
    onContactCreated?: () => void;
    onMedicationCreated?: () => void;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
}

export default function FloatingActionButton({
    screen,
    onContactCreated,
    onMedicationCreated,
    position = 'bottom-right',
    className = '',
}: FloatingActionButtonProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const cookies = parseCookies();
        const id = cookies.userId;
        setUserId(id);
    }, []);

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6',
    };

    return (
        <>
            <button
                title={
                    screen === 'contactScreen'
                        ? 'Adicionar contato'
                        : 'Adicionar medicamento'
                }
                aria-label={
                    screen === 'contactScreen'
                        ? 'Adicionar contato'
                        : 'Adicionar medicamento'
                }
                type="button"
                onClick={() => setIsModalVisible(true)}
                className={`
                    fixed z-40 w-16 h-16 bg-primary text-foreground
                    rounded-full shadow-lg hover:shadow-xl
                    flex items-center justify-center cursor-pointer
                    transition-all duration-200
                    hover:scale-105 active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2
                    ${positionClasses[position]}
                    ${className}
                `}
            >
                <Plus className="w-6 h-6" />
            </button>

            {screen === 'contactScreen' ? (
                <CreateContactModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    userId={userId || ''}
                    onContactCreated={() => {
                        setIsModalVisible(false);
                        onContactCreated?.();
                    }}
                />
            ) : (
                <CreateMedicationModal
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    userId={userId || ''}
                    onMedicationCreated={() => {
                        setIsModalVisible(false);
                        onMedicationCreated?.();
                    }}
                />
            )}
        </>
    );
}
