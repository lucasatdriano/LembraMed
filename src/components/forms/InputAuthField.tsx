'use client';

import React from 'react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

interface AuthFieldProps {
    type: 'username' | 'password' | 'confirmPassword';
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    touched?: boolean;
    error?: string;
    showPassword?: boolean;
    togglePasswordVisibility?: () => void;
}

export default function InputAuthField({
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    showPassword,
    togglePasswordVisibility,
}: AuthFieldProps) {
    const fieldConfig = {
        username: {
            icon: <User className="w-5 h-5" />,
            inputType: 'text',
            showToggle: false,
        },
        password: {
            icon: <Lock className="w-5 h-5" />,
            inputType: showPassword ? 'text' : 'password',
            showToggle: true,
        },
        confirmPassword: {
            icon: <Lock className="w-5 h-5" />,
            inputType: showPassword ? 'text' : 'password',
            showToggle: true,
        },
    };

    const config = fieldConfig[type];

    return (
        <div className="w-full flex flex-col gap-1">
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">
                    {config.icon}
                </div>

                <input
                    type={config.inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
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
                />

                {config.showToggle && togglePasswordVisibility && (
                    <button
                        title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        aria-label={
                            showPassword ? 'Ocultar senha' : 'Mostrar senha'
                        }
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {touched && error && (
                <span className="text-red-600 text-sm pl-3">{error}</span>
            )}
        </div>
    );
}
