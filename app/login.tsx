import { useState } from 'react';
import { Alert } from 'react-native';
import { LockKeyhole, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Text, View } from '@/components/ui/Themed';
import { authScreenStyles } from './styles/authScreensStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '@/components/buttons/customButton';
import CustomTextInput from '@/components/form/inputTextField';

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Nome de usuário obrigatório'),
        password: Yup.string()
            .min(4, 'A senha deve ter no mínimo 4 caracteres')
            .required('Senha obrigatória'),
    });

    async function handleSubmit(
        values: { username: string; password: string },
        formikHelpers: FormikHelpers<{ username: string; password: string }>,
    ) {
        try {
            // Simulação de autenticação (trocar por API real)
            if (
                values.username === 'admin' &&
                values.password === 'S0crates8'
            ) {
                const fakeToken = 'token123'; // Troque pelo token real da API
                await AsyncStorage.setItem('token', fakeToken);
                router.replace('/(tabs)');
            } else {
                Alert.alert('Erro', 'Usuário ou senha incorretos');
            }
        } catch (error) {
            console.error('Erro ao salvar token', error);
        }
    }

    function navigationToRegistration() {
        router.replace('/registration');
    }

    return (
        <View style={authScreenStyles.pageContainer}>
            <Formik
                initialValues={{ username: '', password: '' }}
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
                        <Text style={authScreenStyles.title}>Login</Text>

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
