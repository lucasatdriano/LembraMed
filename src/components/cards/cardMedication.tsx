import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Text } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/Colors';
import { Check, Pill } from 'lucide-react-native';
import medicationService from '@/src/service/api/medicationService';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import UpdateMedicationModal from '../modals/updateMedicationModal';

interface CardMedicationProps {
    medicationId: string;
}

interface MedicationData {
    id: string;
    name: string;
    hourfirstdose: string;
    hournextdose: string;
    periodstart: string | null;
    periodend: string | null;
    userid: string;
    doseintervalid: number;
    doseinterval: {
        intervalinhours: number;
    };
}

export default function CardMedication({ medicationId }: CardMedicationProps) {
    const [medicationData, setMedicationData] = useState<MedicationData | null>(
        null,
    );
    const [nextDoseCountdown, setNextDoseCountdown] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTap = useRef(0);
    const notificationIds = useRef<string[]>([]);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchMedication();
        }
    }, [userId, medicationId]);

    const fetchMedication = async () => {
        try {
            if (!userId) throw new Error('Usuário não autenticado.');
            const response = await medicationService.medication(
                userId,
                medicationId,
            );

            setMedicationData(response);
        } catch (error) {
            console.error('Erro ao encontrar medicamento:', error);
        }
    };

    const updateNextDose = async () => {
        try {
            if (!userId || !medicationData) return;

            const [hours, minutes] = medicationData.hournextdose.split(':');
            const formattedHourNextDose = `${hours}:${minutes}`;
            const now = new Date();

            const nextDose = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                Number(hours),
                Number(minutes),
                0,
                0,
            );

            nextDose.setHours(
                nextDose.getHours() +
                    medicationData.doseinterval.intervalinhours,
            );
            const formattedNextDose = nextDose.toTimeString().slice(0, 5);

            await medicationService.updateMedication(userId, medicationId, {
                hourNextDose: formattedNextDose,
            });

            fetchMedication();
        } catch (error) {
            console.error('Erro ao atualizar próximo horário de dose:', error);
        }
    };

    const scheduleNotifications = async (nextDose: Date) => {
        for (const notificationId of notificationIds.current) {
            await Notifications.cancelScheduledNotificationAsync(
                notificationId,
            );
        }
        notificationIds.current = [];

        for (let i = 0; i < 6; i++) {
            const notificationTime = new Date(
                nextDose.getTime() + i * 10 * 60 * 1000,
            );
            const notificationId =
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Hora de tomar seu medicamento!',
                        body: `Não se esqueça de tomar ${medicationData!.name}`,
                        sound: true,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.DATE,
                        date: notificationTime,
                    },
                });
            notificationIds.current.push(notificationId);
        }
    };

    useEffect(() => {
        if (medicationData) {
            const nextDose = new Date();
            const [hours, minutes] = medicationData.hournextdose
                .split(':')
                .map(Number);

            if (!isNaN(hours) && !isNaN(minutes)) {
                nextDose.setHours(hours, minutes, 0, 0);
            } else {
                console.error(
                    'Formato inválido de hournextdose:',
                    medicationData.hournextdose,
                );
                return;
            }

            scheduleNotifications(nextDose);

            const interval = setInterval(() => {
                const now = new Date();
                let diffInSeconds = Math.floor(
                    (nextDose.getTime() - now.getTime()) / 1000,
                );

                if (diffInSeconds < 0) {
                    diffInSeconds = 0;
                }

                const hours = Math.floor(diffInSeconds / 3600);
                const minutes = Math.floor((diffInSeconds % 3600) / 60);
                const seconds = diffInSeconds % 60;

                const countdownFormatted = `${String(hours).padStart(
                    2,
                    '0',
                )}:${String(minutes).padStart(2, '0')}:${String(
                    seconds,
                ).padStart(2, '0')}`;
                setNextDoseCountdown(countdownFormatted);

                if (diffInSeconds <= 0) {
                    updateNextDose();
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [medicationData]);

    useEffect(() => {
        if (isSelected) {
            for (const notificationId of notificationIds.current) {
                Notifications.cancelScheduledNotificationAsync(notificationId);
            }
            notificationIds.current = [];

            const timeout = setTimeout(() => {
                setIsSelected(false);
                updateNextDose();
            }, 30 * 60 * 1000); // 30 minutos

            return () => clearTimeout(timeout);
        }
    }, [isSelected, medicationData]);

    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setIsSelected((prev) => !prev);
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                setIsModalVisible(true);
            }, DOUBLE_PRESS_DELAY);
        }
    };

    if (!medicationData) {
        return (
            <View style={styles.cardContainer}>
                <Text>Nenhum medicamento encontrado.</Text>
            </View>
        );
    }

    return (
        <>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                <View
                    style={[
                        styles.cardContainer,
                        isSelected && styles.selectedCardContainer,
                    ]}
                >
                    {isSelected && (
                        <Check color={Colors.light.tabIconSelected} />
                    )}
                    <View style={styles.containerData}>
                        <View style={styles.containerText}>
                            <Pill style={styles.icon} />
                            <Text style={styles.textName}>
                                {medicationData.name}
                            </Text>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textInfo}>
                                Intervalo:{' '}
                                {medicationData.doseinterval.intervalinhours}/
                                {medicationData.doseinterval.intervalinhours}{' '}
                                horas
                            </Text>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textInfo}>
                                Horário da próxima dose:{' '}
                                {medicationData.hournextdose}
                            </Text>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textInfo}>
                                Próxima dose em: {nextDoseCountdown}
                            </Text>
                        </View>
                        {medicationData.periodstart !== null &&
                            medicationData.periodend !== null && (
                                <View style={styles.containerText}>
                                    <Text style={styles.textInfo}>
                                        Período: {medicationData.periodstart} -{' '}
                                        {medicationData.periodend}
                                    </Text>
                                </View>
                            )}
                    </View>
                </View>
            </TouchableOpacity>

            <UpdateMedicationModal
                isVisible={isModalVisible}
                setVisible={setIsModalVisible}
                userId={userId || ''}
                medicationId={medicationId}
                onMedicationUpdated={fetchMedication}
            />
        </>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: Colors.light.colorPrimary,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 15,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        gap: 10,
    },
    selectedCardContainer: {
        backgroundColor: Colors.light.button,
    },
    containerData: {
        gap: 5,
    },
    containerText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textInfo: {
        fontSize: 18,
        marginLeft: 25,
    },
    icon: {
        marginLeft: 15,
    },
});
