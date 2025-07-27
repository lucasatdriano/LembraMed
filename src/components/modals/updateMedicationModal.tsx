import CustomButton from '@/src/components/buttons/customButton';
import CustomDateInput from '@/src/components/form/inputDateField';
import CustomDropdownInput from '@/src/components/form/inputDropdownField';
import Colors from '@/src/constants/colors';
import { MEDICATION_INTERVALS } from '@/src/constants/medicationIntervals';
import medicationService from '@/src/service/domains/medicationService';
import Formatters from '@/src/util/formatters';
import { medicationValidationSchema } from '@/src/validation/medicationValidation';
import { Formik, FormikHelpers } from 'formik';
import { Pill, Repeat } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import CustomTextInput from '../form/inputTextField';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialValues, setInitialValues] = useState({
        medicationName: '',
        interval: '',
        period: '',
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchMedicationData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await medicationService.medication(
                userId,
                medicationId,
            );
            const formattedPeriod = Formatters.formatPeriod(
                response.periodstart,
                response.periodend,
            );

            setInitialValues({
                medicationName: response.name,
                interval: String(response.doseinterval.intervalinhours),
                period: formattedPeriod,
            });
            setSelectedDate(formattedPeriod);
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro ao carregar os dados do medicamento.',
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [userId, medicationId]);

    useEffect(() => {
        if (isVisible && medicationId) {
            fetchMedicationData();
        } else {
            setIsLoading(false);
        }
    }, [isVisible, medicationId, fetchMedicationData]);

    async function handleSubmit(
        values: {
            medicationName: string;
            interval: string;
            period: string;
        },
        formikHelpers: FormikHelpers<{
            medicationName: string;
            interval: string;
            period: string;
        }>,
    ) {
        try {
            setIsSubmitting(true);

            const { start: periodStart, end: periodEnd } =
                Formatters.splitPeriod(values.period);

            await medicationService.updateMedication(userId, medicationId, {
                medicationName: values.medicationName,
                intervalInHours: Number(values.interval),
                periodStart: periodStart,
                periodEnd: periodEnd,
            });

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
            {isLoading ? (
                <ActivityIndicator
                    size="large"
                    color={Colors.light.colorPrimary}
                />
            ) : (
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
                            <Text style={styles.title}>
                                Atualizar Medicamento
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

                            <CustomDropdownInput
                                placeholder="Selecione o intervalo"
                                value={values.interval}
                                onChangeText={(value) => {
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
            )}
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
    },
    title: {
        fontSize: 20,
    },
    containerButtons: {
        justifyContent: 'center',
        gap: 10,
    },
});
