import { useState } from 'react';
import { StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Eye, EyeClosed, LockKeyhole, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { authScreenStyles } from './styles/authScreensStyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from './types/types';

export default function RegistrationScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Nome de usuário obrigatório'),
        password: Yup.string()
            .min(4, 'A senha deve ter no mínimo 4 caracteres')
            .required('Senha obrigatória'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'As senhas devem coincidir')
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
        navigation.navigate('login');
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

                        <View
                            style={authScreenStyles.inputWrapperErrorContainer}
                        >
                            <View style={authScreenStyles.inputContainer}>
                                <User style={authScreenStyles.iconInput} />
                                <TextInput
                                    style={authScreenStyles.input}
                                    placeholder="Nome de usuário"
                                    value={values.username}
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    placeholderTextColor="#888"
                                    autoCapitalize="none"
                                />
                            </View>
                            {touched.username && errors.username && (
                                <Text style={authScreenStyles.errorText}>
                                    {errors.username}
                                </Text>
                            )}
                        </View>

                        <View
                            style={authScreenStyles.inputWrapperErrorContainer}
                        >
                            <View style={authScreenStyles.inputContainer}>
                                <LockKeyhole
                                    style={authScreenStyles.iconInput}
                                />
                                <TextInput
                                    style={authScreenStyles.input}
                                    placeholder="Senha"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    placeholderTextColor="#888"
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable
                                    onPress={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={authScreenStyles.iconEye}
                                >
                                    {showPassword ? <EyeClosed /> : <Eye />}
                                </Pressable>
                            </View>
                            {touched.password && errors.password && (
                                <Text style={authScreenStyles.errorText}>
                                    {errors.password}
                                </Text>
                            )}
                        </View>

                        <View
                            style={authScreenStyles.inputWrapperErrorContainer}
                        >
                            <View style={authScreenStyles.inputContainer}>
                                <LockKeyhole
                                    style={authScreenStyles.iconInput}
                                />
                                <TextInput
                                    style={authScreenStyles.input}
                                    placeholder="Confirme sua senha"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange(
                                        'confirmPassword',
                                    )}
                                    onBlur={handleBlur('confirmPassword')}
                                    placeholderTextColor="#888"
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <Pressable
                                    onPress={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    style={authScreenStyles.iconEye}
                                >
                                    {showConfirmPassword ? (
                                        <EyeClosed />
                                    ) : (
                                        <Eye />
                                    )}
                                </Pressable>
                            </View>
                            {touched.confirmPassword &&
                                errors.confirmPassword && (
                                    <Text style={authScreenStyles.errorText}>
                                        {errors.confirmPassword}
                                    </Text>
                                )}
                        </View>

                        <View style={authScreenStyles.buttonsContainer}>
                            <Pressable
                                style={authScreenStyles.button}
                                onPress={() => handleSubmit()}
                            >
                                <Text style={authScreenStyles.buttonText}>
                                    Cadastrar
                                </Text>
                            </Pressable>
                            <View style={authScreenStyles.separatorContainer}>
                                <View style={authScreenStyles.separator} />
                                <Text style={authScreenStyles.separatorText}>
                                    ou
                                </Text>
                            </View>
                            <Pressable
                                style={authScreenStyles.button}
                                onPress={navigationToLogin}
                            >
                                <Text style={authScreenStyles.buttonText}>
                                    Login
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
}
