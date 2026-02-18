'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/lib/context';
import Link from 'next/link';
import { FlaskConical, ArrowRight, AlertTriangle } from 'lucide-react';

export default function HerbsPage() {
    const { userData } = useUser();
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const herbs = report?.herb_recommendations as { name: string; benefit: string; dosage: string; when_to_take?: string; precaution?: string }[];

    if (!herbs) {
        return (
            <ProtectedRoute>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <FlaskConical size={48} color="#00e676" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', marginBottom: '12px' }}>
                        <span className="gradient-text">Herbal Recommendations</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Complete your assessment for personalized herb prescriptions.</p>
                    <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none' }}>Take Assessment <ArrowRight size={14} /></Link>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, #00e676, #00c853)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(0, 230, 118, 0.3)',
                    }}><FlaskConical size={28} color="#fff" /></div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Your Herbal Recommendations</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Personalized herbs based on your constitution & symptoms</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {herbs.map((herb, i) => (
                        <div key={i} className="glass-card" style={{ padding: '24px' }}>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', marginBottom: '10px', color: '#00e676' }}>
                                🌿 {herb.name}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#a5d6a7', lineHeight: 1.6, marginBottom: '12px' }}>{herb.benefit}</p>
                            <div style={{
                                padding: '8px 12px', borderRadius: '8px', background: 'rgba(0,230,118,0.06)',
                                fontSize: '13px', color: '#a5d6a7', marginBottom: '8px',
                            }}>
                                <strong style={{ color: '#00e676' }}>Dosage:</strong> {herb.dosage}
                            </div>
                            {herb.when_to_take && (
                                <div style={{ fontSize: '12px', color: '#66bb6a', marginBottom: '8px' }}>
                                    ⏰ {herb.when_to_take}
                                </div>
                            )}
                            {herb.precaution && (
                                <div style={{ display: 'flex', gap: '6px', fontSize: '12px', color: '#ffab00', alignItems: 'flex-start' }}>
                                    <AlertTriangle size={12} style={{ marginTop: '2px', flexShrink: 0 }} /> {herb.precaution}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '24px', padding: '14px', borderRadius: '10px',
                    background: 'rgba(255,171,0,0.06)', border: '1px solid rgba(255,171,0,0.12)',
                    fontSize: '12px', color: '#ffab00', textAlign: 'center',
                }}>
                    ⚠️ Always consult a qualified Ayurvedic practitioner before starting any herbal regimen.
                </div>
            </div>
        </ProtectedRoute>
    );
}
