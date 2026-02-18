'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/lib/context';
import { calculateHydration } from '@/lib/ayurveda-data';
import Link from 'next/link';
import { Droplets, ArrowRight } from 'lucide-react';

export default function HydrationPage() {
    const { userData } = useUser();
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const hydration = report?.hydration;

    const [weight, setWeight] = useState(userData.weight || 65);
    const [season, setSeason] = useState('summer');
    const [activity, setActivity] = useState('moderate');

    const calc = calculateHydration(weight, season, activity);
    const progress = Math.min((calc.totalMl / (hydration?.daily_target_ml || calc.totalMl)) * 100, 100);

    if (!report) {
        return (
            <ProtectedRoute>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <Droplets size={48} color="#00bcd4" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', marginBottom: '12px' }}>
                        <span className="gradient-text">Hydration Plan</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Complete your assessment for AI-powered hydration tips.</p>
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
                        background: 'linear-gradient(135deg, #00bcd4, #0097a7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(0, 188, 212, 0.3)',
                    }}>
                        <Droplets size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Hydration Plan</span>
                    </h1>
                </div>

                {/* Progress Ring */}
                <div className="glass-card" style={{ padding: '32px', marginBottom: '20px', textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 20px' }}>
                        <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(0,188,212,0.1)" strokeWidth="10" />
                            <circle cx="80" cy="80" r="70" fill="none" stroke="#00bcd4" strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 70}`}
                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#00bcd4' }}>
                                {calc.liters}L
                            </div>
                            <div style={{ fontSize: '12px', color: '#66bb6a' }}>{calc.glasses} glasses</div>
                        </div>
                    </div>

                    {/* Quick calculator */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#66bb6a', marginBottom: '4px' }}>Weight (kg)</label>
                            <input type="number" value={weight} onChange={e => setWeight(Number(e.target.value))}
                                className="input" style={{ width: '80px', textAlign: 'center' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#66bb6a', marginBottom: '4px' }}>Season</label>
                            <select value={season} onChange={e => setSeason(e.target.value)} className="input" style={{ width: '110px' }}>
                                <option value="summer">Summer</option><option value="winter">Winter</option>
                                <option value="monsoon">Monsoon</option><option value="spring">Spring</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', color: '#66bb6a', marginBottom: '4px' }}>Activity</label>
                            <select value={activity} onChange={e => setActivity(e.target.value)} className="input" style={{ width: '110px' }}>
                                <option value="sedentary">Sedentary</option><option value="moderate">Moderate</option>
                                <option value="active">Active</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* AI Tips */}
                {hydration && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '10px', color: '#00bcd4' }}>
                                💧 AI Hydration Tips
                            </h3>
                            {(hydration.tips as string[])?.map((t: string, i: number) => (
                                <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '4px 0' }}>• {t}</div>
                            ))}
                        </div>
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '10px', color: '#2ecc71' }}>
                                🥤 Best Drinks
                            </h3>
                            {(hydration.best_drinks as string[])?.map((d: string, i: number) => (
                                <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '4px 0' }}>• {d}</div>
                            ))}
                            {hydration.drinks_to_avoid && (hydration.drinks_to_avoid as string[]).length > 0 && (
                                <>
                                    <h4 style={{ fontSize: '0.85rem', color: '#ff5252', marginTop: '12px', marginBottom: '6px' }}>🚫 Avoid</h4>
                                    {(hydration.drinks_to_avoid as string[]).map((d: string, i: number) => (
                                        <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '2px 0' }}>• {d}</div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {hydration?.daily_target_ml && (
                    <div style={{
                        padding: '14px', borderRadius: '10px', textAlign: 'center',
                        background: 'rgba(0,188,212,0.05)', border: '1px solid rgba(0,188,212,0.12)',
                        fontSize: '13px', color: '#00bcd4',
                    }}>
                        🎯 AI recommended daily target: <strong>{hydration.daily_target_ml}ml</strong> ({(hydration.daily_target_ml / 1000).toFixed(1)}L)
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
