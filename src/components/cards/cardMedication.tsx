import React, { useEffect, useState, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Text } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/colors';
import { Check, Pill } from 'lucide-react-native';
import medicationService from '@/src/service/domains/medicationService';
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
    status: boolean;
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
    const timeoutRef = useRef<number | null>(null);
    const lastTap = useRef(0);
    const notificationIds = useRef<string[]>([]);
    const syncIntervalRef = useRef<number | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await localStorageUtil.get('userId');
            setUserId(id);
        };
        fetchUserId();
    }, []);

    const fetchMedication = useCallback(async () => {
        try {
            if (!userId) throw new Error('Usuário não autenticado.');
            const response = await medicationService.medication(
                userId,
                medicationId,
            );

            const formattedResponse = {
                ...response,
                hournextdose: response.hournextdose
                    .split(':')
                    .slice(0, 2)
                    .join(':'),
            };

            setMedicationData((prev) => {
                if (
                    JSON.stringify(prev) === JSON.stringify(formattedResponse)
                ) {
                    return prev;
                }
                return formattedResponse;
            });
        } catch (error) {
            console.error('Erro ao encontrar medicamento:', error);
        }
    }, [userId, medicationId]);

    useEffect(() => {
        if (userId) {
            fetchMedication();
        }
    }, [userId, medicationId, fetchMedication]);

    const scheduleNotifications = useCallback(
        async (nextDose: Date) => {
            if (!medicationData) return;

            for (const notificationId of notificationIds.current) {
                await Notifications.cancelScheduledNotificationAsync(
                    notificationId,
                );
            }
            notificationIds.current = [];

            for (let i = 0; i < 8; i++) {
                const notificationTime = new Date(
                    nextDose.getTime() + i * 5 * 60 * 1000,
                );
                const notificationId =
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Hora de tomar seu medicamento!',
                            body: `Não se esqueça de tomar ${medicationData.name}`,
                            sound: true,
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes
                                .DATE,
                            date: notificationTime,
                        },
                    });
                notificationIds.current.push(notificationId);
            }
        },
        [medicationData],
    );

    const updateNextDose = useCallback(
        async (markedAsTaken: boolean = false) => {
            try {
                if (!userId || !medicationData) return;

                const now = new Date();
                const [hours, minutes] = medicationData.hournextdose
                    .split(':')
                    .map(Number);

                // Cria a data da próxima dose baseada no horário atual
                const nextDose = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate(),
                    hours,
                    minutes,
                    0,
                    0,
                );

                // Se já passou do horário, calcula o próximo disponível
                if (now > nextDose) {
                    // Calcula quantos intervalos completos já passaram
                    const diffHours =
                        (now.getTime() - nextDose.getTime()) / (1000 * 60 * 60);
                    const intervalsPassed = Math.ceil(
                        diffHours / medicationData.doseinterval.intervalinhours,
                    );

                    // Adiciona os intervalos completos ao horário original
                    nextDose.setHours(
                        nextDose.getHours() +
                            intervalsPassed *
                                medicationData.doseinterval.intervalinhours,
                    );
                } else {
                    // Se ainda não chegou no horário, apenas adiciona um intervalo
                    nextDose.setHours(
                        nextDose.getHours() +
                            medicationData.doseinterval.intervalinhours,
                    );
                }

                // Formata o novo horário
                const formattedNextDose = `${String(
                    nextDose.getHours(),
                ).padStart(2, '0')}:${String(nextDose.getMinutes()).padStart(
                    2,
                    '0',
                )}`;

                // Atualiza no backend
                await medicationService.updateMedication(userId, medicationId, {
                    hourNextDose: formattedNextDose,
                    status: false,
                });

                if (!markedAsTaken) {
                    await medicationService.registerMissedDose(
                        userId,
                        medicationId,
                    );
                }

                // Recarrega os dados
                fetchMedication();

                // Agenda notificações para o novo horário
                scheduleNotifications(nextDose);
            } catch (error) {
                console.error('Erro ao atualizar próxima dose:', error);
            }
        },
        [
            userId,
            medicationId,
            medicationData,
            fetchMedication,
            scheduleNotifications,
        ],
    );

    useEffect(() => {
        if (!medicationData?.status) return;

        syncIntervalRef.current = setInterval(() => {
            fetchMedication();
        }, 60 * 1000);

        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [medicationData?.status, fetchMedication]);

    // Atualize a função checkMissedDoses para verificar mais frequentemente
    const checkMissedDoses = useCallback(async () => {
        if (!medicationData || medicationData.status) return;

        const now = new Date();
        const [hours, minutes] = medicationData.hournextdose
            .split(':')
            .map(Number);
        const doseTime = new Date();
        doseTime.setHours(hours, minutes, 0, 0);

        // Verifica se passou mais de 5 minutos do horário (ajuste conforme necessário)
        if (now.getTime() - doseTime.getTime() > 5 * 60 * 1000) {
            await updateNextDose();
        }
    }, [medicationData, updateNextDose]);

    useEffect(() => {
        const interval = setInterval(checkMissedDoses, 60 * 1000);
        checkMissedDoses();
        return () => clearInterval(interval);
    }, [checkMissedDoses]);

    useEffect(() => {
        if (!medicationData?.hournextdose) return;

        const interval = setInterval(() => {
            const [hours, minutes] = medicationData.hournextdose
                .split(':')
                .map(Number);
            const nextDose = new Date();
            nextDose.setHours(hours, minutes, 0, 0);

            let diffInSeconds = Math.floor(
                (nextDose.getTime() - Date.now()) / 1000,
            );

            if (diffInSeconds < 0) {
                diffInSeconds = 0;
            }

            const hoursLeft = Math.floor(diffInSeconds / 3600);
            const minutesLeft = Math.floor((diffInSeconds % 3600) / 60);
            const secondsLeft = diffInSeconds % 60;

            setNextDoseCountdown(
                `${String(hoursLeft).padStart(2, '0')}:${String(
                    minutesLeft,
                ).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`,
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [medicationData?.hournextdose]);

    const handleUpdateStatus = async () => {
        try {
            if (!userId || !medicationData) return;

            const newStatus = !medicationData.status;

            console.log('Enviando PATCH para:', {
                userId,
                medicationId,
                status: newStatus,
            });

            await medicationService.updateMedicationStatus(
                userId,
                medicationId,
                { status: newStatus },
            );

            setMedicationData((prev) =>
                prev ? { ...prev, status: newStatus } : null,
            );

            if (!newStatus) {
                await updateNextDose(true);
            }

            fetchMedication();
        } catch (error) {
            console.error('Erro detalhado:', error);
            console.error(
                'Erro',
                error instanceof Error
                    ? error.message
                    : 'Falha ao atualizar status',
            );
        }
    };

    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            handleUpdateStatus();
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                setIsModalVisible(true);
            }, DOUBLE_PRESS_DELAY);
        }
    };

    if (!medicationData) {
        return null;
    }

    return (
        <>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
                <View
                    style={[
                        styles.cardContainer,
                        medicationData.status && styles.selectedCardContainer,
                    ]}
                >
                    {medicationData.status && (
                        <Check color={Colors.light.tabIconSelected} />
                    )}
                    <View style={styles.containerData}>
                        <View style={styles.containerText}>
                            <Pill
                                style={styles.icon}
                                color={Colors.light.text}
                            />
                            <Text style={styles.textName}>
                                {medicationData.name}
                            </Text>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textInfo}>
                                Intervalo:{' '}
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
        borderColor: Colors.light.tabIconSelected,
        borderWidth: 2,
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
