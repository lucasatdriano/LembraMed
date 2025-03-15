import { Text, View } from '@/src/components/ui/Themed';
import Header from '@/src/components/layout/header';
import CardMedication from '@/src/components/cards/cardMedication';
import { dashboardScreenStyles } from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/src/components/buttons/floatingActionButton';

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
