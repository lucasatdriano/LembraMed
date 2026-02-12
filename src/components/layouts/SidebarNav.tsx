'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Phone,
    Calendar,
    Pill,
    Users,
    Menu,
    X,
    Settings,
    LogOut,
} from 'lucide-react';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';

const navigation = [
    {
        name: 'Contatos',
        href: '/contacts',
        icon: Phone,
    },
    {
        name: 'Medicamentos',
        href: '/medications',
        icon: Pill,
    },
    {
        name: 'Cronograma',
        href: '/schedule',
        icon: Calendar,
    },
];

export default function SidebarNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        destroyCookie(null, 'accessToken');
        destroyCookie(null, 'refreshToken');
        router.push('/login');
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside
                className={`
                fixed top-0 left-0 z-40 h-screen bg-secondary border-r border-gray-300
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
                w-64
                `}
            >
                <div className="p-6 border-b border-gray-300">
                    <h1 className="text-xl font-bold text-primary-text">
                        LembraMed
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Controle seus medicamentos
                    </p>
                </div>

                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-primary-button text-primary-text font-medium'
                                        : 'text-gray-700 hover:bg-primary/30'
                                }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300">
                    <button
                        title="Deslogar"
                        aria-label="Deslogar"
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
