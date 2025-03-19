import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/Colors';
import { Check, Pill } from 'lucide-react-native';
import medicationService from '@/src/service/api/medicationService';
import { localStorageUtil } from '@/src/util/localStorageUtil';
import Formatters from '@/src/util/formatters';
import UpdateMedicationModal from '../modals/updateMedicationModal';

interface CardMedicationProps {
    medicationId: string;
}

interface MedicationData {
    id: string;
    name: string;
    hourFirstDose: string;
    periodStart: string | null;
    periodEnd: string | null;
    userId: string;
    doseIntervalId: number;
    intervalInHours: number;
}

export default function CardMedication({ medicationId }: CardMedicationProps) {
    const [medicationData, setMedicationData] = useState<MedicationData | null>(
        null,
    );
    const [nextDoseTime, setNextDoseTime] = useState<string>('');
    const [nextDoseCountdown, setNextDoseCountdown] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastTap = useRef(0);

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

    useEffect(() => {
        if (medicationData) {
            const { nextDoseFormatted, countdownFormatted } =
                Formatters.calculateNextDose(
                    medicationData.hourFirstDose,
                    medicationData.intervalInHours,
                );
            setNextDoseTime(nextDoseFormatted);
            setNextDoseCountdown(countdownFormatted);

            const interval = setInterval(() => {
                const { nextDoseFormatted, countdownFormatted } =
                    Formatters.calculateNextDose(
                        medicationData.hourFirstDose,
                        medicationData.intervalInHours,
                    );
                setNextDoseTime(nextDoseFormatted);
                setNextDoseCountdown(countdownFormatted);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [medicationData]);

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
                                Intervalo: {medicationData.intervalInHours}{' '}
                                horas
                            </Text>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textInfo}>
                                Horário da próxima dose: {nextDoseTime}
                            </Text>
                        </View>
                        <View style={styles.containerText}>
                            <Text style={styles.textInfo}>
                                Próxima dose em: {nextDoseCountdown}
                            </Text>
                        </View>
                        {medicationData.periodStart !== null &&
                            medicationData.periodEnd !== null && (
                                <View style={styles.containerText}>
                                    <Text style={styles.textInfo}>
                                        Período: {medicationData.periodStart} -{' '}
                                        {medicationData.periodEnd}
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
