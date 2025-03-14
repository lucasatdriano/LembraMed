import { Text, View } from '@/components/Themed';
import Header from '@/components/header';
import CardContact from '@/components/cardContact';
import { dashboardScreenStyles } from '../styles/dashboardScreensStyles';

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
        </View>
    );
}
