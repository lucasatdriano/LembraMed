'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    totalRecords,
    onPageChange,
    className = '',
}: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const getVisiblePages = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2),
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;
    const showingStart = (currentPage - 1) * 50 + 1;
    const showingEnd = Math.min(currentPage * 50, totalRecords);

    return (
        <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
        >
            <div className="text-sm text-gray-600">
                Mostrando {showingStart}-{showingEnd} de
                {totalRecords.toLocaleString()} registros
            </div>

            <div className="flex items-center space-x-1">
                <button
                    title="Página anterior"
                    aria-label="Página anterior"
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevious}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                        hasPrevious
                            ? 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                            : 'text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {!visiblePages.includes(1) && (
                    <>
                        <button
                            title="Primeira página"
                            aria-label="Primeira página"
                            type="button"
                            onClick={() => onPageChange(1)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            1
                        </button>
                        {!visiblePages.includes(2) && (
                            <span className="px-2 text-gray-400">
                                <MoreHorizontal className="w-4 h-4" />
                            </span>
                        )}
                    </>
                )}

                {visiblePages.map((page) => (
                    <button
                        title={`Página ${page}`}
                        aria-label={`Página ${page}`}
                        type="button"
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                            page === currentPage
                                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}

                {!visiblePages.includes(totalPages) && (
                    <>
                        {!visiblePages.includes(totalPages - 1) && (
                            <span className="px-2 text-gray-400">
                                <MoreHorizontal className="w-4 h-4" />
                            </span>
                        )}
                        <button
                            title={`Última página`}
                            aria-label={`Última página`}
                            type="button"
                            onClick={() => onPageChange(totalPages)}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    title="Próxima página"
                    aria-label="Próxima página"
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className={`p-2 rounded-lg border transition-all duration-200 ${
                        hasNext
                            ? 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                            : 'text-gray-400 border-gray-200 cursor-not-allowed'
                    }`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-600">Ir para:</span>
                <select
                    value={currentPage}
                    onChange={(e) => onPageChange(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <option key={page} value={page}>
                                Página {page}
                            </option>
                        ),
                    )}
                </select>
            </div>
        </div>
    );
}
