import CustomButton from '@/src/components/buttons/customButton';
import CustomTextInput from '@/src/components/form/inputTextField';
import { Text, View } from '@/src/components/ui/Themed';
import Colors from '@/src/constants/colors';
import userService from '@/src/service/domains/userService';
import { registerValidationSchema } from '@/src/validation/userValidation';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { Alert } from 'react-native';
import authScreenStyles from './styles/authScreensStyles';

export default function RegistrationScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    async function handleSubmit(
        values: { name: string; password: string; confirmPassword: string },
        formikHelpers: FormikHelpers<{
            name: string;
            password: string;
            confirmPassword: string;
        }>,
    ) {
        try {
            await userService.register(values.name, values.password);

            router.replace('/login');
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert('Erro', 'Ocorreu um erro ao se cadastrar.');
            }
        } finally {
            formikHelpers.setSubmitting(false);
        }
    }

    function navigationToLogin() {
        router.replace('/login');
    }

    return (
        <View style={authScreenStyles.pageContainer}>
            <Formik
                initialValues={{
                    name: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={registerValidationSchema}
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
                    <View style={authScreenStyles.formContainer}>
                        <Text style={authScreenStyles.title}>Cadastrar</Text>

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

                        <CustomTextInput
                            placeholder="Confirme sua senha"
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                            icon={
                                <Feather
                                    name="lock"
                                    size={24}
                                    color={Colors.light.text}
                                />
                            }
                            isPasswordField={true}
                            showPassword={showConfirmPassword}
                            togglePasswordVisibility={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        />

                        <View style={authScreenStyles.buttonsContainer}>
                            <CustomButton
                                text="Cadastrar"
                                onPress={handleSubmit}
                            />
                            <View style={authScreenStyles.separatorContainer}>
                                <View style={authScreenStyles.separator} />
                                <Text style={authScreenStyles.separatorText}>
                                    ou
                                </Text>
                            </View>
                            <CustomButton
                                text="Ir para o Login"
                                onPress={navigationToLogin}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
}
