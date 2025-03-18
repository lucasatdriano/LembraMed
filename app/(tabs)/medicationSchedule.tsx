import { Text, View } from '@/src/components/ui/Themed';
import Header from '@/src/components/layout/header';
import CardMedication from '@/src/components/cards/cardMedication';
import dashboardScreenStyles from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/src/components/buttons/floatingActionButton';
import { useEffect, useState } from 'react';
import medicationService from '@/src/service/api/medicationService';
import { localStorageUtil } from '@/src/util/localStorageUtil';

interface Medication {
    id: string;
    name: string;
    hourFirstDose: string;
    periodStart: string;
    periodEnd: string;
    userId: string;
    doseIntervalId: number;
    intervalInHours: number;
}

export default function MedicationScheduleScreen() {
    const [medications, setMedications] = useState<Medication[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchMedications();
        }
    }, [userId]);

    const fetchMedications = async () => {
        try {
            const response = await medicationService.medications(userId || '');
            setMedications(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao buscar medicamentos:', error.message);
            } else {
                console.error('Erro inesperado ao buscar medicamentos.');
            }
        }
    };

    const handleMedicationCreated = () => {
        fetchMedications();
    };

    return (
        <View>
            <Header
                placeholder="Pesquise um remédio"
                screen="medicationScreen"
            />
            <View style={dashboardScreenStyles.titleContainer}>
                <View style={dashboardScreenStyles.separator} />
                <Text style={dashboardScreenStyles.title}>
                    Lista de Remédios
                </Text>
            </View>

            <View style={dashboardScreenStyles.containerCards}>
                {medications.map((medication) => (
                    <CardMedication
                        key={medication.id}
                        medication={medication}
                    />
                ))}
            </View>

            <FloatingActionButton
                screen="medicationScreen"
                onMedicationCreated={handleMedicationCreated}
            />
        </View>
    );
}
