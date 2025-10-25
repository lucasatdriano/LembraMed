'use client';

import React, { useCallback, useEffect, useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import CustomButton from '@/components/buttons/CustomButton';
import contactService from '@/services/domains/contactService';
import Masks from '@/utils/masks';
import { ContactFormData, contactValidationSchema } from '@/validations';
import InputTextField from '@/components/forms/InputTextField';

interface UpdateContactModalProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
    contactId: string;
    onContactUpdated?: () => void;
}

export default function UpdateContactModal({
    visible,
    onClose,
    userId,
    contactId,
    onContactUpdated,
}: UpdateContactModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    const fetchContactData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await contactService.contact(userId, contactId);

            setValue('contactName', response.name);
            setValue('phoneNumber', Masks.phone(response.numberphone));
        } catch (error) {
            console.error('Erro ao carregar contato:', error);
            alert('Erro ao carregar os dados do contato.');
        } finally {
            setIsLoading(false);
        }
    }, [userId, contactId, setValue]);

    useEffect(() => {
        if (visible && contactId) {
            fetchContactData();
        } else {
            reset();
            setIsLoading(false);
        }
    }, [visible, contactId, fetchContactData, reset]);

    const handleFormSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        try {
            await contactService.updateContact(userId, contactId, {
                contactName: data.contactName,
                numberPhone: Masks.unmask(data.phoneNumber),
            });

            reset();
            onClose();
            onContactUpdated?.();
        } catch (error) {
            console.error('Erro ao atualizar contato:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocorreu um erro inesperado ao atualizar o contato.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteContact = async () => {
        if (!confirm('Tem certeza que deseja remover este contato?')) {
            return;
        }

        setIsSubmitting(true);
        try {
            await contactService.deleteContact(userId, contactId);
            onClose();
            onContactUpdated?.();
        } catch (error) {
            console.error('Erro ao excluir contato:', error);
            alert('Erro ao excluir contato.');
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
                                        Atualizar Contato
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
                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-button"></div>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmit(
                                                handleFormSubmit,
                                            )}
                                            className="space-y-4"
                                        >
                                            <InputTextField
                                                placeholder="Nome do contato"
                                                value={
                                                    watch('contactName') || ''
                                                }
                                                onChange={(value) =>
                                                    setValue(
                                                        'contactName',
                                                        value,
                                                    )
                                                }
                                                onBlur={() => {}}
                                                touched={
                                                    touchedFields.contactName
                                                }
                                                error={
                                                    errors.contactName?.message
                                                }
                                                icon={User}
                                            />

                                            <InputTextField
                                                placeholder="Número de telefone"
                                                value={
                                                    watch('phoneNumber') || ''
                                                }
                                                onChange={(value) => {
                                                    const formattedValue =
                                                        Masks.phone(value);
                                                    setValue(
                                                        'phoneNumber',
                                                        formattedValue,
                                                    );
                                                }}
                                                onBlur={() => {}}
                                                touched={
                                                    touchedFields.phoneNumber
                                                }
                                                error={
                                                    errors.phoneNumber?.message
                                                }
                                                icon={Phone}
                                                maxLength={15}
                                            />

                                            <div className="flex flex-col gap-3 pt-4">
                                                <CustomButton
                                                    title="Atualizar Contato"
                                                    aria-label="Atualizar Contato"
                                                    type="submit"
                                                    text="Atualizar Contato"
                                                    loading={isSubmitting}
                                                    disabled={isSubmitting}
                                                    className="w-full"
                                                />

                                                <CustomButton
                                                    title="Remover Contato"
                                                    aria-label="Remover Contato"
                                                    type="button"
                                                    text="Remover Contato"
                                                    onClick={
                                                        handleDeleteContact
                                                    }
                                                    loading={isSubmitting}
                                                    disabled={isSubmitting}
                                                    className="w-full bg-red-300 hover:bg-red-400 focus:ring-red-500"
                                                />
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
