'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// No longer needed — we use OTP, not passwords.
// Redirect to login page.
export default function ForgotPasswordPage() {
    const router = useRouter();
    useEffect(() => { router.replace('/login'); }, [router]);
    return null;
}
