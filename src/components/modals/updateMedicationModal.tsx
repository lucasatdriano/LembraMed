import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '@/src/constants/Colors';
import { Calendar, Repeat, Clock, Pill } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import CustomButton from '@/src/components/buttons/customButton';
import { useState, useEffect } from 'react';
import CustomDateInput from '@/src/components/form/inputDateField';
import CustomDropdownInput from '@/src/components/form/inputDropdownField';
import CustomHourInput from '@/src/components/form/inputHourField';
import { MEDICATION_INTERVALS } from '@/src/constants/medicationIntervals';
import { medicationValidationSchema } from '@/src/validation/medicationValidation';
import medicationService from '@/src/service/api/medicationService';
import Formatters from '@/src/util/formatters';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    userId: string;
    medicationId: string;
    onMedicationUpdated?: () => void;
}

export default function UpdateMedicationModal({
    isVisible,
    setVisible,
    userId,
    medicationId,
    onMedicationUpdated,
}: ModalProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedInterval, setSelectedInterval] = useState<string | number>(
        '',
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialValues, setInitialValues] = useState({
        medicationName: '',
        hour: '',
        interval: '',
        period: '',
    });

    useEffect(() => {
        if (isVisible && medicationId) {
            fetchMedicationData();
        }
    }, [isVisible, medicationId]);

    async function fetchMedicationData() {
        try {
            const response = await medicationService.medication(
                userId,
                medicationId,
            );
            const formattedPeriod = Formatters.formatPeriod(
                response.periodStart,
                response.periodEnd,
            );
            setInitialValues({
                medicationName: response.medicationName,
                hour: response.hourFirstDose,
                interval: response.intervalInHours.toString(),
                period: formattedPeriod,
            });
            setSelectedDate(formattedPeriod);
            setSelectedInterval(response.intervalInHours.toString());
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro ao carregar os dados do medicamento.',
                );
            }
        }
    }

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

            await medicationService.updateMedication(
                userId,
                medicationId,
                values.medicationName,
                values.hour,
                Number(values.interval),
                periodStart,
                periodEnd,
            );

            setVisible(false);

            formikHelpers.resetForm();
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro inesperado ao atualizar o medicamento.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteMedication() {
        try {
            Alert.alert(
                'Confirmar Remoção',
                'Tem certeza que deseja remover este medicamento?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Remover',
                        onPress: async () => {
                            setIsSubmitting(true);
                            await medicationService.deleteMedication(
                                userId,
                                medicationId,
                            );

                            setVisible(false);
                            if (onMedicationUpdated) {
                                onMedicationUpdated();
                            }
                        },
                    },
                ],
                { cancelable: true },
            );
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro inesperado ao remover o medicamento.',
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
                initialValues={initialValues}
                validationSchema={medicationValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
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
                        />

                        <View style={styles.containerButtons}>
                            <CustomButton
                                text="Atualizar Remédio"
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                            />

                            <CustomButton
                                text="Remover Remédio"
                                onPress={handleDeleteMedication}
                                backgroundColor={Colors.light.error}
                                disabled={isSubmitting}
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
        width: '95%',
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
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
});
