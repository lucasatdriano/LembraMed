import dashboardScreenStyles from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/src/components/buttons/floatingActionButton';
import CardMedication from '@/src/components/cards/cardMedication';
import Header from '@/src/components/layout/header';
import { Text, View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/colors';
import medicationService from '@/src/service/domains/medicationService';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

interface Medication {
    id: string;
    name: string;
    hourfirstdose: string;
    hournextdose: string;
    periodstart: string | null;
    periodend: string | null;
    userid: string;
    doseintervalid: number;
    doseinterval: {
        intervalinhours: number;
    };
}

export default function MedicationScheduleScreen() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMedications = useCallback(
        async (search: string = '') => {
            setLoading(true);
            try {
                const response = await medicationService.medications(
                    userId || '',
                    search,
                );
                setMedications(response);
            } catch (error) {
                let errorMessage = 'Erro ao carregar medicamentos';
                if (error instanceof Error) {
                    errorMessage = error.message || 'Erro desconhecido';
                }
                console.error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [userId],
    );

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchMedications(searchQuery);
        }
    }, [userId, searchQuery, fetchMedications]);

    const handleMedicationCreated = useCallback(() => {
        fetchMedications(searchQuery);
    }, [fetchMedications, searchQuery]);

    return (
        <View style={dashboardScreenStyles.containerPage}>
            <Header
                placeholder="Pesquise um remédio"
                onSearch={setSearchQuery}
            />

            <ScrollView style={dashboardScreenStyles.scrollContainer}>
                <View style={dashboardScreenStyles.titleContainer}>
                    <View style={dashboardScreenStyles.separator} />
                    <Text style={dashboardScreenStyles.title}>
                        Lista de Remédios
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={Colors.light.tabIconSelected}
                        style={dashboardScreenStyles.loadingIndicator}
                    />
                ) : medications.length === 0 ? (
                    <Text style={dashboardScreenStyles.emptyListText}>
                        {searchQuery
                            ? `Nenhum medicamento encontrado para "${searchQuery}"`
                            : 'Nenhum medicamento cadastrado.'}
                    </Text>
                ) : (
                    <View style={dashboardScreenStyles.containerCards}>
                        {medications.map((medication) => (
                            <CardMedication
                                key={medication.id}
                                medicationId={medication.id}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <FloatingActionButton
                screen="medicationScreen"
                onMedicationCreated={handleMedicationCreated}
            />
        </View>
    );
}
