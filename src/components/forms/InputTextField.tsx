'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputTextFieldProps {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    touched?: boolean;
    maxLength?: number;
    error?: string;
    icon?: LucideIcon;
    type?: HTMLInputElement['type'];
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
}

export default function InputTextField({
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    maxLength,
    touched,
    icon: IconComponent,
    type = 'text',
    disabled = false,
    required = false,
    autoComplete,
}: InputTextFieldProps) {
    return (
        <div className="w-full flex flex-col gap-1">
            <div className="relative">
                {IconComponent && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">
                        <IconComponent className="w-5 h-5" />
                    </div>
                )}

                <input
                    type={type}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    className={`
                        w-full bg-white text-gray-900 ${
                            IconComponent ? 'px-10' : 'px-3'
                        } py-2.5 text-base rounded-lg border 
                        focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-500
                        ${
                            touched && error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-blue-200'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                />
            </div>

            {touched && error && (
                <span className="text-red-600 text-sm pl-3">{error}</span>
            )}
        </div>
    );
}
