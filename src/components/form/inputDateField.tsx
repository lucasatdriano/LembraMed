import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Colors from '@/src/constants/Colors';
import Formatters from '@/src/util/formatters';

interface CustomDateInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur: (e: any) => void;
    touched: boolean | undefined;
    error?: string;
}

export default function CustomDateInput({
    placeholder,
    value,
    onChangeText,
    onBlur,
    error,
    touched,
}: CustomDateInputProps) {
    const [open, setOpen] = useState(false);
    const [isStartDate, setIsStartDate] = useState(true);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleDateConfirm = (date: Date) => {
        if (isStartDate) {
            setStartDate(date);
            setIsStartDate(false);
            setOpen(true);
        } else {
            setEndDate(date);
            setOpen(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            onChangeText(
                `${Formatters.formatDate(startDate)} - ${Formatters.formatDate(
                    endDate,
                )}`,
            );
        }
    }, [startDate, endDate]);

    return (
        <View style={styles.inputWrapperErrorContainer}>
            <TouchableOpacity
                onPress={() => {
                    setOpen(true);
                    setIsStartDate(true);
                }}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onBlur={onBlur}
                    placeholderTextColor="#888"
                    editable={false}
                />
            </TouchableOpacity>

            <DatePicker
                modal
                open={open}
                date={isStartDate ? new Date() : startDate || new Date()}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setOpen(false)}
            />

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
        height: 40,
        justifyContent: 'center',
        backgroundColor: Colors.light.input,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.text,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        paddingHorizontal: 10,
    },
    input: {
        color: Colors.light.text,
        fontSize: 16,
    },
    errorText: {
        color: Colors.light.error,
        fontSize: 12,
    },
});
