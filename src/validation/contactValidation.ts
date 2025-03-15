import * as Yup from 'yup';

const validation = {
    contactName: Yup.string().required('Nome do contato é obrigatório'),
    phoneNumber: Yup.string().required('Número de telefone é obrigatório'),
};

export const contactValidationSchema = Yup.object().shape({
    contactName: validation.contactName,
    phoneNumber: validation.phoneNumber,
});
