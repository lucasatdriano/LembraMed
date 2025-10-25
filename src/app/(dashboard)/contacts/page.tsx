'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import FloatingActionButton from '@/components/layouts/FabButton';
import contactService from '@/services/domains/contactService';
import { Contact } from '@/interfaces/contact';
import CardContact from '@/components/cards/CardContact';
import { useSearch } from '@/contexts/SearchContext';

export default function ContactScreen() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { searchValue } = useSearch();

    const fetchContacts = useCallback(
        async (search: string = '') => {
            if (!userId) return;

            setLoading(true);
            try {
                const response = await contactService.contacts(userId, search);
                setContacts(response);
            } catch (error) {
                console.error('Erro ao buscar contatos:', error);
                setContacts([]);
            } finally {
                setLoading(false);
            }
        },
        [userId],
    );

    useEffect(() => {
        const cookies = parseCookies();
        const id = cookies.userId;
        setUserId(id);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchContacts(searchValue);
        }
    }, [userId, searchValue, fetchContacts]);

    const handleContactCreated = useCallback(() => {
        fetchContacts(searchValue);
    }, [fetchContacts, searchValue]);

    return (
        <div className="min-h-full bg-gray-50">
            <main className="mx-auto px-2 md:px-12 pb-24">
                <div className="mb-8">
                    <h1 className="text-2xl mb-4 font-bold text-gray-900 text-center">
                        Lista de Contatos
                    </h1>
                    <div className="h-px w-full bg-gray-300 " />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-button"></div>
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchValue
                                ? `Nenhum contato encontrado para "${searchValue}"`
                                : 'Nenhum contato encontrado.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {contacts.map((contact) => (
                            <CardContact
                                key={contact.id}
                                contactId={contact.id}
                                onUpdate={fetchContacts}
                            />
                        ))}
                    </div>
                )}
            </main>

            <FloatingActionButton
                screen="contactScreen"
                onContactCreated={handleContactCreated}
            />
        </div>
    );
}
