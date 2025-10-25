'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Calendar, Pill, Users } from 'lucide-react';

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

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bg-secondary fixed bottom-0 left-0 right-0 z-4 border-t border-gray-300 md:hidden">
            <div className="flex justify-around items-center h-16">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 p-2 transition-colors ${
                                isActive
                                    ? 'text-primary-button'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs mt-1 font-medium">
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
