'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Pill,
    Clock,
    Calendar,
    Check,
    AlertCircle,
    Repeat,
    X,
    Timer,
    CheckCircle2,
    InfoIcon,
} from 'lucide-react';
import { Medication } from '@/interfaces/medication';
import medicationService from '@/services/domains/medicationService';
import Formatters from '@/utils/formatters';
import UpdateMedicationModal from '../modals/medication/UpdateMedicationModal';

interface CardMedicationProps {
    medicationData: Medication;
    onUpdate?: () => void;
}

export default function CardMedication({
    medicationData: initialMedicationData,
    onUpdate,
}: CardMedicationProps) {
    const [medicationData, setMedicationData] = useState(initialMedicationData);
    const [nextDoseCountdown, setNextDoseCountdown] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [confirmationTimer, setConfirmationTimer] = useState<string | null>(
        null,
    );

    const lastTap = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const interval = medicationData?.doseinterval?.intervalinhours || 0;
    const label = interval === 1 ? 'hora' : 'horas';

    const isMedicationFinished = !medicationData?.hournextdose;

    useEffect(() => {
        setMedicationData(initialMedicationData);
    }, [initialMedicationData]);

    useEffect(() => {
        const hournextdose = medicationData?.hournextdose;

        if (!hournextdose) return;

        const updateCountdown = () => {
            const [hours, minutes] = hournextdose.split(':').map(Number);
            let nextDose = new Date();
            nextDose.setHours(hours, minutes, 0, 0);

            const now = new Date();

            if (nextDose < now) {
                const intervalHours =
                    medicationData?.doseinterval?.intervalinhours || 0;
                // Se o horário já passou hoje, adiciona o intervalo
                if (intervalHours > 0) {
                    nextDose = new Date(
                        nextDose.getTime() + intervalHours * 60 * 60 * 1000,
                    );
                }
            }

            const diffInSeconds = Math.floor(
                (nextDose.getTime() - now.getTime()) / 1000,
            );

            if (diffInSeconds <= 0) {
                setNextDoseCountdown('00:00:00');
                return;
            }

            const hoursLeft = Math.floor(diffInSeconds / 3600);
            const minutesLeft = Math.floor((diffInSeconds % 3600) / 60);
            const secondsLeft = diffInSeconds % 60;

            setNextDoseCountdown(
                `${String(hoursLeft).padStart(2, '0')}:${String(
                    minutesLeft,
                ).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`,
            );
        };

        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, [
        medicationData?.hournextdose,
        medicationData?.doseinterval?.intervalinhours,
    ]);

    useEffect(() => {
        if (
            !medicationData.pendingconfirmation ||
            !medicationData.pendinguntil
        ) {
            setConfirmationTimer(null);
            return;
        }

        const updateConfirmationTimer = () => {
            const pendinguntil = new Date(medicationData.pendinguntil!);
            const diffInSeconds = Math.floor(
                (pendinguntil.getTime() - Date.now()) / 1000,
            );

            if (diffInSeconds <= 0) {
                setConfirmationTimer(null);
                return;
            }

            const minutes = Math.floor(diffInSeconds / 60);
            const seconds = diffInSeconds % 60;
            setConfirmationTimer(
                `${minutes}:${String(seconds).padStart(2, '0')}`,
            );
        };

        updateConfirmationTimer();
        const intervalId = setInterval(updateConfirmationTimer, 1000);
        return () => clearInterval(intervalId);
    }, [medicationData.pendingconfirmation, medicationData.pendinguntil]);

    const handleMarkAsTaken = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response =
                await medicationService.registerPendingConfirmation(
                    medicationData.id,
                );

            setMedicationData((prev) => ({
                ...prev,
                pendingconfirmation: response.medication.pendingconfirmation,
                pendinguntil: response.medication.pendinguntil,
                hournextdose: response.medication.hournextdose,
            }));

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao marcar como tomado:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsNotTaken = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const response = await medicationService.cancelPendingDose(
                medicationData.id,
            );
            setMedicationData((prev) => ({
                ...prev,
                pendingconfirmation: false,
                pendinguntil: null,
                hournextdose: response.medication.hournextdose,
            }));
            setShowConfirmation(false);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao cancelar dose:', error);
        }
    };

    const handleCancelConfirmation = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const response = await medicationService.cancelPendingDose(
                medicationData.id,
            );
            setMedicationData((prev) => ({
                ...prev,
                pendingconfirmation: false,
                pendinguntil: null,
                hournextdose: response.medication.hournextdose,
            }));
            setShowConfirmation(false);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao cancelar confirmação:', error);
        }
    };

    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            timeoutRef.current && clearTimeout(timeoutRef.current);
            if (!isMedicationFinished) {
                setShowConfirmation(true);
            }
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                setIsUpdateModalVisible(true);
            }, DOUBLE_PRESS_DELAY);
        }
    };

    const getCardStyles = () => {
        const baseStyles =
            'bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-all cursor-pointer relative';

        if (isMedicationFinished) {
            return `${baseStyles} ring-2 ring-gray-400 border-gray-300`;
        }

        if (showConfirmation) {
            return `${baseStyles} ring-2 ring-yellow-400 border-yellow-300`;
        }

        if (medicationData.pendingconfirmation) {
            return `${baseStyles} border-green-500 bg-green-50`;
        }

        return `${baseStyles} border-gray-200 hover:border-blue-300`;
    };

    const getDoseStatusIcon = () => {
        if (isMedicationFinished) {
            return <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />;
        }

        if (medicationData.pendingconfirmation) {
            return <Check className="w-5 h-5 text-green-600 mr-2" />;
        }

        return <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />;
    };

    const getCountdownColor = () => {
        const [hours] = nextDoseCountdown.split(':').map(Number);
        if (hours < 1) {
            return 'text-orange-600';
        }

        return 'text-blue-600';
    };

    return (
        <>
            <div className={getCardStyles()} onClick={handlePress}>
                {showSuccess && (
                    <div className="absolute inset-0 bg-green-100 bg-opacity-90 rounded-lg flex items-center justify-center z-10">
                        <div className="text-center">
                            <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
                            <p className="text-green-800 font-semibold">
                                Dose registrada!
                            </p>
                            <p className="text-green-600 text-sm">
                                Aguardando confirmação de 3 minutos
                            </p>
                        </div>
                    </div>
                )}

                {showConfirmation && !isMedicationFinished && (
                    <div className="absolute inset-0 bg-yellow-100 bg-opacity-90 rounded-lg flex flex-col items-center justify-center z-10 p-4">
                        <div className="text-center">
                            <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-2" />
                            <h3 className="font-semibold text-yellow-800 mb-2">
                                {medicationData.pendingconfirmation
                                    ? 'Cancelar dose?'
                                    : 'Confirmar ação'}
                            </h3>
                            <p className=" text-sm text-yellow-700 mb-4">
                                {medicationData.pendingconfirmation
                                    ? 'Deseja marcar como NÃO TOMADO?'
                                    : 'Deseja marcar como TOMADO?'}
                            </p>
                            <div className="flex gap-3 justify-center">
                                {medicationData.pendingconfirmation ? (
                                    <>
                                        <button
                                            title="Cancelar dose"
                                            aria-label="Cancelar dose"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsNotTaken(e);
                                            }}
                                            className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Sim, não tomei
                                        </button>
                                        <button
                                            title="Cancelar confirmação"
                                            aria-label="Cancelar confirmação"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowConfirmation(false);
                                            }}
                                            className="cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        >
                                            Não
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            title="Confirmar dose"
                                            aria-label="Confirmar dose"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsTaken();
                                                setShowConfirmation(false);
                                            }}
                                            className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? 'Processando...'
                                                : 'Confirmar'}
                                        </button>
                                        <button
                                            title="Cancelar confirmação"
                                            aria-label="Cancelar confirmação"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowConfirmation(false);
                                            }}
                                            className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="h-full flex items-start justify-between">
                    <div className="h-full flex flex-col justify-between">
                        {isMedicationFinished ? (
                            <div className="flex items-center mb-3">
                                <InfoIcon className="w-6 h-6 text-green-600 mr-2" />
                                <span className="text-gray-600">
                                    <strong>Status:</strong> Medicamento
                                    finalizado
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center mb-3">
                                {getDoseStatusIcon()}
                                <Pill className="w-4 h-4 text-gray-500 mr-2" />
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    {Formatters.formatName(medicationData.name)}
                                </h3>
                            </div>
                        )}

                        <div className="h-full space-y-2 ml-5">
                            {isMedicationFinished ? (
                                <div className="flex items-center text-sm">
                                    <Pill className="w-4 h-4 text-gray-500 mr-2" />
                                    <h3 className="text-gray-600">
                                        <strong>Nome:</strong>{' '}
                                        {Formatters.formatName(
                                            medicationData.name,
                                        )}
                                    </h3>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center text-sm">
                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                        <span className="text-gray-600">
                                            <strong>Próxima dose:</strong>{' '}
                                            {medicationData.hournextdose}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                        <span
                                            className={`text-sm font-medium ${getCountdownColor()}`}
                                        >
                                            <strong>Próxima dose em:</strong>{' '}
                                            {nextDoseCountdown}
                                        </span>
                                    </div>
                                </>
                            )}

                            <div className="flex items-center text-sm">
                                <Repeat className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">
                                    <strong>Intervalo:</strong> {interval}{' '}
                                    {label}
                                </span>
                            </div>

                            {medicationData.periodstart && (
                                <div className="flex items-center text-sm">
                                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-gray-600">
                                        <strong>Período:</strong>{' '}
                                        {Formatters.formatPeriod(
                                            medicationData.periodstart,
                                            medicationData.periodend,
                                        )}
                                    </span>
                                </div>
                            )}

                            {medicationData.pendingconfirmation &&
                                confirmationTimer &&
                                !isMedicationFinished && (
                                    <div className="flex items-center text-sm mt-2 bg-blue-50 p-2 rounded-lg">
                                        <Timer className="w-4 h-4 text-blue-600 mr-2" />
                                        <span className="text-blue-700 font-medium">
                                            <strong>Confirmar em:</strong>{' '}
                                            {confirmationTimer}
                                        </span>
                                        <button
                                            title="Cancelar confirmação de dose"
                                            aria-label="Cancelar confirmação de dose"
                                            type="button"
                                            onClick={handleCancelConfirmation}
                                            className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                        </div>

                        {isMedicationFinished ? (
                            <div className="mt-3 text-xs text-gray-400">
                                Clique para editar e para abrir o histórico de
                                doses
                            </div>
                        ) : (
                            <div className="mt-3 text-xs text-gray-400">
                                {medicationData.pendingconfirmation
                                    ? 'Clique para editar • Duplo clique para marcar como não tomado'
                                    : 'Clique para editar • Duplo clique para marcar como tomado'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <UpdateMedicationModal
                visible={isUpdateModalVisible}
                onClose={() => setIsUpdateModalVisible(false)}
                medicationData={medicationData}
                onMedicationUpdated={() => {
                    onUpdate?.();
                    setIsUpdateModalVisible(false);
                }}
            />
        </>
    );
}
