'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import { saveProfile, loadProfile, saveAssessment, loadLatestAssessment, saveChatHistory, loadChatHistory } from './db';

export interface DiseaseDetail {
    name: string;
    since: string;
    currentSymptoms: string[];
    severity: string;
}

export interface UserData {
    name: string;
    age: number;
    gender: string;
    weight: number;
    height: number;
    activityLevel: string;
    dietaryPreference: string;
    eatingHabits: string;
    sleepHours: number;
    stressLevel: string;
    existingConditions: string[];
    currentMedications: string;
    prakritiAnswers: Record<string, string>;
    symptoms: string[];
    mentalHealth: string[];
    diseaseDetails: DiseaseDetail[];
    completeReport: string | null;
    chatHistory: { role: 'user' | 'assistant'; content: string }[];
    language: string;
    prakritiResult: string | null;
    vikritiResult: string | null;
    healthReport: string | null;
}

const defaultUserData: UserData = {
    name: '', age: 0, gender: '', weight: 0, height: 0,
    activityLevel: 'moderate', dietaryPreference: 'vegetarian',
    eatingHabits: '', sleepHours: 7, stressLevel: 'moderate',
    existingConditions: [], currentMedications: '',
    prakritiAnswers: {}, symptoms: [], mentalHealth: [],
    diseaseDetails: [], completeReport: null,
    chatHistory: [], language: 'en',
    prakritiResult: null, vikritiResult: null, healthReport: null,
};

interface UserContextType {
    userData: UserData;
    updateUser: (data: Partial<UserData>) => void;
    resetUser: () => void;
    isProfileComplete: boolean;
    isAssessmentDone: boolean;
    syncingFromDB: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [userData, setUserData] = useState<UserData>(defaultUserData);
    const [syncingFromDB, setSyncingFromDB] = useState(false);
    const [dbLoaded, setDbLoaded] = useState(false);

    // Try to get auth context (may not exist if not wrapped in AuthProvider)
    let authUser: { id: string } | null = null;
    try {
        const auth = useAuth();
        authUser = auth.user;
    } catch {
        // AuthProvider not available, use localStorage only
    }

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('ayurgenix_user');
        if (saved) {
            try { setUserData({ ...defaultUserData, ...JSON.parse(saved) }); } catch { /* ignore */ }
        }
    }, []);

    // Load from Supabase when user logs in
    useEffect(() => {
        if (!authUser?.id || dbLoaded) return;

        const loadFromDB = async () => {
            setSyncingFromDB(true);
            try {
                const [profile, assessment, chatMsgs] = await Promise.all([
                    loadProfile(authUser!.id),
                    loadLatestAssessment(authUser!.id),
                    loadChatHistory(authUser!.id),
                ]);

                const merged: Partial<UserData> = {};
                if (profile) Object.assign(merged, profile);
                if (assessment) {
                    merged.prakritiAnswers = assessment.prakritiAnswers;
                    merged.symptoms = assessment.symptoms;
                    merged.mentalHealth = assessment.mentalHealth;
                    merged.diseaseDetails = assessment.diseaseDetails as DiseaseDetail[];
                    merged.completeReport = assessment.completeReport;
                }
                if (chatMsgs.length > 0) merged.chatHistory = chatMsgs;

                if (Object.keys(merged).length > 0) {
                    setUserData(prev => ({ ...prev, ...merged }));
                }
            } catch (err) {
                console.error('Failed to load from Supabase:', err);
            } finally {
                setSyncingFromDB(false);
                setDbLoaded(true);
            }
        };

        loadFromDB();
    }, [authUser?.id, dbLoaded]);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('ayurgenix_user', JSON.stringify(userData));
    }, [userData]);

    const updateUser = useCallback((data: Partial<UserData>) => {
        setUserData(prev => {
            const next = { ...prev, ...data };

            // Sync profile fields to Supabase in background
            if (authUser?.id) {
                const profileFields = ['name', 'age', 'gender', 'weight', 'height', 'activityLevel',
                    'dietaryPreference', 'eatingHabits', 'sleepHours', 'stressLevel',
                    'existingConditions', 'currentMedications', 'language'];
                const hasProfileChange = profileFields.some(f => f in data);
                if (hasProfileChange) {
                    saveProfile(authUser.id, next).catch(console.error);
                }

                // Save assessment if completeReport changed
                if (data.completeReport && data.completeReport !== prev.completeReport) {
                    saveAssessment(authUser.id, {
                        prakritiAnswers: next.prakritiAnswers,
                        symptoms: next.symptoms,
                        mentalHealth: next.mentalHealth,
                        diseaseDetails: next.diseaseDetails,
                    }, data.completeReport).catch(console.error);
                }

                // Save chat history if changed
                if (data.chatHistory) {
                    saveChatHistory(authUser.id, data.chatHistory).catch(console.error);
                }
            }

            return next;
        });
    }, [authUser?.id]);

    const resetUser = useCallback(() => {
        setUserData(defaultUserData);
        localStorage.removeItem('ayurgenix_user');
        setDbLoaded(false);
    }, []);

    const isProfileComplete = Boolean(userData.name && userData.age && userData.gender && userData.weight && userData.height);
    const isAssessmentDone = userData.completeReport !== null;

    return (
        <UserContext.Provider value={{ userData, updateUser, resetUser, isProfileComplete, isAssessmentDone, syncingFromDB }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
}
