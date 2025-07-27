import dashboardScreenStyles from '@/app/styles/dashboardScreensStyles';
import FloatingActionButton from '@/src/components/buttons/floatingActionButton';
import CardContact from '@/src/components/cards/cardContact';
import Header from '@/src/components/layout/header';
import { Text, View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/colors';
import contactService from '@/src/service/domains/contactService';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

interface Contact {
    id: string;
    name: string;
    numberphone: string;
}

export default function ContactScreen() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchContacts = useCallback(
        async (search: string = '') => {
            setLoading(true);
            try {
                const response = await contactService.contacts(
                    userId || '',
                    search,
                );
                setContacts(response);
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
                setContacts([]);
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
            fetchContacts(searchQuery);
        }
    }, [userId, searchQuery, fetchContacts]);

    const handleContactCreated = useCallback(() => {
        fetchContacts(searchQuery);
    }, [fetchContacts, searchQuery]);

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
