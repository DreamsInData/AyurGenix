'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrakritiRedirect() {
    const router = useRouter();
    useEffect(() => { router.replace('/assess'); }, [router]);
    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
            <p style={{ color: '#a5d6a7' }}>Redirecting to Health Assessment...</p>
        </div>
    );
}
