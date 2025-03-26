import { Text, View } from '@/src/components/ui/Themed';
import Header from '@/src/components/layout/header';
import CardContact from '@/src/components/cards/cardContact';
import dashboardScreenStyles from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/src/components/buttons/floatingActionButton';
import { useEffect, useState } from 'react';
import contactService from '@/src/service/api/contactService';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import { ScrollView, ActivityIndicator } from 'react-native';
import Colors from '@/src/constants/colors';

interface Contact {
    id: string;
    contactname: string;
    phonenumber: string;
}

export default function ContactScreen() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchContacts(searchQuery);
        }
    }, [userId, searchQuery]);

    const fetchContacts = async (search: string = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await contactService.contacts(
                userId || '',
                search,
            );

            setContacts(response);

            if (response.length === 0) {
                setError(null);
            }
        } catch (error) {
            let errorMessage = 'Erro ao buscar contatos';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleContactCreated = () => {
        fetchContacts(searchQuery);
    };

    return (
        <View style={dashboardScreenStyles.containerPage}>
            <Header
                placeholder="Pesquise um contato"
                onSearch={setSearchQuery}
            />

            <ScrollView style={dashboardScreenStyles.scrollContainer}>
                <View style={dashboardScreenStyles.titleContainer}>
                    <View style={dashboardScreenStyles.separator} />
                    <Text style={dashboardScreenStyles.title}>
                        Lista de Contatos
                    </Text>
                </View>

                {loading ? (
                    <ActivityIndicator
                        size="large"
                        color={Colors.light.tabIconSelected}
                        style={dashboardScreenStyles.loadingIndicator}
                    />
                ) : contacts.length === 0 ? (
                    <Text style={dashboardScreenStyles.emptyListText}>
                        {searchQuery
                            ? `Nenhum contato encontrado para "${searchQuery}"`
                            : 'Nenhum contato encontrado.'}
                    </Text>
                ) : (
                    <View style={dashboardScreenStyles.containerCards}>
                        {contacts.map((contact) => (
                            <CardContact
                                key={contact.id}
                                contactId={contact.id}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <FloatingActionButton
                screen="contactScreen"
                onContactCreated={handleContactCreated}
            />
        </View>
    );
}
