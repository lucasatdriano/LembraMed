import type { Metadata } from 'next';
import { Roboto, Space_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
});

const spaceMono = Space_Mono({
    variable: '--font-space-mono',
    subsets: ['latin'],
    weight: '400',
});

export const metadata: Metadata = {
    title: 'LembraMed',
    description:
        'Aplicativo para controle de medicamentos com lembretes inteligentes. Gerencie horários de remédios, receba notificações e mantenha contatos de emergência sempre à mão. Nunca mais esqueça de tomar seus medicamentos na hora certa!',
    manifest: '/manifest.json',
    icons: {
        icon: '/icons/icon.svg',

        apple: '/icons/icon-192x192.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br" suppressHydrationWarning={true}>
            <body
                className={`${roboto.variable} ${spaceMono.variable} antialiased`}
            >
                {children}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
