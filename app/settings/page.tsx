'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/lib/context';
import {
    Settings, Globe, Bell, Scale,
    User, ChevronRight, LogOut, Trash2, Download, Shield
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'hinglish', label: 'Hinglish', flag: '🇮🇳' },
];

export default function SettingsPage() {
    const { userData, updateUser, resetUser } = useUser();
    const { user, signOut } = useAuth();
    const router = useRouter();

    const currentLang = userData.language || 'en';
    const currentUnits = userData.units || 'metric';

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const handleExport = () => {
        if (!userData.completeReport) {
            alert('No health report available to export.');
            return;
        }
        const blob = new Blob([userData.completeReport], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ayurgenix-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all your health data? This cannot be undone.')) {
            resetUser();
            alert('Data cleared successfully.');
            router.push('/assess');
        }
    };

    return (
        <ProtectedRoute>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Settings</span>
                    </h1>
                </div>

                {/* Profile Card */}
                <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', fontWeight: 700, color: '#fff'
                    }}>
                        {(userData.name || user?.email || '?')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--color-text-primary)' }}>
                            {userData.name || 'User'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            {user?.email}
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/assess')}
                        style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'var(--color-text-primary)', fontSize: '12px' }}
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Preferences Section */}
                <section style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '12px', paddingLeft: '4px' }}>
                        PREFERENCES
                    </h3>
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>

                        {/* Language */}
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-primary)' }}>
                                <Globe size={18} />
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>Language</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {languages.map(lang => (
                                    <button key={lang.code}
                                        onClick={() => updateUser({ language: lang.code })}
                                        style={{
                                            padding: '6px 10px', borderRadius: '6px', fontSize: '12px',
                                            background: currentLang === lang.code ? 'var(--color-primary)' : 'transparent',
                                            color: currentLang === lang.code ? '#fff' : 'var(--color-text-secondary)',
                                            border: currentLang === lang.code ? 'none' : '1px solid var(--color-border)',
                                            cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center'
                                        }}
                                    >
                                        <span>{lang.flag}</span> {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Units */}
                        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-primary)' }}>
                                <Scale size={18} />
                                <span style={{ fontSize: '14px', fontWeight: 500 }}>Units</span>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', display: 'flex' }}>
                                {['metric', 'imperial'].map((unit) => (
                                    <button key={unit}
                                        onClick={() => updateUser({ units: unit as 'metric' | 'imperial' })}
                                        style={{
                                            padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                                            background: currentUnits === unit ? 'var(--color-surface-card)' : 'transparent',
                                            color: currentUnits === unit ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                                            border: 'none', cursor: 'pointer',
                                            boxShadow: currentUnits === unit ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                        }}
                                    >
                                        {unit === 'metric' ? 'Metric (kg/cm)' : 'Imperial (lb/ft)'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '12px', paddingLeft: '4px' }}>
                        NOTIFICATIONS
                    </h3>
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {[
                            { key: 'dailyTips', label: 'Daily Ayurvedic Tips' },
                            { key: 'medicationReminders', label: 'Medication Reminders' },
                            { key: 'waterReminders', label: 'Hydration Reminders' },
                        ].map((item, i) => (
                            <div key={item.key} style={{
                                padding: '16px 20px',
                                borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                    {item.label}
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                                    <input type="checkbox"
                                        checked={userData.notifications?.[item.key as keyof typeof userData.notifications] ?? true}
                                        onChange={(e) => updateUser({
                                            notifications: { ...userData.notifications, [item.key]: e.target.checked }
                                        })}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                        backgroundColor: userData.notifications?.[item.key as keyof typeof userData.notifications] ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                        borderRadius: '20px', transition: '0.4s'
                                    }}>
                                        <span style={{
                                            position: 'absolute', content: '""', height: '16px', width: '16px',
                                            left: userData.notifications?.[item.key as keyof typeof userData.notifications] ? '22px' : '2px',
                                            bottom: '2px', backgroundColor: '#fff', borderRadius: '50%', transition: '0.4s'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Account & Data Section */}
                <section style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '12px', paddingLeft: '4px' }}>
                        ACCOUNT & DATA
                    </h3>
                    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <button onClick={handleExport}
                            style={{
                                width: '100%', padding: '16px 20px', border: 'none', background: 'transparent',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                color: 'var(--color-text-primary)', fontSize: '14px', fontWeight: 500,
                                cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--color-border)'
                            }}
                        >
                            <Download size={18} color="var(--color-info)" />
                            Export Health Data
                        </button>
                        <button onClick={handleClearData}
                            style={{
                                width: '100%', padding: '16px 20px', border: 'none', background: 'transparent',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                color: 'var(--color-danger)', fontSize: '14px', fontWeight: 500,
                                cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid var(--color-border)'
                            }}
                        >
                            <Trash2 size={18} />
                            Clear App Data
                        </button>
                        <button onClick={handleSignOut}
                            style={{
                                width: '100%', padding: '16px 20px', border: 'none', background: 'transparent',
                                display: 'flex', alignItems: 'center', gap: '12px',
                                color: 'var(--color-text-secondary)', fontSize: '14px', fontWeight: 500,
                                cursor: 'pointer', textAlign: 'left'
                            }}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </section>

                {/* Version Info */}
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    AyurGenix v1.0.0
                </div>

            </div>
        </ProtectedRoute>
    );
}
