'use client';

import { useUser } from '@/lib/context';
import Link from 'next/link';
import { Calendar, ArrowRight, Sunrise, Sun, Sunset, Moon } from 'lucide-react';

export default function RoutinePage() {
    const { userData } = useUser();
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const routine = report?.daily_routine as { time: string; activity: string; description: string; period?: string }[];

    if (!routine) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                <Calendar size={48} color="#9b59b6" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', marginBottom: '12px' }}>
                    <span className="gradient-text">Daily Routine (Dinacharya)</span>
                </h1>
                <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Get a personalized daily schedule.</p>
                <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none' }}>Take Assessment <ArrowRight size={14} /></Link>
            </div>
        );
    }

    const periodCfg: Record<string, { color: string; icon: typeof Sunrise; bg: string }> = {
        morning: { color: '#f39c12', icon: Sunrise, bg: 'rgba(243,156,18,0.08)' },
        afternoon: { color: '#e67e22', icon: Sun, bg: 'rgba(230,126,34,0.08)' },
        evening: { color: '#9b59b6', icon: Sunset, bg: 'rgba(155,89,182,0.08)' },
        night: { color: '#3498db', icon: Moon, bg: 'rgba(52,152,219,0.08)' },
    };

    const guessPeriod = (time: string): string => {
        const h = parseInt(time);
        if (isNaN(h)) return 'morning';
        if (h < 12) return 'morning';
        if (h < 16) return 'afternoon';
        if (h < 20) return 'evening';
        return 'night';
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(155, 89, 182, 0.3)',
                }}><Calendar size={28} color="#fff" /></div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '8px' }}>
                    <span className="gradient-text">Your Daily Routine</span>
                </h1>
                <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Personalized Dinacharya</p>
            </div>

            <div style={{ position: 'relative', paddingLeft: '32px' }}>
                <div style={{
                    position: 'absolute', left: '15px', top: '8px', bottom: '8px',
                    width: '2px', background: 'linear-gradient(to bottom, #f39c12, #9b59b6, #3498db)',
                }} />
                {routine.map((item, i) => {
                    const p = item.period || guessPeriod(item.time);
                    const c = periodCfg[p] || periodCfg.morning;
                    const Icon = c.icon;
                    return (
                        <div key={i} style={{ position: 'relative', marginBottom: '16px' }}>
                            <div style={{
                                position: 'absolute', left: '-24px', top: '16px',
                                width: '12px', height: '12px', borderRadius: '50%',
                                background: c.color, border: '2px solid rgba(15,26,18,0.9)',
                            }} />
                            <div className="glass-card" style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                    <div style={{
                                        padding: '4px 10px', borderRadius: '8px',
                                        background: c.bg, color: c.color,
                                        fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px',
                                    }}><Icon size={12} /> {item.time}</div>
                                    <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem' }}>{item.activity}</h4>
                                </div>
                                <p style={{ fontSize: '13px', color: '#a5d6a7', lineHeight: 1.5 }}>{item.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
