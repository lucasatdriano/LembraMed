import { useState } from 'react';
import { Alert } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { LockKeyhole, User } from 'lucide-react-native';
import CustomButton from '@/components/buttons/customButton';
import { authScreenStyles } from './styles/authScreensStyles';
import { Text, View } from '@/components/ui/Themed';
import CustomTextInput from '@/components/form/inputTextField';

export default function RegistrationScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Nome de usuário obrigatório'),
        password: Yup.string()
            .min(4, 'A senha deve ter no mínimo 4 caracteres')
            .required('Senha obrigatória'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'As senhas devem ser iguais')
            .required('Confirmação de senha obrigatória'),
    });

    function handleSubmit(
        values: { username: string; password: string; confirmPassword: string },
        formikHelpers: FormikHelpers<{
            username: string;
            password: string;
            confirmPassword: string;
        }>,
    ) {
        Alert.alert(
            'Cadastro',
            `Usuário: ${values.username}\nSenha: ${values.password}\nConfirmação de senha: ${values.confirmPassword}`,
        );
    }

    function navigationToLogin() {
        router.replace('/login');
    }

    return (
        <View style={authScreenStyles.pageContainer}>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    confirmPassword: '',
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
                }) => (
                    <View style={authScreenStyles.formContainer}>
                        <Text style={authScreenStyles.title}>Cadastrar</Text>

                        <CustomTextInput
                            placeholder="Nome de usuário"
                            value={values.username}
                            onChangeText={handleChange('username')}
                            onBlur={handleBlur('username')}
                            error={errors.username}
                            touched={touched.username}
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

                        <CustomTextInput
                            placeholder="Confirme sua senha"
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                            icon={<LockKeyhole />}
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
                                text="Login"
                                onPress={navigationToLogin}
                            />
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
}
