import { View, Text, StyleSheet, TextInput } from 'react-native';
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

export default function updateContactModal({
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
        console.log('Contato Atualizado:', values);
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
                        {/* <Text style={styles.title}>Atualizar Contato</Text> */}

                        <View style={styles.inputWrapperErrorContainer}>
                            <View style={styles.inputContainer}>
                                <User2 style={styles.iconInput} />

                                <TextInput
                                    style={styles.inputTitle}
                                    placeholder="Nome do contato"
                                    value={values.contactName}
                                    onChangeText={handleChange('contactName')}
                                    onBlur={handleBlur('contactName')}
                                    placeholderTextColor="#888"
                                />
                            </View>
                            {touched.contactName && errors.contactName && (
                                <Text style={styles.errorText}>
                                    {errors.contactName}
                                </Text>
                            )}
                        </View>

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

                        <View style={styles.containerButtons}>
                            <CustomButton
                                text="Atualizar Contato"
                                onPress={() => handleSubmit()}
                            />

                            <CustomButton
                                text="Remover Contato"
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
