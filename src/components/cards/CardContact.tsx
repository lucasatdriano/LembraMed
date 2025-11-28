'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Phone, User, Trash2 } from 'lucide-react';
import { parseCookies } from 'nookies';
import contactService from '@/services/domains/contactService';
import Masks from '@/utils/masks';
import UpdateContactModal from '../modals/contact/UpdateContactModal';
import { Contact } from '@/interfaces/contact';
import Formatters from '@/utils/formatters';

interface CardContactProps {
    contactData: Contact;
    onUpdate?: () => void;
}

export default function CardContact({
    contactData,
    onUpdate,
}: CardContactProps) {
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const cookies = parseCookies();
    const userId = cookies.userId;

    const handleCall = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (contactData?.numberphone) {
            const cleanNumber = contactData.numberphone.replace(/\D/g, '');
            window.open(`tel:${cleanNumber}`, '_self');
        } else {
            console.error('Número de telefone não disponível.');
        }
    };

    const handleCardClick = () => {
        setIsUpdateModalVisible(true);
    };

    const handleContactUpdated = () => {
        onUpdate?.();
    };

    if (!contactData) {
        return <div className="hidden"></div>;
    }

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleCardClick}
            >
                <div className="flex items-center justify-between">
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
                            Clique para editar
                        </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                        <button
                            title="Ligar para contato"
                            aria-label="Ligar para contato"
                            type="button"
                            onClick={handleCall}
                            disabled={isLoading}
                            className="p-2 cursor-pointer text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Phone className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <UpdateContactModal
                visible={isUpdateModalVisible}
                onClose={() => setIsUpdateModalVisible(false)}
                userId={userId}
                contactData={contactData}
                onContactUpdated={handleContactUpdated}
            />
        </>
    );
}
