'use client';

import Formatters from '@/utils/formatters';
import React from 'react';

interface InputHourFieldProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    touched?: boolean;
    error?: string;
    icon?: React.ReactNode;
}

export default function InputHourField({
    placeholder,
    value,
    onChange,
    onBlur,
    touched,
    error,
    icon,
}: InputHourFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = Formatters.formatHour(e.target.value);
        onChange(formattedValue);
    };

    return (
        <div className="w-full flex flex-col gap-1">
            <div className="relative flex items-center">
                {icon && <div className="absolute left-3 z-10">{icon}</div>}
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    maxLength={5}
                    className={`
                        w-full bg-white text-gray-900 ${
                            icon ? 'px-10' : 'px-3'
                        } py-2.5 text-base rounded-lg border 
                        focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-500
                        ${
                            touched && error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-200'
                        }
                    `}
                />
            </div>
            {touched && error && (
                <span className="text-red-600 text-sm pl-3">{error}</span>
            )}
        </div>
    );
}
