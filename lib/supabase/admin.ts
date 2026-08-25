import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — required for webhook, cron, and admin operations.',
    );
  }

  cached = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return cached;
}
