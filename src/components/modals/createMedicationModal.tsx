import CustomButton from '@/src/components/buttons/customButton';
import CustomDateInput from '@/src/components/form/inputDateField';
import CustomDropdownInput from '@/src/components/form/inputDropdownField';
import CustomHourInput from '@/src/components/form/inputHourField';
import CustomTextInput from '@/src/components/form/inputTextField';
import Colors from '@/src/constants/colors';
import { MEDICATION_INTERVALS } from '@/src/constants/medicationIntervals';
import medicationService from '@/src/service/domains/medicationService';
import Formatters from '@/src/util/formatters';
import { medicationValidationSchema } from '@/src/validation/medicationValidation';
import { Formik, FormikHelpers } from 'formik';
import { Clock, Pill, Repeat } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    userId: string;
    onMedicationCreated?: () => void;
}

interface FormValues {
    medicationName: string;
    hour: string;
    interval: string;
    period: string;
}

export default function CreateMedicationModal({
    isVisible,
    setVisible,
    userId,
    onMedicationCreated,
}: ModalProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedInterval, setSelectedInterval] = useState<string | number>(
        '',
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formikRef = useRef<FormikHelpers<FormValues> | null>(null);

    useEffect(() => {
        if (!isVisible && formikRef.current) {
            setSelectedDate('');
            setSelectedInterval('');
            formikRef.current.resetForm();
        }
    }, [isVisible]);

    async function handleSubmit(
        values: FormValues,
        helpers: FormikHelpers<FormValues>,
    ) {
        try {
            setIsSubmitting(true);

            const { start: periodStart, end: periodEnd } =
                Formatters.splitPeriod(values.period);

            await medicationService.createMedication(userId, {
                medicationName: values.medicationName,
                hourFirstDose: values.hour,
                intervalInHours: Number(values.interval),
                periodStart: periodStart,
                periodEnd: periodEnd,
            });

            setVisible(false);
            if (onMedicationCreated) {
                onMedicationCreated();
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro inesperado ao criar o medicamento.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
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
                {(helpers) => {
                    const {
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                    } = helpers;

                    return (
                        <View style={styles.menu}>
                            <Text style={styles.title}>
                                Adicionar Novo Remédio
                            </Text>

                            <CustomTextInput
                                placeholder="Nome do remédio"
                                value={values.medicationName}
                                onChangeText={handleChange('medicationName')}
                                onBlur={handleBlur('medicationName')}
                                error={errors.medicationName}
                                touched={touched.medicationName}
                                icon={<Pill color={Colors.light.text} />}
                                autoCapitalize="none"
                            />

                            <CustomHourInput
                                placeholder="HH:MM"
                                value={values.hour}
                                onChangeText={handleChange('hour')}
                                onBlur={handleBlur('hour')}
                                touched={touched.hour}
                                error={errors.hour}
                                icon={<Clock color={Colors.light.text} />}
                            />

                            <CustomDropdownInput
                                placeholder="Selecione o intervalo"
                                value={selectedInterval}
                                onChangeText={(value) => {
                                    setSelectedInterval(value);
                                    setFieldValue('interval', value);
                                }}
                                onBlur={() => handleBlur('interval')}
                                touched={touched.interval}
                                error={errors.interval}
                                options={MEDICATION_INTERVALS}
                                icon={<Repeat color={Colors.light.text} />}
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
                            />

                            <CustomButton
                                text="Adicionar Remédio"
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            />
                        </View>
                    );
                }}
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
        position: 'relative',
        alignItems: 'center',
        backgroundColor: Colors.light.colorPrimary,
        borderRadius: 15,
        width: '90%',
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 20,
    },
    title: {
        fontSize: 18,
        color: Colors.light.text,
    },
});
