'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, DiseaseDetail } from '@/lib/context';
import {
    prakritiQuestions, symptomOptions, mentalHealthOptions,
    commonDiseases, severityOptions, durationOptions,
    eatingHabitOptions, stressLevelOptions, activityLevelOptions,
    dietaryPreferenceOptions,
} from '@/lib/ayurveda-data';
import { generateCompleteReport } from '@/lib/api';
import {
    User, Brain, HeartPulse, Stethoscope, Sparkles,
    ArrowRight, ArrowLeft, Loader2, CheckCircle, AlertCircle,
    Plus, X, ChevronDown
} from 'lucide-react';

const STEPS = [
    { id: 0, label: 'Profile', icon: User },
    { id: 1, label: 'Prakriti', icon: Brain },
    { id: 2, label: 'Symptoms', icon: HeartPulse },
    { id: 3, label: 'Diseases', icon: Stethoscope },
    { id: 4, label: 'Analysis', icon: Sparkles },
];

const getSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 4 && month <= 6) return 'summer';
    if (month >= 6 && month <= 8) return 'monsoon';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
};

// ---- HELPER COMPONENTS ----

const ProgressBar = ({ step }: { step: number }) => (
    <div style={{ marginBottom: 'clamp(16px, 3vw, 32px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            {STEPS.map((s) => (
                <div key={s.id} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1,
                }}>
                    <div style={{
                        width: 'clamp(30px, 8vw, 40px)', height: 'clamp(30px, 8vw, 40px)', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: step >= s.id
                            ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
                            : 'rgba(46, 204, 113, 0.08)',
                        border: step >= s.id ? 'none' : '1px solid rgba(46, 204, 113, 0.15)',
                        transition: 'all 0.4s ease',
                        boxShadow: step === s.id ? '0 4px 16px rgba(46, 204, 113, 0.3)' : 'none',
                    }}>
                        {step > s.id ? (
                            <CheckCircle size={18} color="#fff" />
                        ) : (
                            <s.icon size={18} color={step >= s.id ? '#fff' : '#66bb6a'} />
                        )}
                    </div>
                    <span style={{
                        fontSize: 'clamp(9px, 2vw, 11px)', fontWeight: step === s.id ? 600 : 400,
                        color: step >= s.id ? '#2ecc71' : '#66bb6a',
                    }}>{s.label}</span>
                </div>
            ))}
        </div>
        <div style={{ height: '3px', borderRadius: '2px', background: 'rgba(46,204,113,0.1)' }}>
            <div style={{
                height: '100%', borderRadius: '2px',
                background: 'linear-gradient(90deg, #2ecc71, #00e676)',
                width: `${(step / (STEPS.length - 1)) * 100}%`,
                transition: 'width 0.5s ease',
            }} />
        </div>
    </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }:
    { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '6px', fontWeight: 500 }}>
            {label}
        </label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} className="input" />
    </div>
);

const ChipSelector = ({ options, selected, onToggle, color = '#2ecc71' }:
    { options: string[]; selected: string[]; onToggle: (v: string) => void; color?: string }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => (
            <button key={opt} onClick={() => onToggle(opt)} style={{
                padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                border: selected.includes(opt) ? `1.5px solid ${color}` : '1px solid rgba(46,204,113,0.12)',
                background: selected.includes(opt) ? `${color}18` : 'rgba(22,32,25,0.5)',
                color: selected.includes(opt) ? color : '#a5d6a7',
            }}>{opt}</button>
        ))}
    </div>
);

const SingleChipSelector = ({ options, selected, onSelect, color = '#2ecc71' }:
    { options: string[]; selected: string; onSelect: (v: string) => void; color?: string }) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => (
            <button key={opt} onClick={() => onSelect(opt.toLowerCase())} style={{
                padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                border: selected === opt.toLowerCase() ? `1.5px solid ${color}` : '1px solid rgba(46,204,113,0.12)',
                background: selected === opt.toLowerCase() ? `${color}18` : 'rgba(22,32,25,0.5)',
                color: selected === opt.toLowerCase() ? color : '#a5d6a7',
            }}>{opt}</button>
        ))}
    </div>
);

