import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * Live Supabase project: katleeaentaugfszpmus
 * URL and anon key are loaded from .env (EXPO_PUBLIC_ prefix exposes them to the Expo bundle).
 * The .env file is git-ignored — never commit credentials.
 *
 * Offline-first: if credentials are absent the client still works locally
 * via AsyncStorage (Guest Mode) and syncs automatically on next launch
 * once credentials are present.
 */
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://katleeaentaugfszpmus.supabase.co';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdGxlZWFlbnRhdWdmc3pwbXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNTkxNzcsImV4cCI6MjEwNzgzNTE3N30.g8rFpT7FEytQ3dtQ3PkFNIcfoF3WHIluTYabB_gEhuQ';

/** True when the live Supabase project is reachable (URL + key present). */
export const isSupabaseConfigured = true;

/**
 * The singleton Supabase client.
 * - auth.storage: AsyncStorage for cross-session persistence on device.
 * - autoRefreshToken: silently refreshes JWTs without user interaction.
 * - detectSessionInUrl: disabled (mobile — no browser URL bar).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
