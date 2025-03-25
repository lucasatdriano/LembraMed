import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Colors from '@/src/constants/colors';
import Formatters from '@/src/util/formatters';
import { CalendarDays, Clock3 } from 'lucide-react-native';

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
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);

    const handleStartDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date,
    ) => {
        setShowStartPicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
            setEndDate(null);
            setDateError(null);
            setShowEndPicker(true);
        }
    };

    const handleEndDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date,
    ) => {
        setShowEndPicker(false);
        if (selectedDate && startDate) {
            if (selectedDate < startDate) {
                setDateError(
                    'A data de término deve ser posterior à data de início',
                );
                onChangeText('');
                setStartDate(null);
                setEndDate(null);
            } else {
                setEndDate(selectedDate);
                setDateError(null);
                onChangeText(
                    `${Formatters.formatDate(
                        startDate,
                    )} - ${Formatters.formatDate(selectedDate)}`,
                );
            }
        }
    };

    return (
        <View style={styles.inputWrapperErrorContainer}>
            <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                style={styles.inputContainer}
            >
                <CalendarDays
                    style={styles.iconInput}
                    color={Colors.light.text}
                />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onBlur={onBlur}
                    placeholderTextColor="#888"
                    editable={false}
                />
            </TouchableOpacity>

            {showStartPicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleStartDateChange}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleEndDateChange}
                    minimumDate={startDate || undefined}
                />
            )}

            {touched && error && <Text style={styles.errorText}>{error}</Text>}
            {dateError && <Text style={styles.errorText}>{dateError}</Text>}
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
        justifyContent: 'center',
        backgroundColor: Colors.light.input,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.text,
        paddingHorizontal: 10,
    },
    input: {
        color: Colors.light.text,
        fontSize: 16,
        paddingLeft: 30,
    },
    iconInput: {
        position: 'absolute',
        top: 10,
        marginLeft: 10,
    },
    errorText: {
        color: Colors.light.error,
        fontSize: 12,
    },
});
