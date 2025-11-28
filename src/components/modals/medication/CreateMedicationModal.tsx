'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Clock, Repeat, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import InputDateField from '@/components/forms/InputDateField';
import InputDropdownField from '@/components/forms/InputDropdownField';
import InputHourField from '@/components/forms/InputHourField';
import InputTextField from '@/components/forms/InputTextField';
import CustomButton from '@/components/buttons/CustomButton';
import { MEDICATION_INTERVALS } from '@/constants/medicationIntervals';
import medicationService from '@/services/domains/medicationService';
import Formatters from '@/utils/formatters';
import { MedicationFormData, medicationValidationSchema } from '@/validations';

interface CreateMedicationModalProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
    onMedicationCreated?: () => void;
}

export default function CreateMedicationModal({
    visible,
    onClose,
    userId,
    onMedicationCreated,
}: CreateMedicationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setValue,
        watch,
        reset,
    } = useForm<MedicationFormData>({
        resolver: zodResolver(medicationValidationSchema),
    });

    useEffect(() => {
        if (!visible) {
            reset();
        }
    }, [visible, reset]);

    const handleFormSubmit = async (data: MedicationFormData) => {
        setIsSubmitting(true);
        try {
            const { start: periodStart, end: periodEnd } =
                Formatters.splitPeriod(data.period!);

            const formattedPeriodStart = Formatters.formatToISO(periodStart);
            const formattedPeriodEnd = Formatters.formatToISO(periodEnd);

            await medicationService.createMedication(userId, {
                name: data.medicationName,
                hourfirstdose: data.hour,
                intervalinhours: Number(data.interval),
                periodstart: formattedPeriodStart,
                periodend: formattedPeriodEnd,
            });

            reset();
            onClose();
            onMedicationCreated?.();
        } catch (error) {
            console.error('Erro ao criar medicamento:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocorreu um erro inesperado ao criar o medicamento.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Transition appear show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                                    <Dialog.Title className="text-xl font-bold text-gray-900">
                                        Adicionar Novo Medicamento
                                    </Dialog.Title>
                                    <button
                                        title="Fechar"
                                        aria-label="Fechar"
                                        type="button"
                                        onClick={handleClose}
                                        className="p-2 hover:bg-black/15 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit(handleFormSubmit)}
                                    className="p-6 space-y-4"
                                >
                                    <InputTextField
                                        placeholder="Nome do medicamento"
                                        value={watch('medicationName') || ''}
                                        onChange={(value) =>
                                            setValue('medicationName', value)
                                        }
                                        onBlur={() => {}}
                                        touched={touchedFields.medicationName}
                                        error={errors.medicationName?.message}
                                        icon={Pill}
                                        required
                                    />

                                    <InputHourField
                                        placeholder="HH:MM"
                                        value={watch('hour') || ''}
                                        onChange={(value) =>
                                            setValue('hour', value)
                                        }
                                        onBlur={() => {}}
                                        touched={touchedFields.hour}
                                        error={errors.hour?.message}
                                        icon={<Clock className="w-5 h-5" />}
                                    />

                                    <div className="relative">
                                        <InputDropdownField
                                            placeholder="Selecione o intervalo"
                                            value={watch('interval') || ''}
                                            onChange={(value) =>
                                                setValue(
                                                    'interval',
                                                    value.toString(),
                                                )
                                            }
                                            onBlur={() => {}}
                                            touched={touchedFields.interval}
                                            error={errors.interval?.message}
                                            options={MEDICATION_INTERVALS}
                                            icon={
                                                <Repeat className="w-5 h-5" />
                                            }
                                        />
                                    </div>

                                    <InputDateField
                                        placeholder="Selecione o período destinado"
                                        value={watch('period') || ''}
                                        onChange={(value) =>
                                            setValue('period', value)
                                        }
                                        onBlur={() => {}}
                                        touched={touchedFields.period}
                                        error={errors.period?.message}
                                    />

                                    <CustomButton
                                        title="Adicionar Medicamento"
                                        aria-label="Adicionar Medicamento"
                                        type="submit"
                                        text="Adicionar Medicamento"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        className="w-full mt-4"
                                    />
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
