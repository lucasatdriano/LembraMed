import React from 'react';

interface CustomButtonProps {
    title: string;
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    className?: string;
}

export default function CustomButton({
    title,
    text,
    onClick,
    disabled = false,
    type = 'button',
    loading = false,
    className = '',
}: CustomButtonProps) {
    return (
        <button
            title={title}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                bg-primary text-foreground py-2.5 px-5 rounded-xl 
                font-medium text-base cursor-pointer shadow-md hover:shadow-lg
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200
                ${
                    disabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:opacity-90 active:scale-95'
                }
                ${className}
            `}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Carregando...</span>
                </div>
            ) : (
                text
            )}
        </button>
    );
}
