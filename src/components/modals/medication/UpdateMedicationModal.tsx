'use client';

import React, { useCallback, useEffect, useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Repeat, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import InputDateField from '@/components/forms/InputDateField';
import InputDropdownField from '@/components/forms/InputDropdownField';
import InputTextField from '@/components/forms/InputTextField';
import CustomButton from '@/components/buttons/CustomButton';
import { MEDICATION_INTERVALS } from '@/constants/medicationIntervals';
import medicationService from '@/services/domains/medicationService';
import Formatters from '@/utils/formatters';
import {
    UpdateMedicationFormData,
    updateMedicationValidationSchema,
} from '@/validations';
import { Medication } from '@/interfaces/medication';
import MedicationHistoryModal from './HistoryMedicationModal';

interface UpdateMedicationModalProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
    medicationData: Medication;
    onMedicationUpdated?: () => void;
}

export default function UpdateMedicationModal({
    visible,
    onClose,
    userId,
    medicationData,
    onMedicationUpdated,
}: UpdateMedicationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);

    const {
        handleSubmit,
        formState: { errors, touchedFields },
        setValue,
        watch,
        reset,
    } = useForm<UpdateMedicationFormData>({
        resolver: zodResolver(updateMedicationValidationSchema),
    });

    useEffect(() => {
        if (medicationData) {
            const formattedPeriod = Formatters.formatPeriod(
                medicationData.periodstart,
                medicationData.periodend,
            );

            setValue('medicationName', medicationData.name);
            setValue(
                'interval',
                String(
                    medicationData.doseinterval?.intervalinhours ||
                        medicationData.intervalinhours,
                ),
            );
            setValue('period', formattedPeriod);
        }
    }, [medicationData, setValue]);

    useEffect(() => {
        if (visible && medicationData) {
            const formattedPeriod = Formatters.formatPeriod(
                medicationData.periodstart,
                medicationData.periodend,
            );

            setValue('medicationName', medicationData.name);
            setValue(
                'interval',
                String(
                    medicationData.doseinterval?.intervalinhours ||
                        medicationData.intervalinhours,
                ),
            );
            setValue('period', formattedPeriod);
        }
    }, [visible, medicationData, setValue]);

    const handleFormSubmit = async (data: UpdateMedicationFormData) => {
        setIsSubmitting(true);
        try {
            const { start: periodStart, end: periodEnd } =
                Formatters.splitPeriod(data.period!);

            const formattedPeriodStart = Formatters.formatToISO(periodStart);
            const formattedPeriodEnd = Formatters.formatToISO(periodEnd);

            await medicationService.updateMedication(
                userId,
                medicationData.id,
                {
                    name: data.medicationName,
                    intervalinhours: Number(data.interval),
                    periodstart: formattedPeriodStart,
                    periodend: formattedPeriodEnd,
                },
            );

            reset();
            onClose();
            onMedicationUpdated?.();
        } catch (error) {
            console.error('Erro ao atualizar medicamento:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocorreu um erro inesperado ao atualizar o medicamento.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteMedication = async () => {
        if (!confirm('Tem certeza que deseja remover este medicamento?')) {
            return;
        }

        setIsSubmitting(true);
        try {
            await medicationService.deleteMedication(userId, medicationData.id);
            onClose();
            onMedicationUpdated?.();
        } catch (error) {
            console.error('Erro ao excluir medicamento:', error);
            alert('Erro ao excluir medicamento.');
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <Dialog.Title className="text-xl font-bold text-gray-900">
                                        Atualizar Medicamento
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

                                <div className="p-6">
                                    <form
                                        onSubmit={handleSubmit(
                                            handleFormSubmit,
                                        )}
                                        className="space-y-4"
                                    >
                                        <InputTextField
                                            placeholder="Nome do medicamento"
                                            value={
                                                watch('medicationName') || ''
                                            }
                                            onChange={(value) =>
                                                setValue(
                                                    'medicationName',
                                                    value,
                                                )
                                            }
                                            onBlur={() => {}}
                                            touched={
                                                touchedFields.medicationName
                                            }
                                            error={
                                                errors.medicationName?.message
                                            }
                                            icon={Pill}
                                        />

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

                                        <div className="flex flex-col gap-3 pt-4">
                                            <CustomButton
                                                title="Atualizar Medicamento"
                                                aria-label="Atualizar Medicamento"
                                                type="submit"
                                                text="Atualizar Medicamento"
                                                loading={isSubmitting}
                                                disabled={isSubmitting}
                                                className="w-full bg-blue-200 hover:bg-blue-300 focus:ring-blue-300"
                                            />

                                            <CustomButton
                                                title="Ver Histórico"
                                                aria-label="Ver Histórico"
                                                text="Ver Histórico"
                                                onClick={() =>
                                                    setIsHistoryModalVisible(
                                                        true,
                                                    )
                                                }
                                                className="w-full bg-blue-200 hover:bg-blue-300 focus:ring-blue-300"
                                            />

                                            <CustomButton
                                                title="Remover Medicamento"
                                                aria-label="Remover Medicamento"
                                                text="Remover Medicamento"
                                                onClick={handleDeleteMedication}
                                                loading={isSubmitting}
                                                disabled={isSubmitting}
                                                className="w-full bg-red-300 hover:bg-red-400 focus:ring-red-400"
                                            />
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
                <MedicationHistoryModal
                    visible={isHistoryModalVisible}
                    onClose={() => setIsHistoryModalVisible(false)}
                    medicationData={medicationData}
                />
            </Dialog>
        </Transition>
    );
}
