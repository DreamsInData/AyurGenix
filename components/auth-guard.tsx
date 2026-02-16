'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '60vh', flexDirection: 'column', gap: '16px',
            }}>
                <Loader2 size={32} color="#2ecc71" className="animate-spin" />
                <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}
