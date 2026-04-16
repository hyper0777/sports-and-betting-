export interface SupabaseClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Get Supabase configuration from environment variables
 * Returns null if configuration is incomplete (graceful fallback)
 */
export function getSupabaseClientConfig(): SupabaseClientConfig | null {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // If either is missing, return null instead of throwing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase not configured. Authentication and betting features will be disabled. ' +
      'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable these features.'
    );
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}
