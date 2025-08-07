import CustomButton from '@/src/components/buttons/customButton';
import CustomTextInput from '@/src/components/form/inputTextField';
import { Text, View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/colors';
import userService from '@/src/service/domains/userService';
import { secureStorageUtil } from '@/src/util/secureStorageUtil';
import { loginValidationSchema } from '@/src/validation/userValidation';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';

interface SwitchAccountModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
}

export default function SwitchAccountModal({
    visible,
    onClose,
    onLoginSuccess,
}: SwitchAccountModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(
        values: { name: string; password: string },
        formikHelpers: FormikHelpers<{ name: string; password: string }>,
    ) {
        try {
            const response = await userService.login(
                values.name,
                values.password,
            );

            if (!response.accesstoken || !response.id) {
                throw new Error('Dados de autenticação inválidos.');
            }

            await secureStorageUtil.set('userId', response.id);
            await secureStorageUtil.set('accessToken', response.accesstoken);
            await secureStorageUtil.set('refreshToken', response.refreshtoken);

            onClose();
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                router.replace('/(tabs)');
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
            }
        } finally {
            formikHelpers.setSubmitting(false);
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.modalContainer}>
                <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        <View style={styles.closeButtonContainer}>
                            <TouchableWithoutFeedback onPress={onClose}>
                                <Feather
                                    name="x"
                                    size={24}
                                    color={Colors.light.text}
                                />
                            </TouchableWithoutFeedback>
                        </View>

                        <Formik
                            initialValues={{ name: '', password: '' }}
                            validationSchema={loginValidationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                            }) => (
                                <View style={styles.formContainer}>
                                    <Text style={styles.title}>Login</Text>

                                    <CustomTextInput
                                        placeholder="Nome de usuário"
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        error={errors.name}
                                        touched={touched.name}
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
                                        placeholder="Senha"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        error={errors.password}
                                        touched={touched.password}
                                        icon={
                                            <Feather
                                                name="lock"
                                                size={24}
                                                color={Colors.light.text}
                                            />
                                        }
                                        isPasswordField={true}
                                        showPassword={showPassword}
                                        togglePasswordVisibility={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    />

                                    <View style={styles.buttonsContainer}>
                                        <CustomButton
                                            text="Entrar"
                                            onPress={() => handleSubmit()}
                                        />
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.light.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 40,
        shadowColor: Colors.light.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButtonContainer: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonsContainer: {
        marginTop: 20,
        gap: 10,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.light.text,
    },
    separatorText: {
        paddingHorizontal: 10,
        color: Colors.light.text,
    },
});
