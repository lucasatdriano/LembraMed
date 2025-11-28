'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check, XCircle, Calendar, Filter, Pill } from 'lucide-react';
import { parseCookies } from 'nookies';
import medicationService from '@/services/domains/medicationService';
import Formatters from '@/utils/formatters';
import { Medication } from '@/interfaces/medication';
import Pagination from '@/components/layouts/Pagination';
import { MedicationHistory } from '@/interfaces/medicationHistory';

interface MedicationHistoryModalProps {
    visible: boolean;
    onClose: () => void;
    medicationData: Medication;
}

export default function MedicationHistoryModal({
    visible,
    onClose,
    medicationData,
}: MedicationHistoryModalProps) {
    const [history, setHistory] = useState<MedicationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        hasNext: false,
        hasPrev: false,
    });

    const cookies = parseCookies();
    const userId = cookies.userId;

    const fetchMedicationHistory = async (filters: any = {}) => {
        if (!userId || !medicationData) return;

        setLoading(true);
        try {
            const response = await medicationService.getMedicationHistory(
                userId,
                medicationData.id,
                {
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    page: filters.page || pagination.currentPage,
                    limit: 20,
                    ...filters,
                },
            );

            setHistory(response.history);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilterChange = (filter: string) => {
        setDateFilter(filter);

        const now = new Date();
        let startDate: string | undefined;

        switch (filter) {
            case 'today':
                startDate = now.toISOString().split('T')[0];
                break;
            case 'week':
                const weekAgo = new Date(
                    now.getTime() - 7 * 24 * 60 * 60 * 1000,
                );
                startDate = weekAgo.toISOString().split('T')[0];
                break;
            case 'month':
                const monthAgo = new Date(
                    now.getTime() - 30 * 24 * 60 * 60 * 1000,
                );
                startDate = monthAgo.toISOString().split('T')[0];
                break;
            default:
                startDate = undefined;
        }

        fetchMedicationHistory({ startDate, page: 1 });
    };

    const handleStatusFilterChange = (filter: string) => {
        setStatusFilter(filter);
        fetchMedicationHistory({
            status: filter !== 'all' ? filter : undefined,
            page: 1,
        });
    };

    const handlePageChange = (page: number) => {
        fetchMedicationHistory({ page });
    };

    useEffect(() => {
        if (visible && medicationData) {
            fetchMedicationHistory({ page: 1 });
        }
    }, [visible, medicationData]);

    const getStatusIcon = (taken: boolean) => {
        return taken ? (
            <Check className="w-5 h-5 text-green-600" />
        ) : (
            <XCircle className="w-5 h-5 text-red-600" />
        );
    };

    const getStatusText = (taken: boolean) => {
        return taken ? 'Tomado' : 'Não tomado';
    };

    const getStatusColor = (taken: boolean) => {
        return taken
            ? 'text-green-800 bg-green-100 border-green-200'
            : 'text-red-800 bg-red-100 border-red-200';
    };

    const handleClose = () => {
        setDateFilter('all');
        setStatusFilter('all');
        setPagination({
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            hasNext: false,
            hasPrev: false,
        });
        onClose();
    };

    const takenCount = history.filter((h) => h.taken).length;
    const missedCount = history.filter((h) => !h.taken).length;
    const adherenceRate =
        history.length > 0
            ? Math.round((takenCount / history.length) * 100)
            : 0;

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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <div>
                                        <Dialog.Title className="text-xl font-bold text-gray-900">
                                            Histórico do Medicamento
                                        </Dialog.Title>
                                        <p className="text-gray-600 mt-1">
                                            {Formatters.formatName(
                                                medicationData.name,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 border-b border-gray-200">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {pagination.totalRecords}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Total de registros
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-green-600">
                                                {takenCount}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Doses tomadas
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-red-600">
                                                {missedCount}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Doses não tomadas
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {adherenceRate}%
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                Taxa de adesão
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                Período
                                            </label>
                                            <select
                                                value={dateFilter}
                                                onChange={(e) =>
                                                    handleDateFilterChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">
                                                    Todo o período
                                                </option>
                                                <option value="today">
                                                    Hoje
                                                </option>
                                                <option value="week">
                                                    Última semana
                                                </option>
                                                <option value="month">
                                                    Último mês
                                                </option>
                                            </select>
                                        </div>

                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Filter className="w-4 h-4 inline mr-2" />
                                                Status
                                            </label>
                                            <select
                                                value={statusFilter}
                                                onChange={(e) =>
                                                    handleStatusFilterChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="all">
                                                    Todos os status
                                                </option>
                                                <option value="taken">
                                                    Apenas tomados
                                                </option>
                                                <option value="missed">
                                                    Apenas não tomados
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 max-h-96 overflow-y-auto">
                                    {loading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                        </div>
                                    ) : history.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500">
                                                Nenhum registro encontrado para
                                                os filtros selecionados.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {history.map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        {getStatusIcon(
                                                            record.taken,
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {Formatters.formatDateTime(
                                                                    new Date(
                                                                        record.takendate,
                                                                    ),
                                                                )}
                                                            </p>
                                                            <p
                                                                className={`text-sm px-2 py-1 rounded-full border ${getStatusColor(
                                                                    record.taken,
                                                                )}`}
                                                            >
                                                                {getStatusText(
                                                                    record.taken,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-right text-sm text-gray-500">
                                                        <p>Registrado em</p>
                                                        <p>
                                                            {Formatters.formatDate(
                                                                new Date(
                                                                    record.createdat,
                                                                ),
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t border-gray-200 bg-gray-50">
                                    {pagination.totalPages > 1 && (
                                        <div className="mb-4">
                                            <Pagination
                                                currentPage={
                                                    pagination.currentPage
                                                }
                                                totalPages={
                                                    pagination.totalPages
                                                }
                                                totalRecords={
                                                    pagination.totalRecords
                                                }
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center text-sm text-gray-600">
                                        <span>
                                            Mostrando {history.length} de
                                            {pagination.totalRecords} registros
                                        </span>
                                        <button
                                            title="Fechar histórico de medicação"
                                            aria-label="Fechar histórico de medicação"
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 bg-blue-200 hover:bg-blue-300 rounded-md transition-colors"
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
