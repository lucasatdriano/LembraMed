import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Eye, EyeClosed, LockKeyhole, User } from 'lucide-react-native';
import Colors from '@/src/constants/Colors';

interface CustomInputTextFieldProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur: (e: any) => void;
    touched: boolean | undefined;
    maxLength?: number;
    error?: string;
    icon?: React.ReactNode;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    isPasswordField?: boolean;
    showPassword?: boolean;
    togglePasswordVisibility?: () => void;
}

export default function CustomTextInput({
    placeholder,
    value,
    onChangeText,
    onBlur,
    error,
    maxLength,
    touched,
    icon,
    secureTextEntry = false,
    autoCapitalize = 'none',
    isPasswordField = false,
    showPassword,
    togglePasswordVisibility,
}: CustomInputTextFieldProps) {
    return (
        <View style={styles.inputWrapperErrorContainer}>
            <View style={styles.inputContainer}>
                {icon && <View style={styles.iconInput}>{icon}</View>}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    placeholderTextColor="#888"
                    autoCapitalize={autoCapitalize}
                    secureTextEntry={
                        isPasswordField ? !showPassword : secureTextEntry
                    }
                />
                {isPasswordField && (
                    <Pressable
                        onPress={togglePasswordVisibility}
                        style={styles.iconEye}
                    >
                        {showPassword ? <EyeClosed /> : <Eye />}
                    </Pressable>
                )}
            </View>
            {touched && error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapperErrorContainer: {
        width: '100%',
        gap: 5,
        backgroundColor: Colors.light.colorPrimary,
    },
    inputContainer: {
        position: 'relative',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.colorPrimary,
    },
    iconInput: {
        position: 'absolute',
        left: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        backgroundColor: Colors.light.input,
        color: Colors.light.text,
        paddingHorizontal: 40,
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.text,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    iconEye: {
        position: 'absolute',
        right: 10,
    },
    errorText: {
        color: Colors.light.error,
        paddingLeft: 30,
        fontSize: 12,
        alignSelf: 'flex-start',
    },
});
