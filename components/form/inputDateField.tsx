import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

interface CustomDateInputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur: (e: any) => void;
    touched: boolean | undefined;
    error?: string;
    icon?: React.ReactNode;
}

export default function CustomDateInput({
    placeholder,
    value,
    onChangeText,
    onBlur,
    error,
    touched,
    icon,
}: CustomDateInputProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isStartDate, setIsStartDate] = useState(true);
    const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
        null,
    );
    const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);

    const handleDateChange = (date: Date) => {
        const formattedDate = moment(date).format('DD/MM/YYYY');

        if (isStartDate) {
            setSelectedStartDate(formattedDate);
            onChangeText(`${formattedDate} - ${selectedEndDate || ''}`);
        } else {
            setSelectedEndDate(formattedDate);
            onChangeText(`${selectedStartDate || ''} - ${formattedDate}`);
        }

        setShowDatePicker(false);
    };

    const toggleDatePicker = () => {
        setShowDatePicker(true);
        setIsStartDate(!selectedStartDate);
    };

    return (
        <View style={styles.inputWrapperErrorContainer}>
            <View style={styles.inputContainer}>
                {icon && <View style={styles.iconInput}>{icon}</View>}
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    placeholderTextColor="#888"
                    onFocus={toggleDatePicker}
                    editable={false}
                />

                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    onConfirm={handleDateChange}
                    onCancel={() => setShowDatePicker(false)}
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
    errorText: {
        color: Colors.light.error,
        paddingLeft: 30,
        fontSize: 12,
        alignSelf: 'flex-start',
    },
});
