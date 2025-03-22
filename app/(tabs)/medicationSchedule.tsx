import { Text, View } from '@/src/components/ui/Themed';
import Header from '@/src/components/layout/header';
import CardMedication from '@/src/components/cards/cardMedication';
import dashboardScreenStyles from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/src/components/buttons/floatingActionButton';
import { useEffect, useState } from 'react';
import medicationService from '@/src/service/api/medicationService';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import { ScrollView } from 'react-native';

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
    }, [userId, searchQuery]);

    const fetchMedications = async (search: string = '') => {
        try {
            const response = await medicationService.medications(
                userId || '',
                search,
            );
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
        fetchMedications(searchQuery);
    };

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

                <View style={dashboardScreenStyles.containerCards}>
                    {medications.map((medication) => (
                        <CardMedication
                            key={medication.id}
                            medicationId={medication.id}
                        />
                    ))}
                </View>
            </ScrollView>

            <FloatingActionButton
                screen="medicationScreen"
                onMedicationCreated={handleMedicationCreated}
            />
        </View>
    );
}