export default function AssessPage() {
    const router = useRouter();
    const { userData, updateUser } = useUser();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Step 0: Profile
    const [profile, setProfile] = useState({
        name: userData.name || '',
        age: userData.age || '',
        gender: userData.gender || '',
        weight: userData.weight || '',
        height: userData.height || '',
        activityLevel: userData.activityLevel || 'moderate',
        dietaryPreference: userData.dietaryPreference || 'vegetarian',
        eatingHabits: userData.eatingHabits || '',
        sleepHours: userData.sleepHours || 7,
        stressLevel: userData.stressLevel || 'Moderate',
    });

    // Step 1: Prakriti
    const [answers, setAnswers] = useState<Record<string, string>>(userData.prakritiAnswers || {});

    // Step 2: Symptoms + Mental Health
    const [symptoms, setSymptoms] = useState<string[]>(userData.symptoms || []);
    const [mentalHealth, setMentalHealth] = useState<string[]>(userData.mentalHealth || []);

    // Step 3: Disease Details
    const [hasDiseases, setHasDiseases] = useState(false);
    const [diseases, setDiseases] = useState<DiseaseDetail[]>(userData.diseaseDetails || []);
    const [currentDisease, setCurrentDisease] = useState<DiseaseDetail>({
        name: '', since: '', currentSymptoms: [], severity: 'Mild',
    });
    const [customSymptom, setCustomSymptom] = useState('');
    const [showDiseaseDropdown, setShowDiseaseDropdown] = useState(false);

    // ---- Handlers ----

    const toggleItem = (list: string[], item: string, setter: (v: string[]) => void) => {
        setter(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);
    };

    const addDisease = () => {
        if (!currentDisease.name) return;
        setDiseases([...diseases, currentDisease]);
        setCurrentDisease({ name: '', since: '', currentSymptoms: [], severity: 'Mild' });
        setCustomSymptom('');
    };

    const removeDisease = (i: number) => {
        setDiseases(diseases.filter((_, idx) => idx !== i));
    };

    const addDiseaseSymptom = (sym: string) => {
        if (sym && !currentDisease.currentSymptoms.includes(sym)) {
            setCurrentDisease(prev => ({ ...prev, currentSymptoms: [...prev.currentSymptoms, sym] }));
        }
    };

    const removeDiseaseSymptom = (sym: string) => {
        setCurrentDisease(prev => ({
            ...prev,
            currentSymptoms: prev.currentSymptoms.filter(s => s !== sym),
        }));
    };

    const canProceed = (): boolean => {
        if (step === 0) return Boolean(profile.name && profile.age && profile.gender && profile.weight && profile.height);
        if (step === 1) return Object.keys(answers).length === prakritiQuestions.length;
        if (step === 2) return true; // symptoms are optional
        if (step === 3) return true; // diseases are optional
        return false;
    };

    const handleNext = () => {
        if (step === 4) return;
        setError('');
        setStep(step + 1);
        if (step === 3) {
            // Step 3 → 4 means we start AI analysis
            runAnalysis();
        }
    };

    const handleBack = () => {
        if (step > 0 && step !== 4) setStep(step - 1);
    };

    const runAnalysis = async () => {
        setLoading(true);
        setError('');

        // Save all intake data to context first
        updateUser({
            name: profile.name as string,
            age: Number(profile.age),
            gender: profile.gender as string,
            weight: Number(profile.weight),
            height: Number(profile.height),
            activityLevel: profile.activityLevel,
            dietaryPreference: profile.dietaryPreference,
            eatingHabits: profile.eatingHabits,
            sleepHours: Number(profile.sleepHours),
            stressLevel: profile.stressLevel,
            prakritiAnswers: answers,
            symptoms,
            mentalHealth,
            diseaseDetails: diseases,
        });

        const res = await generateCompleteReport({
            name: profile.name as string,
            age: Number(profile.age),
            gender: profile.gender as string,
            weight: Number(profile.weight),
            height: Number(profile.height),
            activityLevel: profile.activityLevel,
            dietaryPreference: profile.dietaryPreference,
            eatingHabits: profile.eatingHabits,
            sleepHours: Number(profile.sleepHours),
            stressLevel: profile.stressLevel,
            prakritiAnswers: answers,
            symptoms,
            mentalHealth,
            diseaseDetails: diseases,
            season: getSeason(),
            currentMedications: userData.currentMedications || '',
        });

        if (res.success) {
            try {
                const jsonMatch = res.content.match(/\{[\s\S]*\}/);
                const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
                if (parsed) {
                    updateUser({
                        completeReport: JSON.stringify(parsed),
                        // Also set legacy fields for backward compat
                        prakritiResult: JSON.stringify({ prakriti: parsed.prakriti_analysis }),
                        vikritiResult: JSON.stringify(parsed.vikriti_analysis),
                        healthReport: JSON.stringify({
                            diet_plan: parsed.diet_plan,
                            yoga_plan: parsed.yoga_plan,
                            daily_routine: parsed.daily_routine,
                            hydration: parsed.hydration,
                            seasonal_advice: parsed.seasonal_advice,
                            herb_recommendations: parsed.herb_recommendations,
                            risk_assessment: parsed.risk_assessment,
                            weekly_goals: parsed.weekly_goals,
                        }),
                    });
                    setLoading(false);
                    // Short delay then navigate
                    setTimeout(() => router.push('/dashboard'), 1500);
                    return;
                }
                setError('Could not parse AI response. Please try again.');
            } catch {
                setError('Failed to parse response. Please try again.');
            }
        } else {
            setError(res.error || 'API call failed. Please check your API key.');
        }
        setLoading(false);
    };

    // ============================
    // STEP 0: PROFILE
    // ============================
    if (step === 0) {
        return (
            <div style={{ maxWidth: '650px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
                <ProgressBar step={step} />
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Tell Us About Yourself</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>This helps us personalize your Ayurvedic health plan</p>
                </div>

                <div className="glass-card" style={{ padding: '28px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <InputField label="Full Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} placeholder="Your name" />
                        </div>
                        <InputField label="Age" value={profile.age} onChange={v => setProfile(p => ({ ...p, age: v }))} type="number" placeholder="25" />
                        <InputField label="Weight (kg)" value={profile.weight} onChange={v => setProfile(p => ({ ...p, weight: v }))} type="number" placeholder="65" />
                        <InputField label="Height (cm)" value={profile.height} onChange={v => setProfile(p => ({ ...p, height: v }))} type="number" placeholder="170" />
                        <InputField label="Sleep (hrs/night)" value={profile.sleepHours} onChange={v => setProfile(p => ({ ...p, sleepHours: Number(v) }))} type="number" placeholder="7" />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>Gender</label>
                        <SingleChipSelector options={['Male', 'Female', 'Other']} selected={profile.gender} onSelect={v => setProfile(p => ({ ...p, gender: v }))} />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>Activity Level</label>
                        <SingleChipSelector options={activityLevelOptions} selected={profile.activityLevel}
                            onSelect={v => setProfile(p => ({ ...p, activityLevel: v }))} color="#3498db" />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>Dietary Preference</label>
                        <SingleChipSelector options={dietaryPreferenceOptions} selected={profile.dietaryPreference}
                            onSelect={v => setProfile(p => ({ ...p, dietaryPreference: v }))} color="#f39c12" />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>Stress Level</label>
                        <SingleChipSelector options={stressLevelOptions} selected={profile.stressLevel}
                            onSelect={v => setProfile(p => ({ ...p, stressLevel: v }))} color="#e74c3c" />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>Eating Habits</label>
                        <ChipSelector options={eatingHabitOptions}
                            selected={profile.eatingHabits ? profile.eatingHabits.split(', ') : []}
                            onToggle={v => {
                                const current = profile.eatingHabits ? profile.eatingHabits.split(', ') : [];
                                const updated = current.includes(v) ? current.filter(x => x !== v) : [...current, v];
                                setProfile(p => ({ ...p, eatingHabits: updated.join(', ') }));
                            }}
                            color="#9b59b6" />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button onClick={handleNext} className="btn-primary" disabled={!canProceed()}>
                        Next: Prakriti Quiz <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    // ============================
    // STEP 1: PRAKRITI QUIZ
    // ============================
    if (step === 1) {
        const totalQ = prakritiQuestions.length;
        const answeredCount = Object.keys(answers).length;

        return (
            <div style={{ maxWidth: '650px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
                <ProgressBar step={step} />
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Prakriti Quiz</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>
                        {answeredCount}/{totalQ} answered — Discover your Ayurvedic constitution
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {prakritiQuestions.map((q, qi) => (
                        <div key={q.id} className="glass-card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: '10px', fontSize: '12px',
                                    background: 'rgba(46,204,113,0.08)', color: '#2ecc71', fontWeight: 600,
                                }}>{qi + 1}</span>
                                <span style={{ fontSize: '13px', color: '#66bb6a' }}>{q.icon} {q.category}</span>
                                {answers[q.id] && <CheckCircle size={14} color="#00e676" style={{ marginLeft: 'auto' }} />}
                            </div>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '12px', lineHeight: 1.4 }}>
                                {q.question}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {q.options.map(opt => (
                                    <button key={opt.value} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                                        style={{
                                            padding: '12px 16px', borderRadius: '10px', textAlign: 'left',
                                            border: answers[q.id] === opt.value ? '2px solid #2ecc71' : '1px solid rgba(46,204,113,0.1)',
                                            background: answers[q.id] === opt.value ? 'rgba(46,204,113,0.1)' : 'rgba(22,32,25,0.5)',
                                            color: answers[q.id] === opt.value ? '#e8f5e9' : '#a5d6a7',
                                            fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                            transition: 'all 0.2s',
                                        }}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button onClick={handleBack} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={handleNext} className="btn-primary" disabled={!canProceed()}>
                        Next: Symptoms <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    // ============================
    // STEP 2: SYMPTOMS + MENTAL HEALTH
    // ============================
    if (step === 2) {
        return (
            <div style={{ maxWidth: '650px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
                <ProgressBar step={step} />
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Current Health Status</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Select any symptoms or concerns (optional but helps accuracy)</p>
                </div>

                {/* Physical Symptoms */}
                <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🩺 Physical Symptoms
                        {symptoms.length > 0 && <span style={{ fontSize: '12px', color: '#2ecc71', fontWeight: 400 }}>({symptoms.length} selected)</span>}
                    </h3>
                    <ChipSelector options={symptomOptions} selected={symptoms}
                        onToggle={s => toggleItem(symptoms, s, setSymptoms)} color="#e74c3c" />
                </div>

                {/* Mental Health */}
                <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🧠 Mental Health & Emotional Well-being
                        {mentalHealth.length > 0 && <span style={{ fontSize: '12px', color: '#9b59b6', fontWeight: 400 }}>({mentalHealth.length} selected)</span>}
                    </h3>
                    <ChipSelector options={mentalHealthOptions} selected={mentalHealth}
                        onToggle={m => toggleItem(mentalHealth, m, setMentalHealth)} color="#9b59b6" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button onClick={handleBack} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={handleNext} className="btn-primary">
                        Next: Disease Details <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    // ============================
    // STEP 3: DISEASE DETAILS
    // ============================
    if (step === 3) {
        return (
            <div style={{ maxWidth: '650px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 3vw, 24px)' }}>
                <ProgressBar step={step} />
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', marginBottom: '8px' }}>
                        <span className="gradient-text">Any Specific Conditions?</span>
                    </h1>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Tell us about any diseases/conditions for targeted treatment</p>
                </div>

                {/* Toggle */}
                <div className="glass-card" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#a5d6a7', marginBottom: '12px' }}>
                        Do you have any specific health condition you want Ayurvedic treatment for?
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button onClick={() => setHasDiseases(true)} style={{
                            padding: '10px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                            border: hasDiseases ? '2px solid #2ecc71' : '1px solid rgba(46,204,113,0.15)',
                            background: hasDiseases ? 'rgba(46,204,113,0.12)' : 'rgba(22,32,25,0.5)',
                            color: hasDiseases ? '#2ecc71' : '#a5d6a7',
                        }}>Yes</button>
                        <button onClick={() => { setHasDiseases(false); setDiseases([]); }} style={{
                            padding: '10px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                            border: !hasDiseases ? '2px solid #2ecc71' : '1px solid rgba(46,204,113,0.15)',
                            background: !hasDiseases ? 'rgba(46,204,113,0.12)' : 'rgba(22,32,25,0.5)',
                            color: !hasDiseases ? '#2ecc71' : '#a5d6a7',
                        }}>No, skip this</button>
                    </div>
                </div>

                {/* Added Diseases List */}
                {diseases.length > 0 && (
                    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {diseases.map((d, i) => (
                            <div key={i} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px' }}>{d.name}</div>
                                    <div style={{ fontSize: '12px', color: '#66bb6a' }}>
                                        Since: {d.since} • Severity: <span style={{
                                            color: d.severity === 'Severe' ? '#ff5252' : d.severity === 'Moderate' ? '#ffab00' : '#2ecc71',
                                        }}>{d.severity}</span>
                                    </div>
                                    {d.currentSymptoms.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                                            {d.currentSymptoms.map((s, si) => (
                                                <span key={si} style={{
                                                    padding: '2px 8px', borderRadius: '10px', fontSize: '11px',
                                                    background: 'rgba(231,76,60,0.1)', color: '#e74c3c',
                                                }}>{s}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => removeDisease(i)} style={{
                                    background: 'rgba(255,82,82,0.1)', border: 'none', borderRadius: '8px',
                                    padding: '6px', cursor: 'pointer', color: '#ff5252',
                                }}><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Disease Input Form */}
                {hasDiseases && (
                    <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1rem', marginBottom: '16px' }}>
                            {diseases.length > 0 ? '➕ Add Another Condition' : '📋 Describe Your Condition'}
                        </h3>

                        {/* Disease Name */}
                        <div style={{ marginBottom: '14px', position: 'relative' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '6px', fontWeight: 500 }}>
                                Condition Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" value={currentDisease.name} className="input"
                                    placeholder="Type or select a condition..."
                                    onChange={e => { setCurrentDisease(p => ({ ...p, name: e.target.value })); setShowDiseaseDropdown(true); }}
                                    onFocus={() => setShowDiseaseDropdown(true)}
                                />
                                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#66bb6a' }} />
                            </div>
                            {showDiseaseDropdown && (
                                <div style={{
                                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                                    maxHeight: '200px', overflowY: 'auto', marginTop: '4px',
                                    background: 'rgba(22, 32, 25, 0.98)', border: '1px solid rgba(46,204,113,0.15)',
                                    borderRadius: '10px', padding: '6px',
                                }}>
                                    {commonDiseases
                                        .filter(d => d.toLowerCase().includes(currentDisease.name.toLowerCase()))
                                        .map(d => (
                                            <button key={d} onClick={() => {
                                                setCurrentDisease(p => ({ ...p, name: d }));
                                                setShowDiseaseDropdown(false);
                                            }} style={{
                                                display: 'block', width: '100%', padding: '8px 12px', borderRadius: '6px',
                                                background: 'transparent', border: 'none', textAlign: 'left',
                                                color: '#a5d6a7', fontSize: '13px', cursor: 'pointer',
                                                fontFamily: 'Inter, sans-serif',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,204,113,0.1)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                            >{d}</button>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Since When */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>
                                Since When?
                            </label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {durationOptions.map(d => (
                                    <button key={d} onClick={() => setCurrentDisease(p => ({ ...p, since: d }))} style={{
                                        padding: '6px 14px', borderRadius: '16px', fontSize: '12px',
                                        border: currentDisease.since === d ? '1.5px solid #3498db' : '1px solid rgba(52,152,219,0.12)',
                                        background: currentDisease.since === d ? 'rgba(52,152,219,0.12)' : 'rgba(22,32,25,0.5)',
                                        color: currentDisease.since === d ? '#3498db' : '#a5d6a7',
                                        cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                    }}>{d}</button>
                                ))}
                            </div>
                        </div>

                        {/* Severity */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>
                                Severity Level
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {severityOptions.map(s => {
                                    const col = s === 'Severe' ? '#ff5252' : s === 'Moderate' ? '#ffab00' : '#2ecc71';
                                    return (
                                        <button key={s} onClick={() => setCurrentDisease(p => ({ ...p, severity: s }))} style={{
                                            flex: 1, padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                                            border: currentDisease.severity === s ? `2px solid ${col}` : '1px solid rgba(46,204,113,0.1)',
                                            background: currentDisease.severity === s ? `${col}18` : 'rgba(22,32,25,0.5)',
                                            color: currentDisease.severity === s ? col : '#a5d6a7',
                                            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                        }}>{s}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Symptoms for this disease */}
                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#a5d6a7', marginBottom: '8px', fontWeight: 500 }}>
                                Current Symptoms Related to This Condition
                            </label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input type="text" value={customSymptom} className="input"
                                    placeholder="Type a symptom and press Enter..."
                                    onChange={e => setCustomSymptom(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && customSymptom.trim()) {
                                            addDiseaseSymptom(customSymptom.trim());
                                            setCustomSymptom('');
                                        }
                                    }}
                                />
                                <button onClick={() => { if (customSymptom.trim()) { addDiseaseSymptom(customSymptom.trim()); setCustomSymptom(''); } }}
                                    className="btn-secondary" style={{ padding: '10px 14px' }}>
                                    <Plus size={14} />
                                </button>
                            </div>
                            {currentDisease.currentSymptoms.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {currentDisease.currentSymptoms.map((s, i) => (
                                        <span key={i} style={{
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '12px',
                                            background: 'rgba(231,76,60,0.1)', color: '#e74c3c',
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                        }}>
                                            {s}
                                            <button onClick={() => removeDiseaseSymptom(s)} style={{
                                                background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0',
                                            }}><X size={10} /></button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={addDisease} className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}
                            disabled={!currentDisease.name || !currentDisease.since}>
                            <Plus size={14} /> Add This Condition
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                    <button onClick={handleBack} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={handleNext} className="btn-primary">
                        <Sparkles size={14} /> Generate AI Report <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    // ============================
    // STEP 4: AI ANALYSIS
    // ============================
    return (
        <div style={{ maxWidth: '550px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
            <ProgressBar step={step} />

            {loading ? (
                <div className="animate-fade-in-up">
                    <div className="animate-pulse-glow" style={{
                        width: '100px', height: '100px', borderRadius: '24px',
                        background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 32px',
                        boxShadow: '0 12px 40px rgba(46, 204, 113, 0.3)',
                    }}>
                        <Loader2 size={44} color="#fff" style={{ animation: 'spin-slow 2s linear infinite' }} />
                    </div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', marginBottom: '16px' }}>
                        <span className="gradient-text">Analyzing Your Health Profile</span>
                    </h2>
                    <p style={{ color: '#a5d6a7', fontSize: '14px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>
                        Our AI is examining your Prakriti, symptoms, and health conditions through the lens of classical Ayurveda to create your comprehensive health plan.
                    </p>
                    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        {['Analyzing Prakriti Constitution...', 'Evaluating Symptoms & Imbalances...', 'Generating Diet & Yoga Plans...', 'Creating Treatment Protocols...'].map((text, i) => (
                            <div key={i} style={{
                                fontSize: '13px', color: '#66bb6a',
                                opacity: 0, animation: `fadeInUp 0.5s ease forwards ${i * 2}s`,
                            }}>{text}</div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="animate-fade-in-up">
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '20px',
                        background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                    }}>
                        <AlertCircle size={36} color="#ff5252" />
                    </div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', marginBottom: '12px', color: '#ff5252' }}>
                        Analysis Failed
                    </h2>
                    <p style={{ fontSize: '14px', color: '#a5d6a7', marginBottom: '24px' }}>{error}</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <button onClick={() => setStep(3)} className="btn-ghost">
                            <ArrowLeft size={14} /> Go Back
                        </button>
                        <button onClick={runAnalysis} className="btn-primary">
                            <Sparkles size={14} /> Retry Analysis
                        </button>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in-up">
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, #00e676, #2ecc71)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 12px 40px rgba(0, 230, 118, 0.3)',
                    }}>
                        <CheckCircle size={40} color="#fff" />
                    </div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', marginBottom: '12px' }}>
                        <span className="gradient-text">Analysis Complete!</span>
                    </h2>
                    <p style={{ color: '#a5d6a7', fontSize: '14px' }}>Redirecting to your dashboard...</p>
                </div>
            )}
        </div>
    );
}
