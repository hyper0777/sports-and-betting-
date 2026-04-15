export interface SupabaseClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function getSupabaseClientConfig(): SupabaseClientConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const missing: string[] = [];

  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new Error(
      `Supabase configuration missing: ${missing.join(', ')}. Add these to your .env file and restart the dev server.`
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}
