import { supabase, isSupabaseConfigured } from './supabase';
import type { UserData } from './context';

// ─── Profile ───────────────────────────────
export async function saveProfile(userId: string, data: Partial<UserData>) {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.from('profiles').upsert({
        id: userId,
        name: data.name,
        age: data.age,
        gender: data.gender,
        weight: data.weight,
        height: data.height,
        activity_level: data.activityLevel,
        dietary_preference: data.dietaryPreference,
        eating_habits: data.eatingHabits,
        sleep_hours: data.sleepHours,
        stress_level: data.stressLevel,
        existing_conditions: data.existingConditions,
        current_medications: data.currentMedications,
        language: data.language,
        updated_at: new Date().toISOString(),
    });
    return { error: error?.message ?? null };
}

export async function loadProfile(userId: string): Promise<Partial<UserData> | null> {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) return null;

    return {
        name: data.name || '',
        age: data.age || 0,
        gender: data.gender || '',
        weight: data.weight || 0,
        height: data.height || 0,
        activityLevel: data.activity_level || 'moderate',
        dietaryPreference: data.dietary_preference || 'vegetarian',
        eatingHabits: data.eating_habits || '',
        sleepHours: data.sleep_hours || 7,
        stressLevel: data.stress_level || 'moderate',
        existingConditions: data.existing_conditions || [],
        currentMedications: data.current_medications || '',
        language: data.language || 'en',
    };
}

// ─── Assessments ───────────────────────────
export async function saveAssessment(
    userId: string,
    intakeData: {
        prakritiAnswers: Record<string, string>;
        symptoms: string[];
        mentalHealth: string[];
        diseaseDetails: unknown[];
    },
    completeReport: string
) {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.from('assessments').insert({
        user_id: userId,
        prakriti_answers: intakeData.prakritiAnswers,
        symptoms: intakeData.symptoms,
        mental_health: intakeData.mentalHealth,
        disease_details: intakeData.diseaseDetails,
        complete_report: JSON.parse(completeReport),
    });
    return { error: error?.message ?? null };
}

export async function loadLatestAssessment(userId: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) return null;

    return {
        prakritiAnswers: (data.prakriti_answers as Record<string, string>) || {},
        symptoms: (data.symptoms as string[]) || [],
        mentalHealth: (data.mental_health as string[]) || [],
        diseaseDetails: (data.disease_details as unknown[]) || [],
        completeReport: data.complete_report ? JSON.stringify(data.complete_report) : null,
    };
}

// ─── Chat History ──────────────────────────
export async function saveChatHistory(
    userId: string,
    messages: { role: 'user' | 'assistant'; content: string }[]
) {
    // Upsert: one chat_history row per user
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.from('chat_history').upsert(
        {
            user_id: userId,
            messages: messages,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
    );
    return { error: error?.message ?? null };
}

export async function loadChatHistory(userId: string) {
    if (!isSupabaseConfigured) return [];
    const { data, error } = await supabase
        .from('chat_history')
        .select('messages')
        .eq('user_id', userId)
        .maybeSingle();

    if (error || !data) return [];
    return (data.messages as { role: 'user' | 'assistant'; content: string }[]) || [];
}
