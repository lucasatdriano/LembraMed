import { Medication } from '@/interfaces/medication';
import Formatters from '@/utils/formatters';
import { Calendar, Clock, InfoIcon, Pill, Repeat, Timer } from 'lucide-react';
import React from 'react';

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
    return (
        <div className="h-full flex items-start justify-between">
            <div className="h-full flex flex-col justify-between">
                {isMedicationFinished ? (
                    <div className="flex items-center mb-3">
                        <InfoIcon className="w-6 h-6 text-green-600 mr-2" />
                        <span className="text-gray-600">
                            <strong>Status:</strong> Medicamento finalizado
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center mb-3">
                        {doseStatusIcon}
                        <Pill className="w-4 h-4 text-gray-500 mr-2" />
                        <h3 className="font-semibold text-gray-900 text-lg">
                            {Formatters.formatName(medication.name)}
                        </h3>
                    </div>
                )}

                <div className="h-full space-y-2 ml-5">
                    {isMedicationFinished ? (
                        <div className="flex items-center text-sm">
                            <Pill className="w-4 h-4 text-gray-500 mr-2" />
                            <h3 className="text-gray-600">
                                <strong>Nome:</strong>{' '}
                                {Formatters.formatName(medication.name)}
                            </h3>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="text-gray-600">
                                    <strong>Próxima dose:</strong>{' '}
                                    {Formatters.extractTime(
                                        medication.hournextdose,
                                    )}
                                </span>
                            </div>

                            <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 text-gray-500 mr-2" />
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
                        <Repeat className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-600">
                            <strong>Intervalo:</strong> {intervalHours}{' '}
                            {intervalHours === 1 ? 'hora' : 'horas'}
                        </span>
                    </div>
                    {medication.periodstart && (
                        <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
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
                            <div className="flex items-center text-sm mt-2 bg-blue-50 p-2 rounded-lg">
                                <Timer className="w-4 h-4 text-blue-600 mr-2" />

                                <span className="text-blue-700 font-medium">
                                    <strong>Confirmar em:</strong>{' '}
                                    {confirmationTimer}
                                </span>

                                <button
                                    type="button"
                                    onClick={onCancelConfirmation}
                                    className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                </div>

                <div className="mt-3 text-xs text-gray-400">
                    {isMedicationFinished
                        ? 'Clique para editar e para abrir o histórico de doses'
                        : medication.pendingconfirmation
                          ? 'Clique para editar • Duplo clique para marcar como não tomado'
                          : 'Clique para editar • Duplo clique para marcar como tomado'}
                </div>
            </div>
        </div>
    );
}
