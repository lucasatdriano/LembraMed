import { Text, View } from '@/src/components/ui/Themed';
import Header from '@/src/components/layout/header';
import CardContact from '@/src/components/cards/cardContact';
import dashboardScreenStyles from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/src/components/buttons/floatingActionButton';
import { useEffect, useState } from 'react';
import contactService from '@/src/service/api/contactService';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import { ScrollView } from 'react-native';

interface Contact {
    id: string;
    contactname: string;
    phonenumber: string;
}

export default function ContactScreen() {
    const [contacts, setContacts] = useState<Contact[]>([]);
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
            fetchContacts(searchQuery);
        }
    }, [userId, searchQuery]);

    const fetchContacts = async (search: string = '') => {
        try {
            const response = await contactService.contacts(
                userId || '',
                search,
            );

            setContacts(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao buscar contatos:', error.message);
            } else {
                console.error('Erro inesperado ao buscar contatos.');
            }
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

                <View style={dashboardScreenStyles.containerCards}>
                    {contacts.map((contact) => (
                        <CardContact key={contact.id} contactId={contact.id} />
                    ))}
                </View>
            </ScrollView>

            <FloatingActionButton
                screen="contactScreen"
                onContactCreated={handleContactCreated}
            />
        </View>
    );
}
