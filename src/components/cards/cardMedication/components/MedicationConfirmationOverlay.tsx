import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface MedicationConfirmationOverlayProps {
    visible: boolean;
    pendingConfirmation: boolean;
    isLoading: boolean;
    isMedicationFinished: boolean;
    onConfirm: () => void;
    onMarkAsNotTaken: (e: React.MouseEvent) => void;
    onClose: () => void;
}

export default function MedicationConfirmationOverlay({
    visible,
    pendingConfirmation,
    isLoading,
    isMedicationFinished,
    onConfirm,
    onMarkAsNotTaken,
    onClose,
}: MedicationConfirmationOverlayProps) {
    if (!visible || isMedicationFinished) return null;

    return (
        <div className="absolute inset-0 bg-yellow-100 bg-opacity-90 rounded-lg flex flex-col items-center justify-center z-10 p-4">
            <div className="text-center">
                <AlertCircle className="w-10 h-10 text-yellow-600 mx-auto mb-2" />

                <h3 className="font-semibold text-yellow-800 mb-2">
                    {pendingConfirmation ? 'Cancelar dose?' : 'Confirmar ação'}
                </h3>

                <p className="text-sm text-yellow-700 mb-4">
                    {pendingConfirmation
                        ? 'Deseja marcar como NÃO TOMADO?'
                        : 'Deseja marcar como TOMADO?'}
                </p>

                <div className="flex gap-3 justify-center">
                    {pendingConfirmation ? (
                        <>
                            <button
                                type="button"
                                title="Cancelar dose"
                                aria-label="Cancelar dose"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsNotTaken(e);
                                }}
                                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Sim, não tomei
                            </button>

                            <button
                                type="button"
                                title="Fechar"
                                aria-label="Fechar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                Não
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                title="Confirmar dose"
                                aria-label="Confirmar dose"
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onConfirm();
                                    onClose();
                                }}
                                className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                            >
                                {isLoading ? 'Processando...' : 'Confirmar'}
                            </button>

                            <button
                                type="button"
                                title="Cancelar"
                                aria-label="Cancelar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
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
    );
}
