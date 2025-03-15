import { Text, View } from '@/components/ui/Themed';
import Header from '@/components/layout/header';
import CardContact from '@/components/cards/cardContact';
import { dashboardScreenStyles } from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/components/buttons/floatingActionButton';

export default function ContactScreen() {
    return (
        <View>
            <Header placeholder="Pesquise um contato" />
            <View style={dashboardScreenStyles.titleContainer}>
                <View style={dashboardScreenStyles.separator} />
                <Text style={dashboardScreenStyles.title}>
                    Lista de Contatos
                </Text>
            </View>
            <CardContact />
            <FloatingActionButton type={'contactScreen'} />
        </View>
    );
}
