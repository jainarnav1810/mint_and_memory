/**
 * Resolves Supabase credentials from the environment, accepting both the current
 * and legacy variable names.
 *
 * Supabase replaced the legacy `anon` / `service_role` JWTs with `sb_publishable_…`
 * and `sb_secret_…` keys. They are drop-in equivalents — the publishable key still
 * resolves to the `anon` role under RLS, and the secret key still bypasses it — but
 * the dashboard now hands out the new names, so a project set up today has
 * `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` where an older one had
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
 *
 * Reading both means the app works regardless of which era the project was created
 * in, and nobody has to hunt down a legacy key that Supabase is phasing out.
 */

export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/** The browser-safe key. Public by design; RLS is what protects the data. */
export function supabasePublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Server-only key that bypasses RLS. Never expose this to the browser. */
export function supabaseSecretKey(): string | undefined {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/** Shared message so every call site reports the same fix. */
export const MISSING_PUBLIC_ENV =
  'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
  '(legacy name: NEXT_PUBLIC_SUPABASE_ANON_KEY). Copy .env.example to .env.local and fill them in.';

export const MISSING_SECRET_ENV =
  'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY ' +
  '(legacy name: SUPABASE_SERVICE_ROLE_KEY) — required for webhook, cron, and admin operations.';
