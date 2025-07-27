import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Colors from '@/src/constants/colors';

interface Option {
    label: string;
    value: string | number;
}

interface CustomDropdownInputProps {
    placeholder: string;
    value: string | number;
    onChangeText: (value: string | number) => void;
    onBlur: () => void;
    touched: boolean | undefined;
    error?: string;
    icon?: React.ReactNode;
    options: Option[];
}

export default function CustomDropdownInput({
    placeholder,
    value,
    onChangeText,
    onBlur,
    error,
    touched,
    icon,
    options,
}: CustomDropdownInputProps) {
    const [visible, setVisible] = React.useState(false);

    const selectedLabel =
        options.find((opt) => opt.value === value)?.label || placeholder;

    return (
        <View style={styles.inputWrapperErrorContainer}>
            <View>
                {icon && <View style={styles.iconContainer}>{icon}</View>}

                <TouchableOpacity
                    onPress={() => setVisible(true)}
                    style={styles.dropdownInput}
                >
                    <Text style={styles.dropdownText}>{selectedLabel}</Text>
                </TouchableOpacity>

                <Modal
                    visible={visible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => {
                        setVisible(false);
                        onBlur();
                    }}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => {
                            setVisible(false);
                            onBlur();
                        }}
                    >
                        <View style={styles.modalContent}>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={styles.option}
                                    onPress={() => {
                                        onChangeText(option.value);
                                        setVisible(false);
                                    }}
                                >
                                    <Text style={styles.optionText}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {touched && error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapperErrorContainer: {
        width: '100%',
    },
    iconContainer: {
        position: 'absolute',
        left: 12,
        top: 10,
        zIndex: 1,
    },
    dropdownInput: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        paddingLeft: 40,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: Colors.light.text,
        borderRadius: 10,
        backgroundColor: Colors.light.input,
    },
    dropdownText: {
        color: Colors.light.text,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.light.input,
        borderRadius: 8,
        paddingVertical: 8,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.light.text,
    },
    optionText: {
        fontSize: 16,
        color: Colors.light.text,
    },
    errorText: {
        color: Colors.light.error,
        marginTop: 4,
        fontSize: 12,
        paddingLeft: 40,
    },
});
