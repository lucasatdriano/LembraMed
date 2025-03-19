import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '@/src/constants/Colors';
import { User2, Phone } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import CustomButton from '@/src/components/buttons/customButton';
import CustomTextInput from '@/src/components/form/inputTextField';
import { contactValidationSchema } from '@/src/validation/contactValidation';
import contactService from '@/src/service/api/contactService';
import Formatters from '@/src/util/formatters';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    userId: string;
    onContactCreated?: () => void;
}

export default function CreateContactModal({
    isVisible,
    setVisible,
    userId,
    onContactCreated,
}: ModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        try {
            setIsSubmitting(true);

            const response = await contactService.createContact(
                userId,
                values.contactName,
                values.phoneNumber.replace(/\D/g, ''),
            );

            setVisible(false);
            if (onContactCreated) {
                onContactCreated();
            }

            formikHelpers.resetForm();
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro inesperado ao adicionar o contato.',
                );
            }
        } finally {
            setIsSubmitting(false);
            formikHelpers.resetForm();
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
                    contactName: '',
                    phoneNumber: '',
                }}
                validationSchema={contactValidationSchema}
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
                            maxLength={15}
                            value={values.phoneNumber}
                            onChangeText={(text) => {
                                const formattedText =
                                    Formatters.formatPhoneNumber(text);
                                setFieldValue('phoneNumber', formattedText);
                            }}
                            onBlur={handleBlur('phoneNumber')}
                            error={errors.phoneNumber}
                            touched={touched.phoneNumber}
                            icon={<Phone />}
                            autoCapitalize="none"
                        />

                        <CustomButton
                            text="Adicionar Contato"
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
