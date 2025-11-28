'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Pill,
    Clock,
    Calendar,
    Check,
    AlertCircle,
    Repeat,
    X,
} from 'lucide-react';
import { parseCookies } from 'nookies';
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
    const [medicationData, setMedicationData] = useState<Medication>(
        initialMedicationData,
    );
    const [nextDoseCountdown, setNextDoseCountdown] = useState<string>('');
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationCountdown, setConfirmationCountdown] = useState(10);

    const lastTap = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const confirmationRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const cookies = parseCookies();
    const userId = cookies.userId;

    const interval = medicationData?.doseinterval?.intervalinhours || 0;
    const label = interval === 1 ? 'hora' : 'horas';

    useEffect(() => {
        setMedicationData(initialMedicationData);
    }, [initialMedicationData]);

    useEffect(() => {
        if (!medicationData?.hournextdose) return;

        const interval = setInterval(() => {
            const [hours, minutes] = medicationData.hournextdose
                .split(':')
                .map(Number);
            const nextDose = new Date();
            nextDose.setHours(hours, minutes, 0, 0);

            let diffInSeconds = Math.floor(
                (nextDose.getTime() - Date.now()) / 1000,
            );

            if (diffInSeconds < 0) {
                diffInSeconds = 0;
            }

            const hoursLeft = Math.floor(diffInSeconds / 3600);
            const minutesLeft = Math.floor((diffInSeconds % 3600) / 60);
            const secondsLeft = diffInSeconds % 60;

            setNextDoseCountdown(
                `${String(hoursLeft).padStart(2, '0')}:${String(
                    minutesLeft,
                ).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`,
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [medicationData?.hournextdose]);

    useEffect(() => {
        if (!medicationData?.status) return;

        syncIntervalRef.current = setInterval(() => {
            onUpdate?.();
        }, 2 * 60 * 1000);

        return () => {
            if (syncIntervalRef.current) {
                clearInterval(syncIntervalRef.current);
            }
        };
    }, [medicationData?.status, onUpdate]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
            if (confirmationRef.current) clearTimeout(confirmationRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    const startConfirmationCountdown = () => {
        setShowConfirmation(true);
        setConfirmationCountdown(10);

        countdownRef.current = setInterval(() => {
            setConfirmationCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownRef.current!);
                    confirmMedicationTaken();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        confirmationRef.current = setTimeout(() => {
            setShowConfirmation(false);
            if (countdownRef.current) {
                clearInterval(countdownRef.current);
            }
        }, 10000);
    };

    const confirmMedicationTaken = async () => {
        try {
            if (!userId || !medicationData) return;

            await medicationService.updateMedication(
                userId,
                medicationData.id,
                {
                    status: !medicationData.status,
                },
            );

            setMedicationData((prev) => ({
                ...prev,
                status: !prev.status,
            }));

            setShowConfirmation(false);
            clearTimeout(confirmationRef.current!);
            clearInterval(countdownRef.current!);

            onUpdate?.();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Falha ao atualizar status do medicamento.');
        }
    };

    const cancelConfirmation = () => {
        setShowConfirmation(false);
        if (confirmationRef.current) {
            clearTimeout(confirmationRef.current);
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
        }
    };

    const handleUpdateStatus = () => {
        startConfirmationCountdown();
    };

    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            handleUpdateStatus();
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                setIsUpdateModalVisible(true);
            }, DOUBLE_PRESS_DELAY);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este medicamento?')) {
            return;
        }

        setIsActionLoading(true);
        try {
            await medicationService.deleteMedication(userId, medicationData.id);
            onUpdate?.();
        } catch (error) {
            console.error('Erro ao excluir medicamento:', error);
            alert('Erro ao excluir medicamento.');
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleMedicationUpdated = () => {
        onUpdate?.();
    };

    const formatPeriod = () => {
        if (!medicationData?.periodstart && !medicationData?.periodend) {
            return 'Período indefinido';
        }
        return `${Formatters.formatDate(
            new Date(medicationData.periodstart!),
        )} - ${Formatters.formatDate(new Date(medicationData.periodend!))}`;
    };

    return (
        <>
            <div
                className={`bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-all cursor-pointer relative ${
                    medicationData.status
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300'
                } ${showConfirmation ? 'ring-2 ring-yellow-400' : ''}`}
                onClick={handlePress}
            >
                {showConfirmation && (
                    <div className="absolute inset-0 bg-yellow-100 bg-opacity-90 rounded-lg flex flex-col items-center justify-center z-10 p-4">
                        <div className="text-center">
                            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                                Confirmar ação
                            </h3>
                            <p className="text-yellow-700 mb-4">
                                {medicationData.status
                                    ? 'Deseja marcar como NÃO TOMADO?'
                                    : 'Deseja marcar como TOMADO?'}
                            </p>
                            <div className="text-2xl font-bold text-yellow-600 mb-4">
                                {confirmationCountdown}s
                            </div>
                            <div className="flex gap-3 justify-center">
                                <button
                                    title="Confirmar"
                                    aria-label="Confirmar"
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        confirmMedicationTaken();
                                    }}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Confirmar
                                </button>
                                <button
                                    title="Cancelar"
                                    aria-label="Cancelar"
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        cancelConfirmation();
                                    }}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-3">
                            {medicationData.status ? (
                                <Check className="w-5 h-5 text-green-600 mr-2" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                            )}
                            <Pill className="w-4 h-4 text-gray-500 mr-2" />
                            <h3 className="font-semibold text-gray-900 text-lg">
                                {Formatters.formatName(medicationData.name)}
                            </h3>
                        </div>

                        <div className="space-y-2 ml-7">
                            <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">
                                    <strong>Horário da próxima dose:</strong>{' '}
                                    {medicationData.hournextdose}
                                </span>
                            </div>
                            <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                <span
                                    className={`text-sm font-medium ${
                                        nextDoseCountdown === '00:00:00'
                                            ? 'text-red-600'
                                            : 'text-blue-600'
                                    }`}
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
                                    <strong>Período:</strong> {formatPeriod()}
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-400">
                            Clique para editar • Clique duas vezes para{' '}
                            {medicationData.status
                                ? 'desmarcar'
                                : 'marcar como tomado'}
                        </div>
                    </div>
                </div>
            </div>

            <UpdateMedicationModal
                visible={isUpdateModalVisible}
                onClose={() => setIsUpdateModalVisible(false)}
                userId={userId}
                medicationData={medicationData}
                onMedicationUpdated={handleMedicationUpdated}
            />
        </>
    );
}
