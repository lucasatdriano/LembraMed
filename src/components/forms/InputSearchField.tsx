'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface InputSearchFieldProps {
    placeholder: string;
    onSearch: (search: string) => void;
    delay?: number;
    className?: string;
}

export default function InputSearchField({
    placeholder,
    onSearch,
    delay = 300,
    className = '',
}: InputSearchFieldProps) {
    const [text, setText] = useState('');
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleSearch = (searchText: string) => {
        setText(searchText);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        const newTimeoutId = setTimeout(() => {
            onSearch(searchText);
        }, delay);

        setTimeoutId(newTimeoutId);
    };

    const clearSearch = () => {
        setText('');
        onSearch('');
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };

    return (
        <div className={`relative w-full ${className}`}>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-500">
                <Search className="w-5 h-5" />
            </div>

            <input
                type="text"
                placeholder={placeholder}
                value={text}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white text-gray-900 px-10 py-2.5 text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-500"
            />

            {text && (
                <button
                    title="Limpar busca"
                    aria-label="Limpar busca"
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
