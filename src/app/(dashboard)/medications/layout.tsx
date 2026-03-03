'use client';

import { useSearch } from '@/contexts/SearchContext';
import { useEffect } from 'react';

export default function MedicationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setPlaceholder } = useSearch();

    useEffect(() => {
        setPlaceholder('Buscar medicamentos...');

        return () => setPlaceholder('Buscar...');
    }, [setPlaceholder]);

    return <>{children}</>;
}
