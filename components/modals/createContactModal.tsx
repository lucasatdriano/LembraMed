import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '@/constants/Colors';
import { User2, Phone } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../buttons/customButton';
import CustomTextInput from '../form/inputTextField';
import { useState } from 'react';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function createContactModal({
    isVisible,
    setVisible,
}: ModalProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedInterval, setSelectedInterval] = useState<string | number>(
        '',
    );

    const validationSchema = Yup.object().shape({
        contactName: Yup.string().required('Nome do contato é obrigatório'),
        phoneNumber: Yup.string().required('Número de telefone é obrigatório'),
    });

    async function handleSubmit(
        values: {
            contactName: string;
            phoneNumber: string;
        },
        formikHelpers: FormikHelpers<{
            contactName: string;
            phoneNumber: string;
        }>,
    ) {
        console.log('Contato Adicionado:', values);
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
                    contactName: '',
                    phoneNumber: '',
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
                        <Text style={styles.title}>Adicionar Novo Contato</Text>

                        <CustomTextInput
                            placeholder="Nome do contato"
                            value={values.contactName}
                            onChangeText={handleChange('contactName')}
                            onBlur={handleBlur('contactName')}
                            error={errors.contactName}
                            touched={touched.contactName}
                            icon={<User2 />}
                            autoCapitalize="none"
                        />

                        <CustomTextInput
                            placeholder="Número de telefone"
                            value={values.phoneNumber}
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={handleBlur('phoneNumber')}
                            error={errors.phoneNumber}
                            touched={touched.phoneNumber}
                            icon={<Phone />}
                            autoCapitalize="none"
                        />

                        <CustomButton
                            text="Adicionar Contato"
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
