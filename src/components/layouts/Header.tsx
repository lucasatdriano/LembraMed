'use client';

import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import InputSearchField from '../forms/InputSearchField';
import UserSwitcherModal from '../modals/user/SwitchAccountModal';
import { useSearch } from '@/contexts/SearchContext';

interface HeaderProps {
    onSearch?: (search: string) => void;
    hasSidebar?: boolean;
    showMenu?: boolean;
}

export default function Header({
    onSearch,
    hasSidebar = false,
    showMenu = true,
}: HeaderProps) {
    const [mounted, setMounted] = useState(false);
    const [switchAccountModalVisible, setSwitchAccountModalVisible] =
        useState(false);

    const { placeholder, setSearchValue } = useSearch();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAccountSwitched = () => {
        setSwitchAccountModalVisible(false);
        window.location.reload();
    };

    const handleSearch = (value: string) => {
        setSearchValue(value);
        onSearch?.(value);
    };

    return (
        <header className={'bg-secondary border-b border-gray-200 shadow-sm'}>
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                <div
                    className={`${
                        mounted && showMenu ? 'opacity-0' : 'hidden'
                    }`}
                ></div>

                <div className="flex-1 max-w-7xl">
                    <InputSearchField
                        placeholder={placeholder}
                        onSearch={handleSearch}
                        delay={400}
                    />
                </div>

                {mounted && showMenu && (
                    <div className="ml-4">
                        <button
                            title="Trocar de conta"
                            aria-label="Trocar de conta"
                            type="button"
                            onClick={() => setSwitchAccountModalVisible(true)}
                            className="flex items-center justify-center p-2 hover:bg-black/15 rounded-full transition-colors cursor-pointer"
                        >
                            <MoreVertical className="w-6 h-6 text-gray-700" />
                        </button>
                    </div>
                )}

                <UserSwitcherModal
                    isOpen={switchAccountModalVisible}
                    onClose={() => setSwitchAccountModalVisible(false)}
                    onAccountSwitch={handleAccountSwitched}
                />
            </div>
        </header>
    );
}
