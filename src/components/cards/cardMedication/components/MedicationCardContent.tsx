import React from 'react';
import { Medication } from '@/interfaces/medication';
import Formatters from '@/utils/formatters';
import {
    Calendar,
    CheckCircle,
    Clock,
    ClockIcon,
    Edit,
    History,
    InfoIcon,
    Pill,
    Repeat,
    Timer,
    XCircle,
} from 'lucide-react';
import { canTakeMedication } from '@/utils/helpers/medication.helper';

interface MedicationCardContentProps {
    medication: Medication;
    isMedicationFinished: boolean;
    nextDoseCountdown: string;
    countdownColor: string;
    confirmationTimer: string | null;
    intervalHours: number;
    doseStatusIcon: React.ReactNode;
    onCancelConfirmation: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MedicationCardContent({
    confirmationTimer,
    countdownColor,
    doseStatusIcon,
    intervalHours,
    isMedicationFinished,
    medication,
    nextDoseCountdown,
    onCancelConfirmation,
}: MedicationCardContentProps) {
    const getHelpMessage = () => {
        if (isMedicationFinished) {
            return (
                <div className="flex  items-center gap-1">
                    <History className="w-3 h-3 shrink-0" />
                    Clique para editar e para abrir o histórico de doses
                </div>
            );
        }

        if (medication.pendingconfirmation) {
            return (
                <div className="flex flex-wrap items-center gap-1">
                    <Edit className="w-3 h-3 shrink-0" />
                    <span>Clique para editar</span>
                    <span className="hidden sm:inline mx-1">•</span>
                    <div className="flex items-center gap-1">
                        <XCircle className="w-3 h-3 shrink-0" />
                        <span>Duplo clique para cancelar</span>
                    </div>
                </div>
            );
        }

        if (canTakeMedication(medication)) {
            return (
                <div className="flex flex-wrap items-center gap-1">
                    <Edit className="w-3 h-3 shrink-0" />
                    <span>Clique para editar</span>
                    <span className="hidden sm:inline mx-1">•</span>
                    <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 shrink-0" />
                        <span>Duplo clique para marcar como tomado</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-wrap items-center gap-1">
                <Edit className="w-3 h-3 shrink-0" />
                <span>Clique para editar</span>
                <span className="hidden sm:inline mx-1">•</span>
                <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3 shrink-0" />
                    <span>
                        Duplo clique para marcar (aguarde o horário da dose)
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex items-start justify-between">
            <div className="h-full flex flex-col justify-between w-full">
                {isMedicationFinished ? (
                    <div className="flex items-center mb-3">
                        <InfoIcon className="w-6 h-6 text-green-600 mr-2 shrink-0" />
                        <span className="text-gray-600">
                            <strong>Status:</strong> Medicamento finalizado
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center mb-3">
                        {doseStatusIcon}
                        <Pill className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                            {Formatters.formatName(medication.name)}
                        </h3>
                    </div>
                )}

                <div className="space-y-2 ml-5">
                    {isMedicationFinished ? (
                        <div className="flex items-center text-sm">
                            <Pill className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                            <h3 className="text-gray-600 truncate">
                                <strong>Nome:</strong>{' '}
                                {Formatters.formatName(medication.name)}
                            </h3>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                                <span className="text-gray-600">
                                    <strong>Próxima dose:</strong>{' '}
                                    {Formatters.extractTime(
                                        medication.hournextdose,
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                                <span
                                    className={`text-sm font-medium ${countdownColor}`}
                                >
                                    <strong>Próxima dose em:</strong>{' '}
                                    {nextDoseCountdown}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="flex items-center text-sm">
                        <Repeat className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                        <span className="text-gray-600">
                            <strong>Intervalo:</strong> {intervalHours}{' '}
                            {intervalHours === 1 ? 'hora' : 'horas'}
                        </span>
                    </div>
                    {medication.periodstart && (
                        <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                            <span className="text-gray-600">
                                <strong>Período:</strong>{' '}
                                {Formatters.formatPeriod(
                                    medication.periodstart,
                                    medication.periodend,
                                )}
                            </span>
                        </div>
                    )}

                    {medication.pendingconfirmation &&
                        confirmationTimer &&
                        !isMedicationFinished && (
                            <div className="flex flex-wrap items-center text-sm mt-2 bg-blue-50 p-2 rounded-lg">
                                <Timer className="w-4 h-4 text-blue-600 mr-2 shrink-0" />
                                <span className="text-blue-700 font-medium">
                                    <strong>Confirmar em:</strong>{' '}
                                    {confirmationTimer}
                                </span>
                                <button
                                    type="button"
                                    onClick={onCancelConfirmation}
                                    className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors shrink-0"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                </div>

                <div className="mt-3 text-xs text-gray-400">
                    {getHelpMessage()}
                </div>
            </div>
        </div>
    );
}
