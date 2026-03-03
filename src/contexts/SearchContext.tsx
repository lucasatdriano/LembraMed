'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
    searchValue: string;
    setSearchValue: (value: string) => void;
    placeholder: string;
    setPlaceholder: (placeholder: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const [searchValue, setSearchValue] = useState('');
    const [placeholder, setPlaceholder] = useState('Buscar...');

    return (
        <SearchContext.Provider
            value={{
                searchValue,
                setSearchValue,
                placeholder,
                setPlaceholder,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}
