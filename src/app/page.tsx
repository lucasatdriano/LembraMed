'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { Loader2 } from 'lucide-react';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const cookies = parseCookies();
        const accessToken = cookies.accessToken;

        if (accessToken) {
            router.push('/contacts');
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-center">
                <Loader2 className="animate-spin w-12 h-12 text-primary-button mx-auto mb-4" />
                <p className="text-gray-600">Redirecionando...</p>
            </div>
        </div>
    );
}
