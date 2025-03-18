import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Text } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/Colors';
import { Phone, User } from 'lucide-react-native';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import contactService from '@/src/service/api/contactService';
import UpdateContactModal from '../modals/updateContactModal';

interface CardContactProps {
    contactId: string;
}

interface ContactData {
    id: string;
    name: string;
    numberPhone: string;
}

export default function CardContact({ contactId }: CardContactProps) {
    const [contactData, setContactData] = useState<ContactData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchContact();
        }
    }, [userId, contactId]);

    const fetchContact = async () => {
        try {
            if (!userId) {
                throw new Error('Usuário não autenticado.');
            }

            const response = await contactService.contact(userId, contactId);
            setContactData(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Erro ao encontrar contato:', error.message);
            } else {
                console.error('Erro inesperado ao encontrar contato.');
            }
        }
    };

    const handleDoubleClick = () => {
        setIsModalVisible(true);
    };

    if (!contactData) {
        return (
            <View style={styles.cardContainer}>
                <Text>Nenhum contato encontrado.</Text>
            </View>
        );
    }

    return (
        <>
            <TouchableOpacity onPress={handleDoubleClick} activeOpacity={0.8}>
                <View style={styles.cardContainer}>
                    <View style={styles.containerText}>
                        <User style={styles.icon} />
                        <Text style={styles.textName}>{contactData.name}</Text>
                    </View>
                    <View style={styles.containerText}>
                        <Phone style={styles.icon} />
                        <Text style={styles.textContact}>
                            {contactData.numberPhone}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <UpdateContactModal
                isVisible={isModalVisible}
                setVisible={setIsModalVisible}
                userId={userId || ''}
                contactId={contactId}
                onContactDeleted={() => {
                    fetchContact();
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: Colors.light.colorPrimary,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 15,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        gap: 10,
    },
    containerText: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.colorPrimary,
        gap: 10,
    },
    textName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textContact: {
        fontSize: 18,
    },
    icon: {
        marginLeft: 15,
    },
});
