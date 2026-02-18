'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useUser } from '@/lib/context';
import Link from 'next/link';
import {
    LayoutDashboard, Utensils, Dumbbell, Droplets, Calendar, Sun,
    FlaskConical, BookOpen, Stethoscope, ArrowRight, AlertTriangle,
    Brain, TrendingUp, Sparkles, Target
} from 'lucide-react';

export default function DashboardPage() {
    const { userData } = useUser();
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const prakriti = report?.prakriti_analysis;
    const vikriti = report?.vikriti_analysis;
    const risk = report?.risk_assessment;
    const goals = report?.weekly_goals as { goal: string; frequency: string; category: string }[];
    const diseaseTreatments = report?.disease_treatment as { disease: string; dosha_root_cause: string }[];
    const mentalPlan = report?.mental_health_plan;

    // No report → CTA to /assess
    if (!report) {
        return (
            <ProtectedRoute>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
                    <div className="animate-pulse-glow" style={{
                        width: '80px', height: '80px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 28px',
                        boxShadow: '0 12px 40px rgba(46, 204, 113, 0.25)',
                    }}>
                        <LayoutDashboard size={36} color="#fff" />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '12px' }}>
                        <span className="gradient-text">Welcome to AyurGenix</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
                        Start your health assessment to get personalized Ayurvedic guidance — diet, yoga, routine, herbs, and more.
                    </p>
                    <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '16px' }}>
                        <Sparkles size={16} /> Begin Health Assessment <ArrowRight size={16} />
                    </Link>
                </div>
            </ProtectedRoute>
        );
    }

    // ---- Module Cards ----
    const modules = [
        { href: '/diet', label: 'Diet Plan', icon: Utensils, color: '#f39c12', desc: 'Personalized meals & nutrition' },
        { href: '/yoga', label: 'Yoga Plan', icon: Dumbbell, color: '#3498db', desc: 'Asanas, pranayama & meditation' },
        { href: '/hydration', label: 'Hydration', icon: Droplets, color: '#00bcd4', desc: 'Daily water & drink plan' },
        { href: '/routine', label: 'Daily Routine', icon: Calendar, color: '#9b59b6', desc: 'Dinacharya – your schedule' },
        { href: '/seasonal', label: 'Seasonal Guide', icon: Sun, color: '#ff9800', desc: 'Ritucharya for this season' },
        { href: '/herbs', label: 'Herbs', icon: FlaskConical, color: '#00e676', desc: 'Herbal prescriptions' },
        { href: '/diseases', label: 'Disease Library', icon: BookOpen, color: '#e74c3c', desc: 'Condition-specific guidance' },
    ];

    return (
        <ProtectedRoute>
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.4rem, 4vw, 2rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Your Health Dashboard</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>
                        Welcome back, {userData.name}! Here&apos;s your personalized Ayurvedic overview.
                    </p>
                </div>

                {/* Prakriti + Vikriti Summary Row */}
                <div className="grid-2-col" style={{ marginBottom: '24px' }}>
                    {/* Prakriti Card */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Brain size={20} color="#2ecc71" />
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem' }}>Prakriti Constitution</h3>
                        </div>
                        {prakriti && (
                            <>
                                <div style={{
                                    fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                                    marginBottom: '12px', color: '#2ecc71',
                                }}>
                                    {prakriti.constitution_type}
                                </div>
                                {/* Dosha bars */}
                                {[
                                    { name: 'Vata', pct: prakriti.vata_percentage, color: '#3498db' },
                                    { name: 'Pitta', pct: prakriti.pitta_percentage, color: '#e74c3c' },
                                    { name: 'Kapha', pct: prakriti.kapha_percentage, color: '#f39c12' },
                                ].map(d => (
                                    <div key={d.name} style={{ marginBottom: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a5d6a7', marginBottom: '4px' }}>
                                            <span>{d.name}</span><span>{d.pct}%</span>
                                        </div>
                                        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)' }}>
                                            <div style={{
                                                width: `${d.pct}%`, height: '100%', borderRadius: '3px',
                                                background: d.color, transition: 'width 1s ease',
                                            }} />
                                        </div>
                                    </div>
                                ))}
                                <p style={{ fontSize: '12px', color: '#66bb6a', marginTop: '8px', lineHeight: 1.5 }}>
                                    Confidence: {prakriti.confidence_score}%
                                </p>
                            </>
                        )}
                    </div>

                    {/* Vikriti Card */}
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <Stethoscope size={20} color="#e74c3c" />
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem' }}>Current Imbalances</h3>
                        </div>
                        {vikriti && (
                            <>
                                <div style={{
                                    fontSize: '1.1rem', fontWeight: 600, fontFamily: 'Outfit, sans-serif',
                                    marginBottom: '8px',
                                    color: vikriti.severity === 'High' ? '#ff5252' : vikriti.severity === 'Moderate' ? '#ffab00' : '#2ecc71',
                                }}>
                                    {vikriti.severity} Imbalance
                                </div>
                                <p style={{ fontSize: '13px', color: '#a5d6a7', lineHeight: 1.6, marginBottom: '10px' }}>
                                    {vikriti.primary_imbalance}
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {(vikriti.imbalanced_doshas as string[])?.map((d: string) => (
                                        <span key={d} className="badge badge-warning">{d}</span>
                                    ))}
                                </div>
                                {vikriti.red_flags && (vikriti.red_flags as string[]).length > 0 && (
                                    <div style={{
                                        marginTop: '12px', padding: '8px 12px', borderRadius: '8px',
                                        background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.15)',
                                        fontSize: '12px', color: '#ff5252',
                                    }}>
                                        <AlertTriangle size={12} /> Red Flags: {(vikriti.red_flags as string[]).join(', ')}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Risk Assessment + Disease Summary */}
                <div className={risk && diseaseTreatments?.length ? 'grid-2-col' : ''} style={{ marginBottom: '24px' }}>
                    {risk && (
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                <TrendingUp size={18} color={risk.level === 'High' ? '#ff5252' : risk.level === 'Medium' ? '#ffab00' : '#2ecc71'} />
                                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem' }}>Risk Level</h3>
                                <span className={`badge badge-${risk.level === 'High' ? 'danger' : risk.level === 'Medium' ? 'warning' : 'success'}`}>
                                    {risk.level}
                                </span>
                            </div>
                            {(risk.concerns as string[])?.map((c: string, i: number) => (
                                <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '3px 0' }}>• {c}</div>
                            ))}
                            {risk.medical_referral_needed && (
                                <div style={{
                                    marginTop: '10px', padding: '8px', borderRadius: '8px',
                                    background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.15)',
                                    fontSize: '11px', color: '#ff5252', display: 'flex', alignItems: 'center', gap: '6px',
                                }}>
                                    <AlertTriangle size={12} /> Medical consultation recommended
                                </div>
                            )}
                        </div>
                    )}

                    {diseaseTreatments && diseaseTreatments.length > 0 && (
                        <div className="glass-card" style={{ padding: '20px' }}>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <BookOpen size={18} color="#e74c3c" /> Disease Treatment
                            </h3>
                            {diseaseTreatments.map((d, i) => (
                                <div key={i} style={{ marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{d.disease}</div>
                                    <p style={{ fontSize: '12px', color: '#a5d6a7', lineHeight: 1.5 }}>{d.dosha_root_cause}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mental Health Plan */}
                {mentalPlan && (
                    <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '10px' }}>
                            🧠 Mental Wellness Plan
                        </h3>
                        <p style={{ fontSize: '13px', color: '#a5d6a7', lineHeight: 1.6, marginBottom: '10px' }}>
                            {mentalPlan.assessment}
                        </p>
                        {(mentalPlan.practices as { practice: string; frequency: string }[])?.slice(0, 3).map((p: { practice: string; frequency: string }, i: number) => (
                            <div key={i} style={{ fontSize: '12px', color: '#66bb6a', padding: '3px 0' }}>
                                • {p.practice} ({p.frequency})
                            </div>
                        ))}
                    </div>
                )}

                {/* Weekly Goals */}
                {goals && goals.length > 0 && (
                    <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={18} color="#f39c12" /> Weekly Goals
                        </h3>
                        <div className="grid-2-col" style={{ gap: '8px' }}>
                            {goals.slice(0, 6).map((g, i) => (
                                <div key={i} style={{
                                    padding: '10px 14px', borderRadius: '10px',
                                    background: 'rgba(243,156,18,0.05)', border: '1px solid rgba(243,156,18,0.1)',
                                    fontSize: '13px', color: '#a5d6a7',
                                }}>
                                    <span style={{ color: '#f39c12', fontSize: '11px', fontWeight: 600 }}>
                                        {g.category.toUpperCase()}
                                    </span>
                                    <div style={{ marginTop: '4px' }}>{g.goal}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Module Cards Grid */}
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', marginBottom: '16px' }}>
                    <span className="gradient-text">Explore Your Plan</span>
                </h2>
                <div className="grid-3-col" style={{ marginBottom: '32px' }}>
                    {modules.map(m => (
                        <Link key={m.href} href={m.href} className="glass-card" style={{
                            padding: '20px', textDecoration: 'none', transition: 'all 0.3s',
                            display: 'flex', flexDirection: 'column', gap: '10px',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: `${m.color}15`, border: `1px solid ${m.color}25`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <m.icon size={20} color={m.color} />
                            </div>
                            <div>
                                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 600, marginBottom: '2px' }}>
                                    {m.label}
                                </div>
                                <div style={{ fontSize: '12px', color: '#66bb6a' }}>{m.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Retake Assessment */}
                <div style={{ textAlign: 'center' }}>
                    <Link href="/assess" style={{
                        color: '#66bb6a', fontSize: '13px', textDecoration: 'underline',
                    }}>
                        Retake Health Assessment
                    </Link>
                </div>

                {/* Disclaimer */}
                <div style={{
                    marginTop: '24px', padding: '14px', borderRadius: '10px',
                    background: 'rgba(255,171,0,0.06)', border: '1px solid rgba(255,171,0,0.12)',
                    fontSize: '12px', color: '#ffab00', textAlign: 'center',
                }}>
                    ⚠️ {report?.risk_assessment?.disclaimer || 'This is educational guidance, not a substitute for professional medical advice.'}
                </div>
            </div>
        </ProtectedRoute >
    );
}
