import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Pill, Clock, Calendar, Repeat } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import { MEDICATION_INTERVALS } from '@/src/constants/medicationIntervals';
import { medicationValidationSchema } from '@/src/validation/medicationValidation';
import Colors from '@/src/constants/Colors';
import CustomButton from '@/src/components/buttons/customButton';
import CustomTextInput from '@/src/components/form/inputTextField';
import CustomHourInput from '@/src/components/form/inputHourField';
import CustomDropdownInput from '@/src/components/form/inputDropdownField';
import CustomDateInput from '@/src/components/form/inputDateField';
import medicationService from '@/src/service/api/medicationService';
import Formatters from '@/src/util/formatters';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    userId: string;
    onMedicationCreated?: () => void;
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

            formikHelpers.resetForm();
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
                        <Text style={styles.title}>Adicionar Novo Remédio</Text>

                        <CustomTextInput
                            placeholder="Nome do remédio"
                            value={values.medicationName}
                            onChangeText={handleChange('medicationName')}
                            onBlur={handleBlur('medicationName')}
                            error={errors.medicationName}
                            touched={touched.medicationName}
                            icon={<Pill />}
                            autoCapitalize="none"
                        />

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
                            placeholder="selecione o intervalo"
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
                        />

                        <CustomButton
                            text="Adicionar Remédio"
                            onPress={() => handleSubmit()}
                            disabled={isSubmitting}
                        />
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
        width: '90%',
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 2, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        color: Colors.light.text,
    },
});
