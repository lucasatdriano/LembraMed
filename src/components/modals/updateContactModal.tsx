import CustomButton from '@/src/components/buttons/customButton';
import CustomTextInput from '@/src/components/form/inputTextField';
import Colors from '@/src/constants/colors';
import contactService from '@/src/service/domains/contactService';
import Formatters from '@/src/util/formatters';
import { contactValidationSchema } from '@/src/validation/contactValidation';
import { Feather } from '@expo/vector-icons';
import { Formik, FormikHelpers } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

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
    const [isLoading, setIsLoading] = useState(true);

    const fetchContactData = useCallback(async () => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    }, [userId, contactId]);

    useEffect(() => {
        if (isVisible && contactId) {
            fetchContactData();
        } else {
            setIsLoading(false);
        }
    }, [isVisible, contactId, fetchContactData]);

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
            <View style={styles.menu}>
                <Text style={styles.title}>Atualizar Contato</Text>

                {isLoading ? (
                    <ActivityIndicator
                        size="large"
                        color={Colors.light.colorPrimary}
                    />
                ) : (
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
                            <>
                                <CustomTextInput
                                    placeholder="Nome do contato"
                                    value={values.contactName}
                                    onChangeText={handleChange('contactName')}
                                    onBlur={handleBlur('contactName')}
                                    error={errors.contactName}
                                    touched={touched.contactName}
                                    icon={
                                        <Feather
                                            name="user"
                                            size={24}
                                            color={Colors.light.text}
                                        />
                                    }
                                    autoCapitalize="none"
                                />

                                <CustomTextInput
                                    placeholder="Número de telefone"
                                    maxLength={15}
                                    value={values.phoneNumber}
                                    onChangeText={(text) => {
                                        const formattedText =
                                            Formatters.formatPhoneNumber(text);
                                        setFieldValue(
                                            'phoneNumber',
                                            formattedText,
                                        );
                                    }}
                                    onBlur={handleBlur('phoneNumber')}
                                    error={errors.phoneNumber}
                                    touched={touched.phoneNumber}
                                    icon={
                                        <Feather
                                            name="phone"
                                            size={24}
                                            color={Colors.light.text}
                                        />
                                    }
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
                            </>
                        )}
                    </Formik>
                )}
            </View>
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
