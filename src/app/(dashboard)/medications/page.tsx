'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { Medication } from '@/interfaces/medication';
import FloatingActionButton from '@/components/layouts/FabButton';
import medicationService from '@/services/domains/medicationService';
import CardMedication from '@/components/cards/CardMedication';

export default function MedicationScheduleScreen() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMedications = useCallback(
        async (search: string = '') => {
            if (!userId) return;

            setLoading(true);
            try {
                const response = await medicationService.medications(
                    userId,
                    search,
                );
                setMedications(response);
            } catch (error) {
                console.error('Erro ao buscar medicamentos:', error);
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
            fetchMedications(searchQuery);
        }
    }, [userId, searchQuery, fetchMedications]);

    const handleMedicationCreated = useCallback(() => {
        fetchMedications(searchQuery);
    }, [fetchMedications, searchQuery]);

    const handleSearchChange = (search: string) => {
        setSearchQuery(search);
    };

    return (
        <div className="min-h-full bg-gray-50">
            <main className="mx-auto px-2 md:px-12 pb-24">
                <div className="mb-8">
                    <h1 className="text-2xl mb-4 font-bold text-gray-900 text-center">
                        Lista de Medicamentos
                    </h1>
                    <div className="h-px w-full bg-gray-300 " />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-button"></div>
                    </div>
                ) : medications.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchQuery
                                ? `Nenhum medicamento encontrado para "${searchQuery}"`
                                : 'Nenhum medicamento cadastrado.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {medications.map((medication) => (
                            <CardMedication
                                key={medication.id}
                                medicationId={medication.id}
                                onUpdate={fetchMedications}
                            />
                        ))}
                    </div>
                )}
            </main>

            <FloatingActionButton
                screen="medicationScreen"
                onMedicationCreated={handleMedicationCreated}
            />
        </div>
    );
}
