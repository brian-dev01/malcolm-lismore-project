/**
 * Supabase Client Configuration
 * ─────────────────────────────
 * Singleton Supabase client instance used across all route handlers.
 * Reads credentials from environment variables.
 * Gracefully degrades if credentials are missing (server runs in demo mode).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client connected');
} else {
  console.warn(
    '⚠️  Missing SUPABASE_URL or SUPABASE_ANON_KEY — running in demo mode.\n' +
    '   Copy .env.example to .env and fill in your Supabase credentials.\n' +
    '   Forms will accept submissions locally without database storage.'
  );
}

export { supabase };
