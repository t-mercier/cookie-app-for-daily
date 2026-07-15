import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function initSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    return (initSupabase() as any)[prop];
  },
});
