import { Text, View } from '@/components/Themed';
import Header from '@/components/header';
import CardMedication from '@/components/cardMedication';
import { dashboardScreenStyles } from '../styles/dashboardScreensStyles';

export default function MedicationScheduleScreen() {
    return (
        <View>
            <Header placeholder="Pesquise um remédio" />
            <View style={dashboardScreenStyles.titleContainer}>
                <View style={dashboardScreenStyles.separator} />
                <Text style={dashboardScreenStyles.title}>
                    Lista de Remédios
                </Text>
            </View>
            <CardMedication />
        </View>
    );
}
