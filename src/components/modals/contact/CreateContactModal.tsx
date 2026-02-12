'use client';

import React, { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import CustomButton from '@/components/buttons/CustomButton';
import contactService from '@/services/domains/contactService';
import Masks from '@/utils/masks';
import { ContactFormData, contactValidationSchema } from '@/validations';
import InputTextField from '@/components/forms/InputTextField';

interface CreateContactModalProps {
    visible: boolean;
    onClose: () => void;
    onContactCreated?: () => void;
}

export default function CreateContactModal({
    visible,
    onClose,
    onContactCreated,
}: CreateContactModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, touchedFields },
        setValue,
        watch,
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactValidationSchema),
    });

    const handleFormSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            await contactService.createContact({
                contactName: data.contactName,
                numberPhone: Masks.unmask(data.phoneNumber),
            });

            reset();
            onClose();
            onContactCreated?.();
        } catch (error) {
            console.error('Erro ao criar contato:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocorreu um erro inesperado ao adicionar o contato.');
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="div"
                                    className="flex justify-between items-center mb-4"
                                >
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Adicionar Novo Contato
                                    </h3>
                                    <button
                                        title="Fechar"
                                        aria-label="Fechar"
                                        type="button"
                                        onClick={handleClose}
                                        className="p-2 cursor-pointer hover:bg-black/15 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-600" />
                                    </button>
                                </Dialog.Title>

                                <form
                                    onSubmit={handleSubmit(handleFormSubmit)}
                                    className="space-y-4"
                                >
                                    <InputTextField
                                        placeholder="Nome do contato"
                                        value={watch('contactName') || ''}
                                        onChange={(value) =>
                                            setValue('contactName', value)
                                        }
                                        onBlur={() => {}}
                                        touched={touchedFields.contactName}
                                        error={errors.contactName?.message}
                                        icon={User}
                                    />

                                    <InputTextField
                                        placeholder="Número de telefone"
                                        value={watch('phoneNumber') || ''}
                                        onChange={(value) => {
                                            const formattedValue =
                                                Masks.phone(value);
                                            setValue(
                                                'phoneNumber',
                                                formattedValue,
                                            );
                                        }}
                                        onBlur={() => {}}
                                        touched={touchedFields.phoneNumber}
                                        error={errors.phoneNumber?.message}
                                        icon={Phone}
                                        maxLength={15}
                                    />

                                    <CustomButton
                                        title="Adicionar Contato"
                                        aria-label="Adicionar Contato"
                                        type="submit"
                                        text="Adicionar Contato"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        className="w-full"
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
