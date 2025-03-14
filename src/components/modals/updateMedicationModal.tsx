import { View, Text, StyleSheet, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '@/src/constants/Colors';
import { Calendar, Repeat, Clock, Pill } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import CustomButton from '@/src/components/buttons/customButton';
import { useState } from 'react';
import CustomDateInput from '@/src/components/form/inputDateField';
import CustomDropdownInput from '@/src/components/form/inputDropdownField';
import CustomHourInput from '@/src/components/form/inputHourField';
import { MEDICATION_INTERVALS } from '@/src/constants/medicationIntervals';
import { medicationValidationSchema } from '@/src/validation/medicationValidation';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function updateContactModal({
    isVisible,
    setVisible,
}: ModalProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedInterval, setSelectedInterval] = useState<string | number>(
        '',
    );

    async function handleSubmit(
        values: {
            medicationName: string;
            hour: string;
            interval: string;
            period: string;
        },
        formikHelpers: FormikHelpers<{
            medicationName: string;
            hour: string;
            interval: string;
            period: string;
        }>,
    ) {
        console.log('Remédio Atualizado:', values);
        setVisible(false);
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setVisible(false)}
            backdropOpacity={0.3}
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={styles.modal}
        >
            <Formik
                initialValues={{
                    medicationName: '',
                    hour: '',
                    interval: '',
                    period: '',
                }}
                validationSchema={medicationValidationSchema}
                onSubmit={handleSubmit}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                }) => (
                    <View style={styles.menu}>
                        {/* <Text style={styles.title}>Atualizar Remédio</Text> */}

                        <View style={styles.inputWrapperErrorContainer}>
                            <View style={styles.inputContainer}>
                                <Pill style={styles.iconInput} />

                                <TextInput
                                    style={styles.inputTitle}
                                    placeholder="Nome do remédio"
                                    value={values.medicationName}
                                    onChangeText={handleChange(
                                        'medicationName',
                                    )}
                                    onBlur={handleBlur('medicationName')}
                                    placeholderTextColor="#888"
                                />
                            </View>
                            {touched.medicationName &&
                                errors.medicationName && (
                                    <Text style={styles.errorText}>
                                        {errors.medicationName}
                                    </Text>
                                )}
                        </View>

                        <CustomHourInput
                            placeholder="HH:MM"
                            value={values.hour}
                            onChangeText={handleChange('hour')}
                            onBlur={handleBlur('hour')}
                            touched={touched.hour}
                            error={errors.hour}
                            icon={<Clock />}
                        />

                        <CustomDropdownInput
                            placeholder="Escolha o intervalo entre as doses"
                            value={selectedInterval}
                            onChangeText={(value) => {
                                setSelectedInterval(value);
                                setFieldValue('interval', value);
                            }}
                            onBlur={() => handleBlur('interval')}
                            touched={touched.interval}
                            error={errors.interval}
                            options={MEDICATION_INTERVALS}
                            icon={<Repeat />}
                        />

                        <CustomDateInput
                            placeholder="Selecione o período destinado"
                            value={selectedDate}
                            onChangeText={(value) => {
                                setSelectedDate(value);
                                setFieldValue('period', value);
                            }}
                            onBlur={() => handleBlur('period')}
                            touched={touched.period}
                            error={errors.period}
                            // icon={<Calendar />}
                        />

                        <View style={styles.containerButtons}>
                            <CustomButton
                                text="Atualizar Remédio"
                                onPress={() => handleSubmit()}
                            />

                            <CustomButton
                                text="Remover Remédio"
                                onPress={() => handleSubmit()}
                                backgroundColor={Colors.light.error}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
    },
    menu: {
        alignItems: 'center',
        backgroundColor: Colors.light.colorPrimary,
        borderRadius: 15,
        padding: 20,
        gap: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
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
    inputTitle: {
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
    containerButtons: {
        flexDirection: 'row',
    },
});
