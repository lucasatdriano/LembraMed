'use client';

import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    label: string;
    value: string | number;
}

interface InputDropdownFieldProps {
    placeholder: string;
    value: string | number;
    onChange: (value: string | number) => void;
    onBlur: () => void;
    touched?: boolean;
    error?: string;
    icon?: React.ReactNode;
    options: Option[];
}

export default function InputDropdownField({
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    icon,
    options,
}: InputDropdownFieldProps) {
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="w-full">
            <Listbox
                value={value}
                onChange={(newValue) => {
                    onChange(newValue);
                    onBlur();
                }}
            >
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-2.5 z-10 text-gray-500">
                            {icon}
                        </div>
                    )}

                    <Listbox.Button className="w-full h-11 flex items-center justify-between pl-10 pr-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-gray-50 transition-colors">
                        <span
                            className={`block truncate ${
                                value ? 'text-gray-900' : 'text-gray-500'
                            }`}
                        >
                            {selectedOption?.label || placeholder}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </Listbox.Button>

                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Listbox.Options className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.value}
                                    value={option.value}
                                    className={({ active, selected }) =>
                                        `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                            active
                                                ? 'bg-blue-50 text-blue-900'
                                                : 'text-gray-900'
                                        } ${selected ? 'bg-blue-100' : ''}`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? 'font-medium'
                                                        : 'font-normal'
                                                }`}
                                            >
                                                {option.label}
                                            </span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                    <Check className="w-5 h-5" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>

            {touched && error && (
                <span className="text-red-600 text-sm mt-1 pl-3 block">
                    {error}
                </span>
            )}
        </div>
    );
}
