import Colors from '@/src/constants/Colors';
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

interface CustomButtonProps {
    text: string;
    onPress: () => void;
    backgroundColor?: string;
    textColor?: string;
}

export default function CustomButton({
    text,
    onPress,
    backgroundColor = Colors.light.button,
    textColor = Colors.light.text,
}: CustomButtonProps) {
    return (
        <Pressable
            style={[styles.button, { backgroundColor }]}
            onPress={onPress}
        >
            <Text style={[styles.buttonText, { color: textColor }]}>
                {text}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '60%',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 15,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        fontSize: 16,
    },
});
