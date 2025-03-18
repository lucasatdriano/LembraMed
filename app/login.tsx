import { useState } from 'react';
import { Alert } from 'react-native';
import { LockKeyhole, User } from 'lucide-react-native';
import { Formik, FormikHelpers } from 'formik';
import { Text, View } from '@/src/components/ui/Themed';
import authScreenStyles from './styles/authScreensStyles';
import { useRouter } from 'expo-router';
import CustomButton from '@/src/components/buttons/customButton';
import CustomTextInput from '@/src/components/form/inputTextField';
import { loginValidationSchema } from '@/src/validation/userValidation';
import userService from '@/src/service/api/userService';
import { localStorageUtil } from '@/src/util/localStorageUtil';

export default function LoginScreen() {
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

            if (!response.accessToken || !response.id) {
                throw new Error('Dados de autenticação inválidos.');
            }

            await localStorageUtil.set('userId', response.id);
            await localStorageUtil.set('accessToken', response.accessToken);
            await localStorageUtil.set('refreshToken', response.refreshToken);

            router.replace('/(tabs)');
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

    function navigationToRegistration() {
        router.replace('/registration');
    }

    return (
        <View style={authScreenStyles.pageContainer}>
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
                    <View style={authScreenStyles.formContainer}>
                        <Text style={authScreenStyles.title}>Login</Text>

                        <CustomTextInput
                            placeholder="Nome de usuário"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            error={errors.name}
                            touched={touched.name}
                            icon={<User />}
                            autoCapitalize="none"
                        />

                        <CustomTextInput
                            placeholder="Senha"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            error={errors.password}
                            touched={touched.password}
                            icon={<LockKeyhole />}
                            isPasswordField={true}
                            showPassword={showPassword}
                            togglePasswordVisibility={() =>
                                setShowPassword(!showPassword)
                            }
                        />

                        <View style={authScreenStyles.buttonsContainer}>
                            <CustomButton
                                text="Entrar"
                                onPress={() => handleSubmit()}
                            />
                            <View style={authScreenStyles.separatorContainer}>
                                <View style={authScreenStyles.separator} />
                                <Text style={authScreenStyles.separatorText}>
                                    ou
                                </Text>
                            </View>
                            <CustomButton
                                text="Cadastre-se"
                                onPress={navigationToRegistration}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
}
