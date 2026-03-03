'use client';

import { useSearch } from '@/contexts/SearchContext';
import { useEffect } from 'react';

export default function ContactsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setPlaceholder } = useSearch();

    useEffect(() => {
        setPlaceholder('Buscar contatos...');

        return () => setPlaceholder('Buscar...');
    }, [setPlaceholder]);

    return <>{children}</>;
}
