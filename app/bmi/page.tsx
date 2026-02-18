'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/lib/context';
import { calculateBMI } from '@/lib/ayurveda-data';
import Link from 'next/link';
import { Scale, ArrowRight, Leaf, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const categories = [
    { label: 'Underweight', range: '< 18.5', color: '#40c4ff', bgColor: 'rgba(64, 196, 255, 0.08)', borderColor: 'rgba(64, 196, 255, 0.15)', icon: AlertTriangle, tip: 'Focus on nutrient-dense foods and strength building.' },
    { label: 'Normal', range: '18.5 – 24.9', color: '#00e676', bgColor: 'rgba(0, 230, 118, 0.08)', borderColor: 'rgba(0, 230, 118, 0.15)', icon: CheckCircle2, tip: 'Great balance! Maintain with wholesome diet & activity.' },
    { label: 'Overweight', range: '25 – 29.9', color: '#ffab00', bgColor: 'rgba(255, 171, 0, 0.08)', borderColor: 'rgba(255, 171, 0, 0.15)', icon: TrendingUp, tip: 'Increase activity and reduce processed foods.' },
    { label: 'Obese', range: '≥ 30', color: '#ff5252', bgColor: 'rgba(255, 82, 82, 0.08)', borderColor: 'rgba(255, 82, 82, 0.15)', icon: AlertTriangle, tip: 'Consult a practitioner for personalized guidance.' },
];

function getCategoryIndex(bmi: number): number {
    if (bmi < 18.5) return 0;
    if (bmi < 25) return 1;
    if (bmi < 30) return 2;
    return 3;
}

export default function BMIPage() {
    const { userData } = useUser();

    const weight = Number(userData.weight);
    const height = Number(userData.height);
    const hasData = weight > 0 && height > 0;

    if (!hasData) {
        return (
            <ProtectedRoute>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                    <Scale size={48} color="#3498db" style={{ marginBottom: '20px' }} />
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', marginBottom: '12px' }}>
                        <span className="gradient-text">BMI Analysis</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', marginBottom: '28px', lineHeight: 1.7 }}>
                        Complete your health assessment with weight & height data to auto-calculate your BMI and see a detailed analysis.
                    </p>
                    <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Complete Assessment <ArrowRight size={14} />
                    </Link>
                </div>
            </ProtectedRoute>
        );
    }

    const result = calculateBMI(weight, height);
    const catIdx = getCategoryIndex(result.bmi);
    const activeCat = categories[catIdx];
    const gaugeAngle = Math.min(180, Math.max(0, (result.bmi / 40) * 180));

    return (
        <ProtectedRoute>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        background: 'linear-gradient(135deg, #3498db, #2980b9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(52, 152, 219, 0.3)',
                    }}>
                        <Scale size={28} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">BMI Analysis</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Auto-calculated from your health profile</p>
                </div>

                {/* Gauge Card */}
                <div className="glass-card animate-fade-in-up" style={{ padding: '32px', textAlign: 'center', marginBottom: '20px' }}>

                    {/* SVG Gauge */}
                    <div style={{ position: 'relative', width: '220px', height: '120px', margin: '0 auto 16px', overflow: 'hidden' }}>
                        <svg width="220" height="120" viewBox="0 0 220 120">
                            {/* Background arc */}
                            <path d="M 10 110 A 100 100 0 0 1 210 110" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" strokeLinecap="round" />
                            {/* Color sections */}
                            <path d="M 10 110 A 100 100 0 0 1 58 22" fill="none" stroke="#40c4ff" strokeWidth="14" strokeLinecap="round" opacity="0.25" />
                            <path d="M 58 22 A 100 100 0 0 1 162 22" fill="none" stroke="#00e676" strokeWidth="14" strokeLinecap="round" opacity="0.25" />
                            <path d="M 162 22 A 100 100 0 0 1 195 65" fill="none" stroke="#ffab00" strokeWidth="14" strokeLinecap="round" opacity="0.25" />
                            <path d="M 195 65 A 100 100 0 0 1 210 110" fill="none" stroke="#ff5252" strokeWidth="14" strokeLinecap="round" opacity="0.25" />
                            {/* Needle */}
                            <line
                                x1="110" y1="110"
                                x2={110 + 82 * Math.cos(Math.PI - (gaugeAngle / 180) * Math.PI)}
                                y2={110 - 82 * Math.sin(Math.PI - (gaugeAngle / 180) * Math.PI)}
                                stroke={activeCat.color} strokeWidth="3" strokeLinecap="round"
                                style={{ transition: 'all 1s ease' }}
                            />
                            <circle cx="110" cy="110" r="6" fill={activeCat.color} />
                        </svg>
                    </div>

                    {/* BMI Number */}
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: activeCat.color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                        {result.bmi}
                    </div>

                    {/* Category badge */}
                    <div style={{
                        display: 'inline-block', padding: '6px 20px', borderRadius: '20px', marginTop: '10px',
                        background: activeCat.bgColor, border: `1px solid ${activeCat.borderColor}`,
                        fontSize: '14px', fontWeight: 600, color: activeCat.color,
                    }}>
                        {result.category}
                    </div>

                    {/* Scale bar */}
                    <div style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#66bb6a', marginBottom: '6px' }}>
                            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ flex: 18.5, background: '#40c4ff' }} />
                                <div style={{ flex: 6.5, background: '#00e676' }} />
                                <div style={{ flex: 5, background: '#ffab00' }} />
                                <div style={{ flex: 10, background: '#ff5252' }} />
                            </div>
                            {/* Indicator marker */}
                            <div style={{
                                position: 'absolute', top: '-3px',
                                left: `${Math.min(97, Math.max(2, (result.bmi / 40) * 100))}%`,
                                width: '14px', height: '14px', borderRadius: '50%',
                                background: activeCat.color, border: '2px solid #0f1a12',
                                transform: 'translateX(-50%)',
                                transition: 'left 1s ease',
                                boxShadow: `0 0 8px ${activeCat.color}60`,
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#66bb6a', marginTop: '6px' }}>
                            <span>0</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                        </div>
                    </div>

                    {/* Formula */}
                    <div style={{
                        marginTop: '20px', padding: '10px 14px', borderRadius: '8px',
                        background: 'rgba(0,0,0,0.2)', fontSize: '12px', color: '#66bb6a',
                        fontFamily: 'monospace',
                    }}>
                        BMI = {weight}kg ÷ ({(height / 100).toFixed(2)}m)² = {result.bmi}
                    </div>
                </div>

                {/* Category Cards */}
                <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                    {categories.map((cat, i) => {
                        const isActive = i === catIdx;
                        const CatIcon = cat.icon;
                        return (
                            <div key={cat.label} className="glass-card" style={{
                                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px',
                                border: isActive ? `1.5px solid ${cat.borderColor}` : undefined,
                                background: isActive ? cat.bgColor : undefined,
                                opacity: isActive ? 1 : 0.5,
                                transition: 'all 0.3s',
                            }}>
                                <CatIcon size={20} color={cat.color} style={{ flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: isActive ? cat.color : '#a5d6a7' }}>
                                        {cat.label} <span style={{ fontWeight: 400, fontSize: '12px', color: '#66bb6a' }}>({cat.range})</span>
                                    </div>
                                    {isActive && (
                                        <div style={{ fontSize: '12px', color: '#a5d6a7', marginTop: '4px', lineHeight: 1.5 }}>{cat.tip}</div>
                                    )}
                                </div>
                                {isActive && (
                                    <div style={{
                                        padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 600,
                                        background: `${cat.color}20`, color: cat.color,
                                    }}>YOU</div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Profile data source */}
                <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Info size={14} color="#3498db" />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#a5d6a7' }}>From Your Profile</span>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div>
                            <div style={{ fontSize: '11px', color: '#66bb6a' }}>Weight</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#e8f5e9', fontFamily: 'Outfit, sans-serif' }}>{weight} kg</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', color: '#66bb6a' }}>Height</div>
                            <div style={{ fontSize: '16px', fontWeight: 700, color: '#e8f5e9', fontFamily: 'Outfit, sans-serif' }}>{height} cm</div>
                        </div>
                    </div>
                </div>

                {/* Ayurvedic Note */}
                <div style={{
                    padding: '16px', borderRadius: '12px',
                    background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.1)',
                    fontSize: '13px', color: '#a5d6a7', lineHeight: 1.7,
                    display: 'flex', gap: '10px',
                }}>
                    <Leaf size={16} color="#2ecc71" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                        <strong>Ayurvedic Note:</strong> BMI is a modern metric. In Ayurveda, body composition depends on your Prakriti — Kapha types naturally have heavier builds, while Vata types tend to be lighter. Use this alongside your Dosha analysis.
                    </span>
                </div>
            </div>
        </ProtectedRoute>
    );
}
