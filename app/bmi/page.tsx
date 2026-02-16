'use client';

import { useState } from 'react';
import { calculateBMI } from '@/lib/ayurveda-data';
import { Calculator } from 'lucide-react';

export default function BMIPage() {
    const [weight, setWeight] = useState<number>(65);
    const [height, setHeight] = useState<number>(170);
    const [calculated, setCalculated] = useState(false);
    const result = calculateBMI(weight, height);

    const handleCalc = () => setCalculated(true);

    const gauge = () => {
        const angle = Math.min(180, Math.max(0, (result.bmi / 40) * 180));
        return angle;
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px',
                    background: 'linear-gradient(135deg, #3498db, #2980b9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(52, 152, 219, 0.3)',
                }}>
                    <Calculator size={28} color="#fff" />
                </div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', marginBottom: '8px' }}>
                    <span className="gradient-text">BMI Calculator</span>
                </h1>
                <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Body Mass Index — Ayurvedic perspective</p>
            </div>

            <div className="glass-card" style={{ padding: '28px', marginBottom: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '6px' }}>Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => { setWeight(Number(e.target.value)); setCalculated(false); }}
                        className="input" />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '6px' }}>Height (cm)</label>
                    <input type="number" value={height} onChange={(e) => { setHeight(Number(e.target.value)); setCalculated(false); }}
                        className="input" />
                </div>
                <button onClick={handleCalc} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Calculator size={16} /> Calculate BMI
                </button>
            </div>

            {calculated && (
                <div className="glass-card animate-fade-in-up" style={{ padding: '32px', textAlign: 'center' }}>
                    {/* Gauge */}
                    <div style={{ position: 'relative', width: '200px', height: '110px', margin: '0 auto 20px', overflow: 'hidden' }}>
                        <svg width="200" height="110" viewBox="0 0 200 110">
                            {/* Background arc */}
                            <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
                            {/* Colored sections */}
                            <path d="M 10 100 A 90 90 0 0 1 55 25" fill="none" stroke="#40c4ff" strokeWidth="12" strokeLinecap="round" opacity="0.3" />
                            <path d="M 55 25 A 90 90 0 0 1 145 25" fill="none" stroke="#00e676" strokeWidth="12" strokeLinecap="round" opacity="0.3" />
                            <path d="M 145 25 A 90 90 0 0 1 175 60" fill="none" stroke="#ffab00" strokeWidth="12" strokeLinecap="round" opacity="0.3" />
                            <path d="M 175 60 A 90 90 0 0 1 190 100" fill="none" stroke="#ff5252" strokeWidth="12" strokeLinecap="round" opacity="0.3" />
                            {/* Needle */}
                            <line
                                x1="100" y1="100"
                                x2={100 + 75 * Math.cos(Math.PI - (gauge() / 180) * Math.PI)}
                                y2={100 - 75 * Math.sin(Math.PI - (gauge() / 180) * Math.PI)}
                                stroke={result.color} strokeWidth="3" strokeLinecap="round"
                                style={{ transition: 'all 1s ease' }}
                            />
                            <circle cx="100" cy="100" r="5" fill={result.color} />
                        </svg>
                    </div>

                    <div style={{ fontSize: '3rem', fontWeight: 800, color: result.color, fontFamily: 'Outfit, sans-serif' }}>
                        {result.bmi}
                    </div>
                    <div style={{
                        display: 'inline-block', padding: '6px 20px', borderRadius: '20px', marginTop: '8px',
                        background: `${result.color}15`, border: `1px solid ${result.color}30`,
                        fontSize: '14px', fontWeight: 600, color: result.color,
                    }}>
                        {result.category}
                    </div>

                    {/* BMI Scale */}
                    <div style={{ marginTop: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#66bb6a', marginBottom: '6px' }}>
                            <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                        </div>
                        <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ flex: 18.5, background: '#40c4ff' }} />
                            <div style={{ flex: 6.5, background: '#00e676' }} />
                            <div style={{ flex: 5, background: '#ffab00' }} />
                            <div style={{ flex: 10, background: '#ff5252' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#66bb6a', marginTop: '4px' }}>
                            <span>0</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                        </div>
                    </div>

                    {/* Formula */}
                    <div style={{ marginTop: '24px', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', fontSize: '12px', color: '#66bb6a', fontFamily: 'monospace' }}>
                        BMI = {weight}kg ÷ ({(height / 100).toFixed(2)}m)² = {result.bmi}
                    </div>

                    {/* Ayurvedic Note */}
                    <div style={{
                        marginTop: '20px', padding: '14px', borderRadius: '10px',
                        background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.1)',
                        fontSize: '13px', color: '#a5d6a7', textAlign: 'left', lineHeight: 1.6,
                    }}>
                        🌿 <strong>Ayurvedic Note:</strong> BMI is a modern metric. In Ayurveda, body composition also depends on your Prakriti.
                        Kapha types naturally have heavier builds, while Vata types tend to be lighter. Use this alongside your Dosha analysis for a complete picture.
                    </div>
                </div>
            )}
        </div>
    );
}
