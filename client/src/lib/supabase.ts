/**
 * Supabase Client — Frontend
 * ──────────────────────────
 * Direct Supabase client for real-time subscriptions
 * and client-side queries. Most data flows through the
 * Express API, but this enables real-time features.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
