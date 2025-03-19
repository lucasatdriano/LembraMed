import * as Yup from 'yup';

const validation = {
    medicationName: Yup.string().required('Nome do remédio é obrigatório'),
    hour: Yup.string().required('Horário é obrigatório'),
    interval: Yup.string().required('Intervalo é obrigatório'),
    period: Yup.string().nullable(),
};

export const medicationValidationSchema = Yup.object().shape({
    medicationName: validation.medicationName,
    hour: validation.hour,
    interval: validation.interval,
    period: validation.period,
});
