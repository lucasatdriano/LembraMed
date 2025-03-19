import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ChevronDown } from 'lucide-react-native';
import Colors from '@/src/constants/Colors';

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
    return (
        <View style={styles.inputWrapperErrorContainer}>
            <View style={styles.inputContainer}>
                {icon && <View style={styles.iconInput}>{icon}</View>}

                <RNPickerSelect
                    onValueChange={(selectedValue: string | number) => {
                        onChangeText(selectedValue);
                        onBlur();
                    }}
                    value={value}
                    placeholder={{ label: placeholder, value: null }}
                    items={options}
                    style={{
                        inputIOS: styles.input,
                        inputAndroid: styles.input,
                        inputWeb: styles.input,
                    }}
                    useNativeAndroidPickerStyle={false}
                />
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
        zIndex: 999,
        position: 'absolute',
        left: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        backgroundColor: Colors.light.input,
        color: Colors.light.text,
        paddingLeft: 35,
        paddingRight: 10,
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
    errorText: {
        color: Colors.light.error,
        paddingLeft: 30,
        fontSize: 12,
        alignSelf: 'flex-start',
    },
});
