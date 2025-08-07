import Colors from '@/src/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
                        {showPassword ? (
                            <MaterialCommunityIcons
                                name="eye-off-outline"
                                size={24}
                                color={Colors.light.text}
                            />
                        ) : (
                            <MaterialCommunityIcons
                                name="eye-outline"
                                size={24}
                                color={Colors.light.text}
                            />
                        )}
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
        zIndex: 1,
    },
    input: {
        flex: 1,
        position: 'absolute',
        width: '100%',
        backgroundColor: Colors.light.input,
        color: Colors.light.text,
        paddingHorizontal: 40,
        paddingVertical: 6,
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.text,
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
