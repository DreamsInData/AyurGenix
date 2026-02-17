'use client';

import { useUser } from '@/lib/context';
import Link from 'next/link';
import { Dumbbell, ArrowRight } from 'lucide-react';

export default function YogaPage() {
    const { userData } = useUser();
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const yoga = report?.yoga_plan;

    if (!yoga) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                <Dumbbell size={48} color="#3498db" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', marginBottom: '12px' }}>
                    <span className="gradient-text">Yoga & Pranayama</span>
                </h1>
                <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Complete your health assessment to get a personalized yoga plan.</p>
                <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none' }}>Take Assessment <ArrowRight size={14} /></Link>
            </div>
        );
    }

    const difficultyColor = (d: string) => {
        if (d === 'Advanced') return '#e74c3c';
        if (d === 'Intermediate') return '#f39c12';
        return '#2ecc71';
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(52, 152, 219, 0.3)',
                }}>
                    <Dumbbell size={28} color="#fff" />
                </div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '8px' }}>
                    <span className="gradient-text">Your Yoga Prescription</span>
                </h1>
                <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Asanas, pranayama & meditation tailored to your dosha</p>
            </div>

            {/* Asanas */}
            {yoga.asanas && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', marginBottom: '14px' }}>🧘 Asanas</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                        {(yoga.asanas as { name: string; duration: string; frequency: string; benefit: string; difficulty?: string }[])
                            .map((a: { name: string; duration: string; frequency: string; benefit: string; difficulty?: string }, i: number) => (
                                <div key={i} className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{
                                        position: 'absolute', top: '0', right: '0',
                                        padding: '4px 14px', borderRadius: '0 0 0 12px', fontSize: '10px', fontWeight: 600,
                                        background: `${difficultyColor(a.difficulty || 'Beginner')}18`,
                                        color: difficultyColor(a.difficulty || 'Beginner'),
                                        textTransform: 'uppercase', letterSpacing: '0.5px',
                                    }}>{a.difficulty || 'Beginner'}</div>
                                    <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '8px', color: '#3498db' }}>
                                        {a.name}
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#a5d6a7', lineHeight: 1.5, marginBottom: '8px' }}>{a.benefit}</p>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#66bb6a' }}>
                                        <span>⏱️ {a.duration}</span>
                                        <span>🔄 {a.frequency}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Pranayama */}
            {yoga.pranayama && (
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', marginBottom: '14px' }}>🌬️ Pranayama</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                        {(yoga.pranayama as { name: string; duration: string; frequency: string; benefit?: string }[])
                            .map((p: { name: string; duration: string; frequency: string; benefit?: string }, i: number) => (
                                <div key={i} className="glass-card" style={{
                                    padding: '20px', borderLeft: '3px solid #9b59b6',
                                }}>
                                    <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '6px', color: '#9b59b6' }}>
                                        {p.name}
                                    </h4>
                                    {p.benefit && <p style={{ fontSize: '13px', color: '#a5d6a7', marginBottom: '6px' }}>{p.benefit}</p>}
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#66bb6a' }}>
                                        <span>⏱️ {p.duration}</span>
                                        <span>🔄 {p.frequency}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Meditation */}
            {yoga.meditation && (
                <div className="glass-card" style={{
                    padding: '24px', marginBottom: '24px', borderLeft: '3px solid #f39c12',
                }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '8px' }}>🧠 Meditation</h3>
                    <p style={{ fontSize: '14px', color: '#a5d6a7', lineHeight: 1.6 }}>
                        {typeof yoga.meditation === 'string' ? yoga.meditation : (
                            <>
                                <strong>{(yoga.meditation as { type: string; duration: string; benefit: string }).type}</strong> — {(yoga.meditation as { type: string; duration: string; benefit: string }).duration}<br />
                                {(yoga.meditation as { type: string; duration: string; benefit: string }).benefit}
                            </>
                        )}
                    </p>
                </div>
            )}

            {/* Precautions */}
            {yoga.precautions && (yoga.precautions as string[]).length > 0 && (
                <div style={{
                    padding: '14px 20px', borderRadius: '10px',
                    background: 'rgba(255,171,0,0.06)', border: '1px solid rgba(255,171,0,0.12)',
                    fontSize: '13px', color: '#ffab00',
                }}>
                    <strong>⚠️ Precautions:</strong>
                    {(yoga.precautions as string[]).map((p: string, i: number) => (
                        <div key={i} style={{ padding: '3px 0' }}>• {p}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
