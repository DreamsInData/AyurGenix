import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isConfigured = url.startsWith('http://') || url.startsWith('https://');

// Only create a real client if env vars are properly set.
// Otherwise export a dummy that won't crash the app.
export const supabase: SupabaseClient = isConfigured
    ? createBrowserClient(url, key)
    : (null as unknown as SupabaseClient);

export const isSupabaseConfigured = isConfigured;
