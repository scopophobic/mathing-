import "server-only";
import { createClient } from "@supabase/supabase-js";
import { hasSupabaseConfig } from "@/lib/env";

export function createSupabaseAdminClient() {
  if (!hasSupabaseConfig() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
