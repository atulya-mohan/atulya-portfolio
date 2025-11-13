import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null | undefined;

export function supabaseServer() {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    console.warn('[supabaseServer] Missing Supabase environment variables. Returning null client.');
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(url, serviceRole, {
    auth: { persistSession: false },
  });

  return cachedClient;
}
