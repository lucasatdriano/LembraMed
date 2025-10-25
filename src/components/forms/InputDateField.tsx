'use client';

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import Formatters from '@/utils/formatters';

import { registerLocale } from 'react-datepicker';
registerLocale('pt-BR', ptBR);

interface InputDateFieldProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    touched?: boolean;
    error?: string;
}

export default function InputDateField({
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
}: InputDateFieldProps) {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

        const formattedValue = Formatters.formatPeriod(
            start ? Formatters.formatDate(start) : null,
            end ? Formatters.formatDate(end) : null,
        );
        onChange(formattedValue);
    };

    return (
        <div className="w-full flex flex-col gap-1">
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">
                    <Calendar className="w-5 h-5" />
                </div>

                <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    placeholderText={placeholder}
                    onBlur={onBlur}
                    className={`
                        w-full bg-white text-gray-900 px-10 py-2.5 text-base rounded-lg border 
                        focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-500
                        ${
                            touched && error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-200'
                        }
                    `}
                    withPortal
                    popperPlacement="bottom-start"
                    locale="pt-BR"
                    dateFormat="dd/MM/yyyy"
                    shouldCloseOnSelect={false}
                />
            </div>

            {touched && error && (
                <span className="text-red-600 text-sm pl-3">{error}</span>
            )}
        </div>
    );
}
