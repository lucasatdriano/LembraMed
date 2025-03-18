import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/Colors';
import { Pill } from 'lucide-react-native';

interface CardMedicationProps {
    medication: {
        id: string;
        name: string;
        hourFirstDose: string;
        periodStart: string;
        periodEnd: string;
        userId: string;
        doseIntervalId: number;
        intervalInHours: number;
    };
}

export default function CardMedication({ medication }: CardMedicationProps) {
    const [nextDoseTime, setNextDoseTime] = useState<string>('');
    const [nextDoseCountdown, setNextDoseCountdown] = useState<string>('');

    const calculateNextDose = () => {
        const now = new Date();
        const firstDoseTime = new Date(
            `${now.toISOString().split('T')[0]}T${medication.hourFirstDose}:00`,
        );

        let nextDose = new Date(firstDoseTime);
        while (nextDose <= now) {
            nextDose.setHours(nextDose.getHours() + medication.intervalInHours);
        }

        const nextDoseFormatted = nextDose.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const diffInSeconds = Math.floor(
            (nextDose.getTime() - now.getTime()) / 1000,
        );
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;
        const countdownFormatted = `${String(hours).padStart(2, '0')}:${String(
            minutes,
        ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        setNextDoseTime(nextDoseFormatted);
        setNextDoseCountdown(countdownFormatted);
    };

    useEffect(() => {
        calculateNextDose();
        const interval = setInterval(calculateNextDose, 1000);
        return () => clearInterval(interval);
    }, [medication]);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.containerText}>
                <Pill style={styles.icon} />
                <Text style={styles.textName}>{medication.name}</Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.textInfo}>
                    Intervalo: {medication.intervalInHours} horas
                </Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.textInfo}>
                    Horário da próxima dose: {nextDoseTime}
                </Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.textInfo}>
                    Próxima dose: {nextDoseCountdown}
                </Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.textInfo}>
                    Período: {medication.periodStart} - {medication.periodEnd}
                </Text>
            </View>
        </View>
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
    textInfo: {
        fontSize: 18,
        marginLeft: 25,
    },
    icon: {
        marginLeft: 15,
    },
});
