'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/lib/context';
import Link from 'next/link';
import { BarChart3, ArrowRight, TrendingUp, Target, Droplets, Brain } from 'lucide-react';

export default function AnalyticsPage() {
    const { userData } = useUser();
    const prakriti = userData.prakritiResult ? JSON.parse(userData.prakritiResult) : null;
    const report = userData.healthReport ? JSON.parse(userData.healthReport) : null;

    const hasData = prakriti || report;

    if (!hasData) {
        return (
            <ProtectedRoute>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <BarChart3 size={48} color="#00e676" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', marginBottom: '12px' }}>
                        <span className="gradient-text">Health Analytics</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Complete your Prakriti quiz and health report to see analytics.</p>
                    <Link href="/prakriti" className="btn-primary" style={{ textDecoration: 'none' }}>Start Prakriti Quiz <ArrowRight size={14} /></Link>
                </div>
            </ProtectedRoute>
        );
    }

    const vata = prakriti?.prakriti?.vata_percentage || 33;
    const pitta = prakriti?.prakriti?.pitta_percentage || 33;
    const kapha = prakriti?.prakriti?.kapha_percentage || 34;
    const confidence = prakriti?.prakriti?.confidence_score || 75;
    const goals = (report?.weekly_goals as Record<string, string>[]) || [];
    const riskLevel = (report?.risk_assessment as Record<string, string>)?.level || 'Not assessed';

    return (
        <ProtectedRoute>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, #00e676, #00c853)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(0, 230, 118, 0.3)',
                    }}>
                        <BarChart3 size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Health Analytics</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Your Ayurvedic health data at a glance</p>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {[
                        { label: 'Confidence', value: `${confidence}%`, icon: Brain, color: '#9b59b6' },
                        { label: 'Risk Level', value: riskLevel, icon: Target, color: riskLevel === 'High' ? '#ff5252' : riskLevel === 'Medium' ? '#ffab00' : '#00e676' },
                        { label: 'Symptoms', value: `${userData.symptoms.length}`, icon: TrendingUp, color: '#e74c3c' },
                        { label: 'Goals Set', value: `${goals.length}`, icon: Target, color: '#3498db' },
                    ].map((m, i) => (
                        <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                            <m.icon size={20} color={m.color} style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: m.color, fontFamily: 'Outfit, sans-serif' }}>
                                {m.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#66bb6a', marginTop: '4px' }}>{m.label}</div>
                        </div>
                    ))}
                </div>

                {/* Dosha Distribution Chart */}
                <div className="glass-card" style={{ padding: '28px', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Brain size={18} color="#9b59b6" /> Dosha Distribution
                    </h3>

                    {/* Visual bar chart */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '200px', marginBottom: '16px', justifyContent: 'center' }}>
                        {[
                            { name: 'Vata', value: vata, color: '#9b59b6' },
                            { name: 'Pitta', value: pitta, color: '#e74c3c' },
                            { name: 'Kapha', value: kapha, color: '#3498db' },
                        ].map((d) => (
                            <div key={d.name} style={{ textAlign: 'center', width: '80px' }}>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: d.color, marginBottom: '6px' }}>{d.value}%</div>
                                <div style={{
                                    width: '60px', margin: '0 auto', borderRadius: '8px 8px 4px 4px',
                                    background: `linear-gradient(to top, ${d.color}, ${d.color}80)`,
                                    height: `${Math.max(20, d.value * 1.8)}px`,
                                    transition: 'height 1s ease',
                                    boxShadow: `0 0 16px ${d.color}30`,
                                }} />
                                <div style={{ fontSize: '12px', color: '#a5d6a7', marginTop: '8px' }}>{d.name}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '14px', color: '#a5d6a7' }}>
                        Constitution: <strong style={{ color: '#2ecc71' }}>{prakriti?.prakriti?.constitution_type || 'Unknown'}</strong>
                    </div>
                </div>

                {/* Symptom List */}
                {userData.symptoms.length > 0 && (
                    <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '14px' }}>🩺 Reported Symptoms</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {userData.symptoms.map((s, i) => (
                                <span key={i} style={{
                                    padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
                                    background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.12)', color: '#f1948a',
                                }}>{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Weekly Goals */}
                {goals.length > 0 && (
                    <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={16} color="#3498db" /> Your Weekly Goals
                        </h3>
                        {goals.map((g, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: '12px', padding: '10px 0',
                                borderBottom: i < goals.length - 1 ? '1px solid rgba(46,204,113,0.06)' : 'none',
                                alignItems: 'center',
                            }}>
                                <input type="checkbox" style={{
                                    width: '18px', height: '18px', accentColor: '#2ecc71',
                                    cursor: 'pointer', flexShrink: 0,
                                }} />
                                <span style={{ fontSize: '14px', color: '#a5d6a7', flex: 1 }}>{g.goal}</span>
                                <span style={{
                                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px',
                                    background: 'rgba(46,204,113,0.08)', color: '#66bb6a',
                                }}>{g.frequency}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Hydration */}
                {report?.hydration && (
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Droplets size={16} color="#3498db" /> Hydration Target
                        </h3>
                        <div style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: '#3498db', fontFamily: 'Outfit, sans-serif' }}>
                            {(report.hydration as Record<string, unknown>).daily_target_ml as number}ml
                        </div>
                        <div style={{ fontSize: '12px', color: '#66bb6a' }}>per day</div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
