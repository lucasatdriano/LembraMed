import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '@/constants/Colors';
import { Pill, Clock, Calendar, Repeat } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../buttons/customButton';
import CustomTextInput from '../form/inputTextField';
import { useState } from 'react';
import CustomHourInput from '../form/inputHourField';
import CustomDropdownInput from '../form/inputDropdownField';
import CustomDateInput from '../form/inputDateField';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function CreateMedicationModal({
    isVisible,
    setVisible,
}: ModalProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedInterval, setSelectedInterval] = useState<string | number>(
        '',
    );

    const validationSchema = Yup.object().shape({
        medicationName: Yup.string().required('Nome do remédio é obrigatório'),
        hour: Yup.string().required('Horário é obrigatório'),
        interval: Yup.string().required('Intervalo é obrigatório'),
    });

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
        console.log('Remédio Adicionado:', values);
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
                validationSchema={validationSchema}
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
                            placeholder="Escolha o intervalo entre as doses"
                            value={selectedInterval}
                            onChangeText={(value) => {
                                setSelectedInterval(value);
                                setFieldValue('interval', value);
                            }}
                            onBlur={() => handleBlur('interval')}
                            touched={touched.interval}
                            error={errors.interval}
                            options={[
                                { label: 'A cada 8 horas', value: '8h' },
                                { label: 'A cada 7 horas', value: '7h' },
                                { label: 'A cada 6 horas', value: '6h' },
                            ]}
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
                            icon={<Calendar />}
                        />

                        <CustomButton
                            text="Adicionar Remédio"
                            onPress={() => handleSubmit()}
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
        padding: 20,
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
