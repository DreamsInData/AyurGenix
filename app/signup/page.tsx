'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
    const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            router.replace('/dashboard');
        }
    }, [authLoading, user, router]);

    if (!authLoading && user) return null;

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!firstName.trim() || !lastName.trim()) { setError('Please enter your first and last name.'); return; }
        if (!email.trim()) { setError('Please enter your email.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirmPass) { setError('Passwords do not match.'); return; }

        setLoading(true);
        const fullName = `${firstName.trim()} ${lastName.trim()}`;
        const { error: err } = await signUp(email, password, fullName);
        if (err) { setLoading(false); setError(err); return; }

        // Update profile with name
        const { data: { user: u } } = await supabase.auth.getUser();
        if (u) {
            await supabase.from('profiles').upsert({
                id: u.id,
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                name: fullName,
                email,
            }, { onConflict: 'id' });
        }

        setLoading(false);

        // If user is immediately authenticated (email confirmation disabled),
        // redirect directly. Otherwise Supabase will confirm via onAuthStateChange.
        if (u) {
            router.push('/assess');
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}>
            <div className="glass-card animate-fade-in-up" style={{ maxWidth: '440px', width: '100%', padding: 'clamp(24px, 5vw, 40px)' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', boxShadow: '0 12px 40px rgba(46, 204, 113, 0.25)',
                    }}>
                        <UserPlus size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', marginBottom: '6px' }}>
                        <span className="gradient-text">Create Account</span>
                    </h1>
                    <p style={{ color: '#66bb6a', fontSize: '14px' }}>Start your Ayurvedic health journey</p>
                </div>

                {/* Google */}
                <button onClick={signInWithGoogle} style={{
                    width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', color: '#e8f5e9', fontSize: '14px', fontWeight: 500,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 0.2s', fontFamily: 'Inter, sans-serif', marginBottom: '20px',
                }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign up with Google
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                    <span style={{ color: '#66bb6a', fontSize: '12px' }}>or sign up with email</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                </div>

                <form onSubmit={handleSignUp}>
                    {/* Name Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#66bb6a', marginBottom: '6px', fontWeight: 500 }}>First Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} color="#66bb6a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                                    placeholder="First name" className="input" style={{ width: '100%', paddingLeft: '40px' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#66bb6a', marginBottom: '6px', fontWeight: 500 }}>Last Name</label>
                            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                                placeholder="Last name" className="input" style={{ width: '100%' }} />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#66bb6a', marginBottom: '6px', fontWeight: 500 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} color="#66bb6a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com" className="input" style={{ width: '100%', paddingLeft: '40px' }} />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#66bb6a', marginBottom: '6px', fontWeight: 500 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#66bb6a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type={showPass ? 'text' : 'password'} value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Min 6 characters" className="input"
                                style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px' }} />
                            <button type="button" onClick={() => setShowPass(!showPass)} style={{
                                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: '#66bb6a',
                            }}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: '#66bb6a', marginBottom: '6px', fontWeight: 500 }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="#66bb6a" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                                placeholder="Re-enter password" className="input" style={{ width: '100%', paddingLeft: '40px' }} />
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            padding: '10px 14px', borderRadius: '10px', marginBottom: '16px',
                            background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.15)',
                            fontSize: '13px', color: '#ff5252',
                        }}>{error}</div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}
                        style={{ width: '100%', padding: '14px', fontSize: '15px', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#a5d6a7' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: '#2ecc71', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
