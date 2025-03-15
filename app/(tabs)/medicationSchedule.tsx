import { Text, View } from '@/components/ui/Themed';
import Header from '@/components/layout/header';
import CardMedication from '@/components/cards/cardMedication';
import { dashboardScreenStyles } from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/components/buttons/floatingActionButton';

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
            <FloatingActionButton type={'medicationScreen'} />
        </View>
    );
}
