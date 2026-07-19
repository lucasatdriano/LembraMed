'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Check, AlertCircle, CheckCircle2, InfoIcon } from 'lucide-react';
import { Medication } from '@/interfaces/medication';
import medicationService from '@/services/domains/medicationService';
import Formatters from '@/utils/formatters';
import { formatSecondsToTime } from '@/utils/helpers/timestamp.helper';
import {
    canTakeMedication,
    getCountdownColor,
    hasPendingConfirmation,
    isMedicationFinished,
} from '@/utils/helpers/medication.helper';
import MedicationConfirmationOverlay from './components/MedicationConfirmationOverlay';
import MedicationCardContent from './components/MedicationCardContent';
import UpdateMedicationModal from '@/components/modals/medication/UpdateMedicationModal';

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

    const intervalHours = medicationData.doseinterval?.intervalinhours ?? 0;

    const isMedicationFinishedFlag = isMedicationFinished(medicationData);

    useEffect(() => {
        setMedicationData(initialMedicationData);
    }, [initialMedicationData]);

    useEffect(() => {
        const hournextdose = medicationData?.hournextdose;

        if (!hournextdose) return;

        const updateCountdown = () => {
            let nextDose = Formatters.parseTimestamp(hournextdose);
            if (!nextDose) return;

            const now = new Date();

            if (nextDose < now) {
                const intervalHours =
                    medicationData?.doseinterval?.intervalinhours || 0;

                if (intervalHours > 0) {
                    let diffMs = now.getTime() - nextDose.getTime();
                    const intervalMs = intervalHours * 60 * 60 * 1000;
                    const cyclesToAdd = Math.ceil(diffMs / intervalMs);
                    nextDose = new Date(
                        nextDose.getTime() + cyclesToAdd * intervalMs,
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

            setNextDoseCountdown(formatSecondsToTime(diffInSeconds));
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
            const pendingDate =
                typeof medicationData.pendinguntil === 'string'
                    ? new Date(medicationData.pendinguntil)
                    : medicationData.pendinguntil;

            if (!pendingDate || isNaN(pendingDate.getTime())) {
                setConfirmationTimer(null);
                return;
            }

            const diffInSeconds = Math.floor(
                (pendingDate.getTime() - Date.now()) / 1000,
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

    const cancelPendingDose = async () => {
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
        await cancelPendingDose();
    };

    const handleCancelConfirmation = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await cancelPendingDose();
    };

    const handlePress = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;

        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            timeoutRef.current && clearTimeout(timeoutRef.current);

            if (medicationData.pendingconfirmation) {
                setShowConfirmation(true);
            } else if (!isMedicationFinishedFlag && canTakeMedicationFlag) {
                setShowConfirmation(true);
            } else {
                setIsUpdateModalVisible(true);
            }
        } else {
            lastTap.current = now;
            timeoutRef.current = setTimeout(() => {
                setIsUpdateModalVisible(true);
            }, DOUBLE_PRESS_DELAY);
        }
    };

    const canTakeMedicationFlag = canTakeMedication(medicationData);

    const getCardStyles = () => {
        const baseStyles =
            'bg-white rounded-lg shadow-md p-4 border-2 hover:shadow-lg transition-all cursor-pointer relative';

        if (isMedicationFinishedFlag) {
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

    const doseStatusIcon = isMedicationFinishedFlag ? (
        <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
    ) : medicationData.pendingconfirmation ? (
        <Check className="w-5 h-5 text-green-600 mr-2" />
    ) : !canTakeMedicationFlag ? (
        <InfoIcon className="w-5 h-5 text-blue-500 mr-2" />
    ) : (
        <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
    );

    const countdownColor = getCountdownColor(nextDoseCountdown);

    return (
        <>
            <div className={getCardStyles()} onClick={handlePress}>
                <MedicationConfirmationOverlay
                    visible={showConfirmation}
                    pendingConfirmation={hasPendingConfirmation(medicationData)}
                    isLoading={isLoading}
                    isMedicationFinished={isMedicationFinishedFlag}
                    onConfirm={handleMarkAsTaken}
                    onMarkAsNotTaken={handleMarkAsNotTaken}
                    onClose={() => setShowConfirmation(false)}
                />

                <MedicationCardContent
                    medication={medicationData}
                    isMedicationFinished={isMedicationFinishedFlag}
                    nextDoseCountdown={nextDoseCountdown}
                    countdownColor={countdownColor}
                    confirmationTimer={confirmationTimer}
                    intervalHours={intervalHours}
                    doseStatusIcon={doseStatusIcon}
                    onCancelConfirmation={handleCancelConfirmation}
                />
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
