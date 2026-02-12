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
    useEffect(() => {
        if (!medicationData.status || !medicationData.pendingUntil) {
            return;
        }

        const pollInterval = setInterval(async () => {
            try {
                const freshData = await medicationService.getMedication(
                    medicationData.id,
                );
                setMedicationData(freshData);
            } catch (error) {
                console.error('Erro ao buscar dados atualizados:', error);
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [medicationData.id, medicationData.status, medicationData.pendingUntil]);

    useEffect(() => {
        setMedicationData(initialMedicationData);
    }, [initialMedicationData]);

    // ✅ APENAS COUNTDOWN VISUAL - SEM LÓGICA DE NEGÓCIO
    useEffect(() => {
        if (!medicationData?.hournextdose) return;

        const updateCountdown = () => {
            const [hours, minutes] = medicationData.hournextdose
                .split(':')
                .map(Number);
            let nextDose = new Date();
            nextDose.setHours(hours, minutes, 0, 0);

            if (nextDose < new Date()) {
                const intervalHours =
                    medicationData?.doseinterval?.intervalinhours || 0;
                nextDose.setHours(nextDose.getHours() + intervalHours);
            }

            const diffInSeconds = Math.floor(
                (nextDose.getTime() - Date.now()) / 1000,
            );

            if (diffInSeconds < 0) {
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

    // ✅ TIMER DOS 3 MINUTOS (APENAS VISUAL)
    useEffect(() => {
        if (!medicationData.status || !medicationData.pendingUntil) {
            setConfirmationTimer(null);
            return;
        }

        const updateConfirmationTimer = () => {
            const pendingUntil = new Date(medicationData.pendingUntil!);
            const diffInSeconds = Math.floor(
                (pendingUntil.getTime() - Date.now()) / 1000,
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
    }, [medicationData.status, medicationData.pendingUntil]);

    // ✅ ÚNICA AÇÃO: Marcar como tomado (inicia confirmação de 3 minutos)
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
                status: response.medication.status,
                pendingConfirmation: response.medication.pendingConfirmation,
                pendingUntil: response.medication.pendingUntil,
                hournextdose: response.medication.hournextdose,
            }));

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao marcar como tomado:', error);
            alert('Erro ao registrar dose. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ NOVO MÉTODO: Marcar como NÃO TOMADO (CANCELAR)
    const handleMarkAsNotTaken = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const response = await medicationService.cancelPendingDose(
                medicationData.id,
            );
            setMedicationData((prev) => ({
                ...prev,
                status: false,
                pendingConfirmation: false,
                pendingUntil: null,
                hournextdose: response.medication.hournextdose,
            }));
            setShowConfirmation(false);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao cancelar dose:', error);
            alert('Erro ao cancelar dose. Tente novamente.');
        }
    };

    // ✅ Cancelar confirmação
    // ✅ CORRIGIDO - não usar prev.pendingUntil
    const handleCancelConfirmation = async (e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const response = await medicationService.cancelPendingDose(
                medicationData.id,
            );
            setMedicationData((prev) => ({
                ...prev,
                status: response.medication.status,
                pendingConfirmation: false,
                pendingUntil: null, // ✅ SEMPRE null após cancelar!
                hournextdose: response.medication.hournextdose,
            }));
            setShowConfirmation(false);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao cancelar confirmação:', error);
        }
    };

    // ✅ Duplo clique = marcar como tomado
    // const handleDoubleClick = () => {
    //     handleMarkAsTaken();
    // };

    // ✅ Clique simples = editar
    const handleClick = () => {
        if (medicationData.pendingConfirmation) return; // Não abre edição se estiver em confirmação
        setIsUpdateModalVisible(true);
    };

    // ✅ Estado local para controle do modal de confirmação (só UI)
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handlePress = () => {
        // ✅ SEMPRE abre o modal no duplo clique
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            timeoutRef.current && clearTimeout(timeoutRef.current);
            setShowConfirmation(true); // ✅ SEMPRE abre o modal
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                if (!medicationData.status) {
                    // ✅ SÓ edita se NÃO estiver em confirmação
                    setIsUpdateModalVisible(true);
                }
            }, DOUBLE_PRESS_DELAY);
        }
    };
    const getCardStyles = () => {
        const baseStyles =
            'bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-all cursor-pointer relative';

        if (showConfirmation) {
            return `${baseStyles} ring-2 ring-yellow-400 border-yellow-300`;
        }

        if (medicationData.status) {
            return `${baseStyles} border-green-500 bg-green-50`;
        }

        if (nextDoseCountdown === '00:00:00') {
            return `${baseStyles} border-red-300 bg-red-50`;
        }

        return `${baseStyles} border-gray-200 hover:border-blue-300`;
    };

    const getStatusIcon = () => {
        if (medicationData.status) {
            return <Check className="w-5 h-5 text-green-600 mr-2" />;
        }

        if (nextDoseCountdown === '00:00:00') {
            return <AlertCircle className="w-5 h-5 text-red-500 mr-2" />;
        }

        return <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />;
    };

    const getCountdownColor = () => {
        if (nextDoseCountdown === '00:00:00') {
            return 'text-red-600 font-semibold';
        }

        const [hours] = nextDoseCountdown.split(':').map(Number);
        if (hours < 1) {
            return 'text-orange-600';
        }

        return 'text-blue-600';
    };

    return (
        <>
            <div
                className={getCardStyles()}
                onClick={handlePress}
                // onDoubleClick={handleDoubleClick}
            >
                {/* Feedback de sucesso */}
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

                {showConfirmation && (
                    <div className="absolute inset-0 bg-yellow-100 bg-opacity-90 rounded-lg flex flex-col items-center justify-center z-10 p-4">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                {medicationData.status // ✅ USA status, não pendingConfirmation!
                                    ? 'Cancelar dose?'
                                    : 'Confirmar ação'}
                            </h3>
                            <p className="text-yellow-700 mb-4">
                                {medicationData.status
                                    ? 'Deseja marcar como NÃO TOMADO?'
                                    : 'Deseja marcar como TOMADO?'}
                            </p>
                            <div className="flex gap-3 justify-center">
                                {medicationData.status ? (
                                    // ✅ MODO CANCELAR (status true)
                                    <>
                                        <button
                                            title="Cancelar dose"
                                            aria-label="Cancelar dose"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsNotTaken(e);
                                            }}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                        >
                                            Não
                                        </button>
                                    </>
                                ) : (
                                    // ✅ MODO CONFIRMAR (status false)
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
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
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
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-3">
                            {getStatusIcon()}
                            <Pill className="w-4 h-4 text-gray-500 mr-2" />
                            <h3 className="font-semibold text-gray-900 text-lg">
                                {Formatters.formatName(medicationData.name)}
                            </h3>
                        </div>
                        <div className="space-y-2 ml-7">
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

                            <div className="flex items-center text-sm">
                                <Repeat className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">
                                    <strong>Intervalo:</strong> {interval}{' '}
                                    {label}
                                </span>
                            </div>

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

                            {/* ✅ AVISO DOS 3 MINUTOS - ADICIONADO AQUI! */}
                            {medicationData.status && confirmationTimer && (
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

                        <div className="mt-3 text-xs text-gray-400">
                            {medicationData.status // ✅ USA status, não pendingConfirmation!
                                ? 'Clique para editar • Duplo clique para marcar como não tomado'
                                : 'Clique para editar • Duplo clique para marcar como tomado'}
                        </div>
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
