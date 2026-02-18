'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSupabaseConfigured) { setLoading(false); return; }
        supabase.auth.getSession().then(({ data: { session: s } }) => {
            setSession(s);
            setUser(s?.user ?? null);
            setLoading(false);
        }).catch(() => {
            // Stale/expired session — clear it silently
            setSession(null);
            setUser(null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
            setUser(s?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sign up with email + password (sends confirmation email with OTP code)
    const signUp = useCallback(async (email: string, password: string, name: string) => {
        if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' };
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        return { error: error?.message ?? null };
    }, []);

    // Sign in with email + password
    const signIn = useCallback(async (email: string, password: string) => {
        if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    }, []);

    // Verify email OTP code (for signup confirmation)
    const verifyOtp = useCallback(async (email: string, token: string) => {
        if (!isSupabaseConfigured) return { error: 'Supabase is not configured.' };
        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email',
        });
        return { error: error?.message ?? null };
    }, []);

    // Google OAuth
    const signInWithGoogle = useCallback(async () => {
        if (!isSupabaseConfigured) return;
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }, []);

    const signOut = useCallback(async () => {
        if (!isSupabaseConfigured) return;
        await supabase.auth.signOut();
        localStorage.removeItem('ayurgenix_user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, loading, signUp, signIn, verifyOtp, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
