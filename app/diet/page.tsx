'use client';

import { useUser } from '@/lib/context';
import Link from 'next/link';
import { Utensils, ArrowRight, Clock, Leaf } from 'lucide-react';

export default function DietPage() {
    const { userData } = useUser();
    const report = userData.completeReport ? JSON.parse(userData.completeReport) : null;
    const diet = report?.diet_plan;
    const diseaseDiets = (report?.disease_treatment as { disease: string; specific_diet: { eat: string[]; avoid: string[] } }[])
        ?.filter((d: { specific_diet?: { eat: string[]; avoid: string[] } }) => d.specific_diet);

    if (!diet) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
                <Utensils size={48} color="#f39c12" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', marginBottom: '12px' }}>
                    <span className="gradient-text">Personalized Diet Plan</span>
                </h1>
                <p style={{ color: '#a5d6a7', marginBottom: '28px' }}>Complete your health assessment first to get an AI-powered diet plan.</p>
                <Link href="/assess" className="btn-primary" style={{ textDecoration: 'none' }}>Take Assessment <ArrowRight size={14} /></Link>
            </div>
        );
    }

    const macros = diet.macronutrient_ratio;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(243, 156, 18, 0.3)',
                }}>
                    <Utensils size={28} color="#fff" />
                </div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '8px' }}>
                    <span className="gradient-text">Your Personalized Diet Plan</span>
                </h1>
                <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Based on your {report?.prakriti_analysis?.constitution_type} constitution</p>
            </div>

            {/* Macronutrient Ratio */}
            {macros && (
                <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '16px' }}>📊 Macronutrient Ratio</h3>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {[
                            { name: 'Carbs', pct: macros.carbs, color: '#f39c12' },
                            { name: 'Protein', pct: macros.protein, color: '#3498db' },
                            { name: 'Fat', pct: macros.fat, color: '#e74c3c' },
                        ].map(m => (
                            <div key={m.name} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{
                                    width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 8px',
                                    background: `conic-gradient(${m.color} ${m.pct * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <div style={{
                                        width: '56px', height: '56px', borderRadius: '50%',
                                        background: 'rgba(15,26,18,0.9)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', fontWeight: 700, color: m.color,
                                    }}>{m.pct}%</div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#a5d6a7', fontWeight: 500 }}>{m.name}</div>
                            </div>
                        ))}
                    </div>
                    {diet.calorie_range && (
                        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: '#66bb6a' }}>
                            📋 Recommended calories: <strong>{diet.calorie_range}</strong>
                        </div>
                    )}
                </div>
            )}

            {/* Foods to Eat / Avoid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: '#00e676', marginBottom: '14px' }}>✅ Foods to Eat</h3>
                    {(diet.foods_to_eat as { food: string; reason: string }[])?.map((f: { food: string; reason: string }, i: number) => (
                        <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(46,204,113,0.06)', fontSize: '13px' }}>
                            <div style={{ fontWeight: 600 }}>{f.food}</div>
                            <div style={{ color: '#66bb6a', fontSize: '12px' }}>{f.reason}</div>
                        </div>
                    ))}
                </div>
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', color: '#ff5252', marginBottom: '14px' }}>❌ Foods to Avoid</h3>
                    {(diet.foods_to_avoid as { food: string; reason: string }[])?.map((f: { food: string; reason: string }, i: number) => (
                        <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,82,82,0.06)', fontSize: '13px' }}>
                            <div style={{ fontWeight: 600 }}>{f.food}</div>
                            <div style={{ color: '#66bb6a', fontSize: '12px' }}>{f.reason}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Meal Schedule */}
            {diet.meal_schedule && (
                <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} color="#3498db" /> Meal Schedule
                    </h3>
                    {(diet.meal_schedule as { time: string; meal: string; calories?: string }[]).map((m: { time: string; meal: string; calories?: string }, i: number) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '12px 0', borderBottom: '1px solid rgba(46,204,113,0.06)',
                        }}>
                            <div style={{
                                padding: '6px 12px', borderRadius: '8px',
                                background: 'rgba(52,152,219,0.1)', color: '#3498db',
                                fontSize: '13px', fontWeight: 600, minWidth: '80px', textAlign: 'center',
                            }}>{m.time}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: 500 }}>{m.meal}</div>
                                {m.calories && <div style={{ fontSize: '11px', color: '#66bb6a' }}>~{m.calories}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cooking Methods & Herbal Additions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {diet.cooking_methods && (
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: '10px' }}>🍳 Cooking Methods</h4>
                        {(diet.cooking_methods as string[]).map((m: string, i: number) => (
                            <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '3px 0' }}>• {m}</div>
                        ))}
                    </div>
                )}
                {diet.herbal_additions && (
                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Leaf size={14} color="#00e676" /> Herbal Additions
                        </h4>
                        {(diet.herbal_additions as string[]).map((h: string, i: number) => (
                            <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '3px 0' }}>• {h}</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Disease-Specific Diet */}
            {diseaseDiets && diseaseDiets.length > 0 && (
                <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '16px', color: '#e74c3c' }}>
                        🩺 Disease-Specific Diet Adjustments
                    </h3>
                    {diseaseDiets.map((d, i) => (
                        <div key={i} style={{ marginBottom: '16px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '8px' }}>{d.disease}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div style={{
                                    padding: '10px', borderRadius: '8px',
                                    background: 'rgba(0,230,118,0.04)', fontSize: '12px',
                                }}>
                                    <div style={{ color: '#00e676', fontWeight: 600, marginBottom: '4px' }}>Eat</div>
                                    {d.specific_diet.eat?.map((f: string, fi: number) => (
                                        <div key={fi} style={{ color: '#a5d6a7', padding: '1px 0' }}>• {f}</div>
                                    ))}
                                </div>
                                <div style={{
                                    padding: '10px', borderRadius: '8px',
                                    background: 'rgba(255,82,82,0.04)', fontSize: '12px',
                                }}>
                                    <div style={{ color: '#ff5252', fontWeight: 600, marginBottom: '4px' }}>Avoid</div>
                                    {d.specific_diet.avoid?.map((f: string, fi: number) => (
                                        <div key={fi} style={{ color: '#a5d6a7', padding: '1px 0' }}>• {f}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {diet.special_notes && (
                <div style={{
                    padding: '14px', borderRadius: '10px',
                    background: 'rgba(255,171,0,0.06)', border: '1px solid rgba(255,171,0,0.12)',
                    fontSize: '13px', color: '#ffab00', marginBottom: '20px',
                }}>
                    📝 {diet.special_notes}
                </div>
            )}
        </div>
    );
}
