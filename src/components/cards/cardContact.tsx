import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, useColorScheme } from 'react-native';

import { Text, View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/Colors';
import { Phone, User } from 'lucide-react-native';

export default function CardContact() {
    const [text, setText] = useState('');
    const colorScheme = useColorScheme();

    return (
        <View style={styles.cardContainer}>
            <View style={styles.containerText}>
                <User style={styles.icon} />
                <Text style={styles.textName}>
                    Lucas Adriano Tavares Gonçalves
                </Text>
            </View>
            <View style={styles.containerText}>
                <Phone style={styles.icon} />
                <Text style={styles.textContact}>(11) 99999-9999</Text>
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
    textContact: {
        fontSize: 18,
    },
    icon: {
        marginLeft: 15,
    },
});
