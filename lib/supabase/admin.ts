import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { MISSING_SECRET_ENV, supabaseSecretKey, supabaseUrl } from './env';

/**
 * Service-role Supabase client. **Server-only** — it bypasses row-level
 * security, so it must never be imported into a client component.
 *
 * Use it only where the request genuinely acts as the system rather than as a
 * user: payment webhooks, the auction-closing cron, and role assignment.
 *
 * Created lazily so that a missing key fails loudly at the call site instead of
 * silently pointing every query at a placeholder host.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = supabaseUrl();
  const secretKey = supabaseSecretKey();

  if (!url || !secretKey) {
    throw new Error(MISSING_SECRET_ENV);
  }

  cached = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cached;
}
