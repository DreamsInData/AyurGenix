'use client';

import { useUser } from '@/lib/context';
import Link from 'next/link';
import { Sun, ArrowRight } from 'lucide-react';

export default function SeasonalPage() {
    const { userData } = useUser();
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const seasonal = report?.seasonal_advice;

    if (!seasonal) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                <Sun size={48} color="#ff9800" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', marginBottom: '12px' }}>
                    <span className="gradient-text">Seasonal Guide (Ritucharya)</span>
                </h1>
                <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Get season-specific Ayurvedic guidance.</p>
                <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none' }}>Take Assessment <ArrowRight size={14} /></Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(255, 152, 0, 0.3)',
                }}><Sun size={28} color="#fff" /></div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '8px' }}>
                    <span className="gradient-text">Seasonal Guide (Ritucharya)</span>
                </h1>
                <div style={{
                    display: 'inline-block', padding: '6px 18px', borderRadius: '20px',
                    background: 'rgba(255,152,0,0.1)', color: '#ff9800', fontSize: '14px', fontWeight: 600,
                }}>🌤️ Current: {seasonal.current_season}</div>
            </div>

            {seasonal.season_effect_on_dosha && (
                <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '8px' }}>🔬 Season & Your Dosha</h3>
                    <p style={{ fontSize: '14px', color: '#a5d6a7', lineHeight: 1.6 }}>{seasonal.season_effect_on_dosha}</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: '#f39c12', marginBottom: '10px' }}>🍽️ Diet Tips</h3>
                    {(seasonal.diet_tips as string[])?.map((t: string, i: number) => (
                        <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '4px 0' }}>• {t}</div>
                    ))}
                </div>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: '#3498db', marginBottom: '10px' }}>🏡 Lifestyle Tips</h3>
                    {(seasonal.lifestyle_tips as string[])?.map((t: string, i: number) => (
                        <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '4px 0' }}>• {t}</div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="glass-card" style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: '#00e676', marginBottom: '10px' }}>🌿 Herbs for Season</h3>
                    {(seasonal.herbs_for_season as string[])?.map((h: string, i: number) => (
                        <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '4px 0' }}>• {h}</div>
                    ))}
                </div>
                {seasonal.things_to_avoid && (seasonal.things_to_avoid as string[]).length > 0 && (
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: '#ff5252', marginBottom: '10px' }}>🚫 Avoid This Season</h3>
                        {(seasonal.things_to_avoid as string[]).map((t: string, i: number) => (
                            <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '4px 0' }}>• {t}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
