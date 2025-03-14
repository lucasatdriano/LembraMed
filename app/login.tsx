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

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Nome de usuário obrigatório'),
        password: Yup.string()
            .min(4, 'A senha deve ter no mínimo 4 caracteres')
            .required('Senha obrigatória'),
    });

    function handleSubmit(
        values: { username: string; password: string },
        formikHelpers: FormikHelpers<{ username: string; password: string }>,
    ) {
        Alert.alert(
            'Login',
            `Usuário: ${values.username}\nSenha: ${values.password}`,
        );
    }

    function navigationToRegistration() {
        navigation.navigate('registration');
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

                        <View style={authScreenStyles.buttonsContainer}>
                            <Pressable
                                style={authScreenStyles.button}
                                onPress={() => handleSubmit()}
                            >
                                <Text style={authScreenStyles.buttonText}>
                                    Entrar
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
                                onPress={navigationToRegistration}
                            >
                                <Text style={authScreenStyles.buttonText}>
                                    Cadastre-se
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    );
}
