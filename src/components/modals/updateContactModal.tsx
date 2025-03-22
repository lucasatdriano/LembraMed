import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { User2, Phone } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import { contactValidationSchema } from '@/src/validation/contactValidation';
import Colors from '@/src/constants/Colors';
import CustomButton from '@/src/components/buttons/customButton';
import CustomTextInput from '@/src/components/form/inputTextField';
import contactService from '@/src/service/api/contactService';
import Formatters from '@/src/util/formatters';

interface ModalProps {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    userId: string;
    contactId: string;
    onContactUpdated?: () => void;
}

export default function UpdateContactModal({
    isVisible,
    setVisible,
    userId,
    contactId,
    onContactUpdated,
}: ModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialValues, setInitialValues] = useState({
        contactName: '',
        phoneNumber: '',
    });

    useEffect(() => {
        if (isVisible && contactId) {
            fetchContactData();
        }
    }, [isVisible, contactId]);

    async function fetchContactData() {
        try {
            const response = await contactService.contact(userId, contactId);
            setInitialValues({
                contactName: response.name,
                phoneNumber: response.numberphone,
            });
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro ao carregar os dados do contato.',
                );
            }
        }
    }

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

            await contactService.updateContact(userId, contactId, {
                contactName: values.contactName,
                numberPhone: values.phoneNumber.replace(/\D/g, ''),
            });

            if (onContactUpdated) {
                onContactUpdated();
            }
            setVisible(false);

            formikHelpers.resetForm();
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert(
                    'Erro',
                    'Ocorreu um erro inesperado ao atualizar o contato.',
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteContact() {
        try {
            Alert.alert(
                'Confirmar Remoção',
                'Tem certeza que deseja remover este contato?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel',
                    },
                    {
                        text: 'Remover',
                        onPress: async () => {
                            setIsSubmitting(true);
                            await contactService.deleteContact(
                                userId,
                                contactId,
                            );

                            setVisible(false);
                            if (onContactUpdated) {
                                onContactUpdated();
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
                    'Ocorreu um erro inesperado ao remover o contato.',
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
                validationSchema={contactValidationSchema}
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
                        <Text style={styles.title}>Atualizar Contato</Text>

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

                        <View style={styles.containerButtons}>
                            <CustomButton
                                text="Atualizar Contato"
                                onPress={() => handleSubmit()}
                                disabled={isSubmitting}
                            />

                            <CustomButton
                                text="Remover Contato"
                                onPress={handleDeleteContact}
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
        fontSize: 20,
    },
    containerButtons: {
        justifyContent: 'center',
        gap: 10,
    },
});
