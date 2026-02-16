'use client';

import { useState } from 'react';
import { useUser } from '@/lib/context';
import { getDiseaseAdvice } from '@/lib/api';
import { BookOpen, Search, Loader2, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const commonDiseases = [
    'Weight Loss', 'Weight Gain', 'Hair Fall', 'Acne', 'Constipation',
    'Stress & Anxiety', 'Diabetes (Guidance)', 'PCOS', 'Thyroid Issues',
    'Insomnia', 'Acid Reflux', 'Joint Pain', 'Low Immunity', 'Migraine',
    'High Blood Pressure', 'Skin Allergies',
];

interface DiseaseStage {
    level: string;
    advice: string;
    symptoms?: string[];
}

interface DiseaseHerb {
    name: string;
    usage: string;
    dosage: string;
}

interface DiseaseResult {
    disease: string;
    dosha_root_cause?: string;
    stages?: DiseaseStage[];
    diet?: { eat: string[]; avoid: string[] };
    herbs?: DiseaseHerb[];
    lifestyle?: string[];
    yoga?: string[];
    disclaimer?: string;
    [key: string]: unknown;
}

export default function DiseasesPage() {
    const { userData } = useUser();
    const [selectedDisease, setSelectedDisease] = useState('');
    const [customDisease, setCustomDisease] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DiseaseResult | null>(null);
    const [error, setError] = useState('');
    const [expandedStage, setExpandedStage] = useState<number | null>(null);

    const prakriti = userData.prakritiResult
        ? (JSON.parse(userData.prakritiResult)?.prakriti?.constitution_type || 'Unknown')
        : 'Not assessed';

    const handleSearch = async (disease: string) => {

        setSelectedDisease(disease); setLoading(true); setError(''); setResult(null);

        const res = await getDiseaseAdvice(
            disease, prakriti,
            { age: userData.age || 25, gender: userData.gender || 'unknown' }
        );

        if (res.success) {
            try {
                const jsonMatch = res.content.match(/\{[\s\S]*\}/);
                const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
                if (parsed) setResult(parsed);
                else setError('Could not parse response.');
            } catch { setError('Failed to parse response.'); }
        } else { setError(res.error || 'API call failed.'); }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>


            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(231, 76, 60, 0.3)',
                }}>
                    <BookOpen size={28} color="#fff" />
                </div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '8px' }}>
                    <span className="gradient-text">Disease Intelligence Library</span>
                </h1>
                <p style={{ color: '#a5d6a7', fontSize: '14px' }}>
                    Get AI-powered Ayurvedic guidance for health conditions (Prakriti: {prakriti})
                </p>
            </div>

            {/* Search */}
            <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#66bb6a' }} />
                        <input type="text" value={customDisease} className="input" style={{ paddingLeft: '36px' }}
                            onChange={(e) => setCustomDisease(e.target.value)}
                            placeholder="Type any health condition..."
                            onKeyDown={(e) => e.key === 'Enter' && customDisease && handleSearch(customDisease)}
                        />
                    </div>
                    <button onClick={() => customDisease && handleSearch(customDisease)} className="btn-primary"
                        style={{ padding: '12px 20px' }} disabled={loading}>
                        {loading ? <Loader2 size={16} style={{ animation: 'spin-slow 1s linear infinite' }} /> : <ArrowRight size={16} />}
                    </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {commonDiseases.map((d) => (
                        <button key={d} onClick={() => handleSearch(d)} style={{
                            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                            border: selectedDisease === d ? '1.5px solid #e74c3c' : '1px solid rgba(231,76,60,0.12)',
                            background: selectedDisease === d ? 'rgba(231,76,60,0.12)' : 'rgba(22,32,25,0.5)',
                            color: selectedDisease === d ? '#e74c3c' : '#a5d6a7',
                        }}>
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)', fontSize: '13px', color: '#ff5252', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader2 size={32} color="#2ecc71" style={{ animation: 'spin-slow 1.5s linear infinite', marginBottom: '12px' }} />
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Generating Ayurvedic guidance for &ldquo;{selectedDisease}&rdquo;...</p>
                </div>
            )}

            {result && !loading && (
                <div className="animate-fade-in-up">
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', marginBottom: '16px' }}>
                        {result.disease}
                    </h2>

                    {!!result.dosha_root_cause && (
                        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '8px' }}>🧬 Dosha Root Cause</h3>
                            <p style={{ fontSize: '14px', color: '#a5d6a7', lineHeight: 1.6 }}>{result.dosha_root_cause}</p>
                        </div>
                    )}

                    {/* Stages */}
                    {Array.isArray(result.stages) && (
                        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '14px' }}>📊 Stage-Based Guidance</h3>
                            {result.stages.map((s, i) => (
                                <div key={i} style={{
                                    marginBottom: '8px', borderRadius: '10px',
                                    border: '1px solid rgba(46,204,113,0.08)', overflow: 'hidden',
                                }}>
                                    <button onClick={() => setExpandedStage(expandedStage === i ? null : i)} style={{
                                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '12px 16px', background: 'rgba(22,32,25,0.4)', border: 'none',
                                        cursor: 'pointer', color: '#e8f5e9', fontFamily: 'Inter, sans-serif',
                                    }}>
                                        <span className={`badge badge-${s.level === 'Severe' ? 'danger' : s.level === 'Moderate' ? 'warning' : 'success'}`}>
                                            {s.level}
                                        </span>
                                        {expandedStage === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                    {expandedStage === i && (
                                        <div style={{ padding: '14px 16px', fontSize: '13px', color: '#a5d6a7' }}>
                                            <p style={{ marginBottom: '8px' }}>{s.advice}</p>
                                            {Array.isArray(s.symptoms) && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {s.symptoms.map((sym, si) => (
                                                        <span key={si} style={{
                                                            padding: '3px 10px', borderRadius: '12px', fontSize: '11px',
                                                            background: 'rgba(255,255,255,0.04)', color: '#66bb6a',
                                                        }}>{sym}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Diet */}
                    {result.diet && typeof result.diet === 'object' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div className="glass-card" style={{ padding: '20px' }}>
                                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: '#00e676', marginBottom: '10px' }}>✅ Eat</h4>
                                {(result.diet.eat || []).map((f, i) => (
                                    <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '3px 0' }}>• {f}</div>
                                ))}
                            </div>
                            <div className="glass-card" style={{ padding: '20px' }}>
                                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', color: '#ff5252', marginBottom: '10px' }}>❌ Avoid</h4>
                                {(result.diet.avoid || []).map((f, i) => (
                                    <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '3px 0' }}>• {f}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Herbs */}
                    {Array.isArray(result.herbs) && (
                        <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', marginBottom: '12px' }}>🌿 Herbal Recommendations</h3>
                            {result.herbs.map((h, i) => (
                                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(46,204,113,0.06)', fontSize: '13px' }}>
                                    <span style={{ fontWeight: 600 }}>{h.name}</span> — {h.usage} <span style={{ color: '#66bb6a' }}>({h.dosage})</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Lifestyle & Yoga */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {Array.isArray(result.lifestyle) && (
                            <div className="glass-card" style={{ padding: '20px' }}>
                                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: '10px' }}>🏡 Lifestyle</h4>
                                {result.lifestyle.map((l, i) => (
                                    <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '3px 0' }}>• {l}</div>
                                ))}
                            </div>
                        )}
                        {Array.isArray(result.yoga) && (
                            <div className="glass-card" style={{ padding: '20px' }}>
                                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: '10px' }}>🧘 Yoga</h4>
                                {result.yoga.map((y, i) => (
                                    <div key={i} style={{ fontSize: '13px', color: '#a5d6a7', padding: '3px 0' }}>• {y}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!!result.disclaimer && (
                        <div style={{
                            padding: '14px', borderRadius: '10px',
                            background: 'rgba(255,171,0,0.06)', border: '1px solid rgba(255,171,0,0.12)',
                            fontSize: '12px', color: '#ffab00', fontStyle: 'italic',
                        }}>
                            ⚠️ {result.disclaimer}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
