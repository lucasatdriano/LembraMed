import { Text } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/colors';
import contactService from '@/src/service/domains/contactService';
import Formatters from '@/src/util/formatters';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import { Phone, User } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import UpdateContactModal from '../modals/updateContactModal';

interface CardContactProps {
    contactId: string;
}

interface ContactData {
    id: string;
    name: string;
    numberphone: string;
}

export default function CardContact({ contactId }: CardContactProps) {
    const [contactData, setContactData] = useState<ContactData | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const lastTap = useRef(0);
    const timeoutRef = useRef<number | null>(null);

    const fetchContact = useCallback(async () => {
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
    }, [userId, contactId]);

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
    }, [userId, fetchContact]);

    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            handleCall();
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                setIsModalVisible(true);
            }, DOUBLE_PRESS_DELAY);
        }
    };

    const handleCall = () => {
        if (contactData?.numberphone) {
            Linking.openURL(`tel:${contactData.numberphone}`);
        } else {
            console.error('Número de telefone não disponível.');
        }
    };

    if (!contactData) {
        return null;
    }

    return (
        <>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                <View style={styles.cardContainer}>
                    <View style={styles.containerText}>
                        <User style={styles.icon} color={Colors.light.text} />
                        <Text style={styles.textName}>{contactData.name}</Text>
                    </View>
                    <View style={styles.containerText}>
                        <Phone style={styles.icon} color={Colors.light.text} />
                        <Text style={styles.textContact}>
                            {Formatters.formatPhoneNumber(
                                contactData.numberphone,
                            )}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <UpdateContactModal
                isVisible={isModalVisible}
                setVisible={setIsModalVisible}
                userId={userId || ''}
                contactId={contactId}
                onContactUpdated={() => {
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
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 15,
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
