import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, useColorScheme } from 'react-native';

import { Text, View } from '@/components/ui/Themed';
import Colors from '@/constants/Colors';
import { Phone, Pill, User } from 'lucide-react-native';

export default function CardContact() {
    const [text, setText] = useState('');
    const colorScheme = useColorScheme();

    return (
        <View style={styles.cardContainer}>
            <View style={styles.containerText}>
                <Pill style={styles.icon} />
                <Text style={styles.textName}>Ibuprofeno</Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.textInfo}>Intervalo: 8/8 horas</Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.textInfo}>
                    Horário da próxima dose: 09:00
                </Text>
            </View>
            <View style={styles.containerText}>
                <Text style={styles.textInfo}>Próxima dose: 03:32:12</Text>
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
