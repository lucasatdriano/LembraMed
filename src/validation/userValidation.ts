import * as Yup from 'yup';

const validation = {
    name: Yup.string().required('Nome de usuário obrigatório'),
    password: Yup.string()
        .min(4, 'A senha deve ter no mínimo 4 caracteres')
        .required('Senha obrigatória'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'As senhas devem ser iguais')
        .required('Confirmação de senha obrigatória'),
};

export const loginValidationSchema = Yup.object().shape({
    name: validation.name,
    password: validation.password,
});

export const registerValidationSchema = Yup.object().shape({
    name: validation.name,
    password: validation.password,
    confirmPassword: validation.confirmPassword,
});
