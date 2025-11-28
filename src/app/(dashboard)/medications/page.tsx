'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { Medication } from '@/interfaces/medication';
import FloatingActionButton from '@/components/layouts/FabButton';
import medicationService from '@/services/domains/medicationService';
import CardMedication from '@/components/cards/CardMedication';
import { useSearch } from '@/contexts/SearchContext';

export default function MedicationScheduleScreen() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { searchValue } = useSearch();

    const fetchMedications = useCallback(
        async (search: string = '') => {
            if (!userId) return;

            setLoading(true);
            try {
                const response = await medicationService.searchMedications(
                    userId,
                    search,
                );
                setMedications(response);
            } catch (error) {
                console.error('Erro ao buscar medicamentos:', error);
                setMedications([]);
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
            fetchMedications(searchValue);
        }
    }, [userId, searchValue, fetchMedications]);

    const handleMedicationCreated = useCallback(() => {
        fetchMedications(searchValue);
    }, [fetchMedications, searchValue]);

    if (loading) {
        return (
            <div className="min-h-full bg-gray-50">
                <main className="mx-auto px-2 md:px-12 pb-24">
                    <div className="mb-8">
                        <h1 className="text-2xl mb-4 font-bold text-gray-900 text-center">
                            Lista de Medicamentos
                        </h1>
                        <div className="h-px w-full bg-gray-300" />
                    </div>

                    {/* ✅ Loading skeletons centralizado no pai */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 animate-pulse"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gray-50">
            <main className="mx-auto px-2 md:px-12 pb-24">
                <div className="mb-8">
                    <h1 className="text-2xl mb-4 font-bold text-gray-900 text-center">
                        Lista de Medicamentos
                    </h1>
                    <div className="h-px w-full bg-gray-300" />
                </div>

                {medications.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {searchValue
                                ? `Nenhum medicamento encontrado para "${searchValue}"`
                                : 'Nenhum medicamento cadastrado.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {medications.map((medication) => (
                            <CardMedication
                                key={medication.id}
                                medicationData={medication}
                                onUpdate={() => fetchMedications(searchValue)}
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
