'use client';

import { useUser } from '@/lib/context';
import AuthGuard from '@/components/auth-guard';
import Link from 'next/link';
import {
    LayoutDashboard, Utensils, Dumbbell, Droplets, Calendar, Sun,
    FlaskConical, BookOpen, Stethoscope, ArrowRight, AlertTriangle,
    Brain, TrendingUp, Sparkles, Target, AlertCircle
} from 'lucide-react';
import React from 'react';

export default function DashboardPage() {
    const { userData } = useUser();

    // Parse the report if it exists
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const prakriti = report?.prakriti_analysis;
    const vikriti = report?.vikriti_analysis;
    const risk = report?.risk_assessment;
    const goals = report?.weekly_goals;
    const diseaseTreatments = report?.disease_treatment;
    const mentalPlan = report?.mental_health_plan;

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
        <AuthGuard>
            <div className="max-w-7xl mx-auto py-8 px-4 md:p-8">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '8px' }}>
                        <span className="gradient-text">Welcome, {userData.name?.split(' ')[0] || 'Seeker'}</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Here is your Ayurvedic health overview</p>
                </div>

                {!report ? (
                    // No Report CTA
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
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '12px' }}>
                            <span className="gradient-text">Welcome to AyurGenix</span>
                        </h1>
                        <p style={{ color: '#a5d6a7', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
                            Start your health assessment to get personalized Ayurvedic guidance — diet, yoga, routine, herbs, and more.
                        </p>
                        <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <Sparkles size={16} /> Begin Health Assessment <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    // Dashboard Content
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Prakriti & Vikriti Card */}
                        <div className="glass-card p-6 col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Brain size={20} className="text-secondary" />
                                <h3 className="text-lg font-outfit font-semibold text-white">Your Constitution</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-gray-400 mb-1">Prakriti (Birth Nature)</div>
                                    <div className="text-xl font-outfit font-bold text-secondary">{prakriti?.primary_dosha} - {prakriti?.secondary_dosha}</div>
                                    <div className="text-xs text-gray-300 mt-1">{prakriti?.description}</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="text-xs text-gray-400 mb-1">Vikriti (Current Imbalance)</div>
                                    <div className="text-xl font-outfit font-bold text-red-400">{vikriti?.primary_imbalance} Imbalance</div>
                                    <div className="text-xs text-gray-300 mt-1">{vikriti?.imbalance_description}</div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Assessment Card */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle size={20} className="text-red-400" />
                                <h3 className="text-lg font-outfit font-semibold text-white">Risk Analysis</h3>
                            </div>
                            <div className="space-y-3">
                                {risk?.potential_risks?.slice(0, 3).map((r: string, i: number) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <AlertCircle size={14} className="mt-1 text-red-400 shrink-0" />
                                        <span>{r}</span>
                                    </div>
                                ))}
                                {risk?.lifestyle_impact && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="text-xs text-gray-400 mb-1">Lifestyle Impact</div>
                                        <div className="text-sm text-gray-300">{risk.lifestyle_impact}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Goals Card */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Target size={20} className="text-blue-400" />
                                <h3 className="text-lg font-outfit font-semibold text-white">Weekly Focus</h3>
                            </div>
                            <div className="space-y-3">
                                {goals?.map((g: any, i: number) => (
                                    <div key={i} className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-blue-400 font-semibold uppercase">{g.category}</span>
                                            <span className="text-xs text-gray-400">{g.frequency}</span>
                                        </div>
                                        <div className="text-gray-200">{g.goal}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Module Cards Grid */}
                {report && (
                    <>
                        <h2 className="text-xl font-outfit font-semibold mb-4">
                            <span className="gradient-text">Explore Your Plan</span>
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                            {modules.map(m => (
                                <Link key={m.href} href={m.href} className="glass-card p-4 transition-all hover:scale-[1.02] flex flex-col gap-3 group">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                        style={{ background: `${m.color}15`, border: `1px solid ${m.color}25` }}>
                                        <m.icon size={20} color={m.color} />
                                    </div>
                                    <div>
                                        <div className="font-outfit font-semibold text-white mb-1 group-hover:text-secondary transition-colors">
                                            {m.label}
                                        </div>
                                        <div className="text-xs text-gray-400 line-clamp-1">{m.desc}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Retake Assessment */}
                        <div className="text-center">
                            <Link href="/assess" className="text-sm text-secondary hover:underline">
                                Retake Health Assessment
                            </Link>
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-8 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 text-xs text-orange-400 text-center">
                            ⚠️ {risk?.disclaimer || 'This is educational guidance, not a substitute for professional medical advice.'}
                        </div>
                    </>
                )}
            </div>
        </AuthGuard>
    );
}
