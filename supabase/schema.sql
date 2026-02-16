-- ============================================================
-- AyurGenix Database Schema (Complete)
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. Profiles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name    TEXT NOT NULL DEFAULT '',
    last_name     TEXT NOT NULL DEFAULT '',
    name          TEXT NOT NULL DEFAULT '',   -- full name (first + last)
    email         TEXT DEFAULT '',
    avatar_url    TEXT DEFAULT '',
    age           INTEGER DEFAULT 0,
    gender        TEXT DEFAULT '',
    weight        REAL DEFAULT 0,
    height        REAL DEFAULT 0,
    activity_level      TEXT DEFAULT 'moderate',
    dietary_preference  TEXT DEFAULT 'vegetarian',
    eating_habits       TEXT DEFAULT '',
    sleep_hours         REAL DEFAULT 7,
    stress_level        TEXT DEFAULT 'moderate',
    existing_conditions TEXT[] DEFAULT '{}',
    current_medications TEXT DEFAULT '',
    language      TEXT DEFAULT 'en',
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. Assessments (intake data + AI report) ────────────────
CREATE TABLE IF NOT EXISTS public.assessments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prakriti_answers JSONB DEFAULT '{}',
    symptoms         TEXT[] DEFAULT '{}',
    mental_health    TEXT[] DEFAULT '{}',
    disease_details  JSONB DEFAULT '[]',
    complete_report  JSONB,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Chat History ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    messages    JSONB DEFAULT '[]',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. Unique constraint for one chat-history row per user ──
ALTER TABLE public.chat_history
    ADD CONSTRAINT chat_history_user_id_unique UNIQUE (user_id);

-- ============================================================
-- Row Level Security (RLS) — Enable on all tables
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- ─── Profiles policies ──────────────────────────────────────
-- Users can CRUD only their own row
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- ─── Assessments policies ───────────────────────────────────
DROP POLICY IF EXISTS "assessments_select_own" ON public.assessments;
CREATE POLICY "assessments_select_own" ON public.assessments
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "assessments_insert_own" ON public.assessments;
CREATE POLICY "assessments_insert_own" ON public.assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "assessments_update_own" ON public.assessments;
CREATE POLICY "assessments_update_own" ON public.assessments
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "assessments_delete_own" ON public.assessments;
CREATE POLICY "assessments_delete_own" ON public.assessments
    FOR DELETE USING (auth.uid() = user_id);

-- ─── Chat history policies ──────────────────────────────────
DROP POLICY IF EXISTS "chat_select_own" ON public.chat_history;
CREATE POLICY "chat_select_own" ON public.chat_history
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_insert_own" ON public.chat_history;
CREATE POLICY "chat_insert_own" ON public.chat_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_update_own" ON public.chat_history;
CREATE POLICY "chat_update_own" ON public.chat_history
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_delete_own" ON public.chat_history;
CREATE POLICY "chat_delete_own" ON public.chat_history
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: Auto-create profile row when user signs up
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, name, email)
    VALUES (
        NEW.id,
        COALESCE(SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 1), ''),
        COALESCE(
            CASE
                WHEN POSITION(' ' IN COALESCE(NEW.raw_user_meta_data->>'name', '')) > 0
                THEN SUBSTR(NEW.raw_user_meta_data->>'name', POSITION(' ' IN NEW.raw_user_meta_data->>'name') + 1)
                ELSE ''
            END,
            ''
        ),
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.email, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger first (safe re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Trigger: Auto-update `updated_at` on profiles & chat_history
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS chat_history_updated_at ON public.chat_history;
CREATE TRIGGER chat_history_updated_at
    BEFORE UPDATE ON public.chat_history
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Indexes for fast queries
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_assessments_user_id    ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id   ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email         ON public.profiles(email);

-- ============================================================
-- Default Test User (for development/demo only)
-- Email: hello@user.com | Password: hello@
-- ============================================================
-- NOTE: This uses Supabase's internal auth schema.
-- The password is hashed with bcrypt via pgcrypto.
-- The trigger `on_auth_user_created` will auto-create
-- a row in public.profiles for this user.

-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
BEGIN
    -- Only insert if the user doesn't already exist
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'hello@user.com'
    ) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            recovery_token
        ) VALUES (
            test_user_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'hello@user.com',
            crypt('hello@', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"name":"Test User"}'::jsonb,
            NOW(),
            NOW(),
            '',
            ''
        );

        -- Also create an identity entry (required by Supabase Auth)
        INSERT INTO auth.identities (
            id,
            user_id,
            provider_id,
            provider,
            identity_data,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            gen_random_uuid(),
            test_user_id,
            'hello@user.com',
            'email',
            jsonb_build_object(
                'sub', test_user_id::text,
                'email', 'hello@user.com',
                'email_verified', true
            ),
            NOW(),
            NOW(),
            NOW()
        );

        RAISE NOTICE 'Default test user created: hello@user.com / hello@';
    ELSE
        RAISE NOTICE 'Test user hello@user.com already exists, skipping.';
    END IF;
END $$;
