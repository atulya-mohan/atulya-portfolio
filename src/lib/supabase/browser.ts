'use client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (browserClient !== undefined) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn('[getSupabaseBrowser] Missing Supabase environment variables. Returning null client.');
    browserClient = null;
    return browserClient;
  }

  browserClient = createClient(url, anonKey);
  return browserClient;
}