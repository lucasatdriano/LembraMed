'use client';

import BottomNav from '@/components/layouts/BottomNav';
import Header from '@/components/layouts/Header';
import SidebarNav from '@/components/layouts/SidebarNav';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
    const { setSearchValue } = useSearch();

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <SidebarNav />

            <div className="flex-1 flex flex-col min-h-screen md:ml-64">
                <Header
                    placeholder="Buscar medicamentos..."
                    onSearch={handleSearchChange}
                />

                <main className="flex-1 p-4 pb-20 md:pb-4 md:p-6 overflow-auto">
                    {children}
                </main>

                <BottomNav />
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <SearchProvider>
            <DashboardLayoutContent>{children}</DashboardLayoutContent>
        </SearchProvider>
    );
}
