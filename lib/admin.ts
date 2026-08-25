import { getSupabaseAdmin } from '@/lib/supabase/admin';

/**
 * Admin identity comes from the server-only `ADMIN_EMAILS` allowlist
 * (comma-separated). The allowlist is the source of truth; `profiles.role` is
 * the durable copy the database's own RLS policies read, so the two are
 * reconciled on every signup and sign-in.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/**
 * Promote an allowlisted collector to `admin` in `profiles`.
 *
 * Promotion only — never demotes, so an admin granted directly in the database
 * is not silently revoked by an incomplete env var. Uses the service-role client
 * because a buyer cannot elevate their own role under RLS.
 *
 * Returns whether the user should be treated as an admin.
 */
export async function syncAdminRole(userId: string, email?: string | null): Promise<boolean> {
  if (!isAdminEmail(email)) return false;

  try {
    const { error } = await getSupabaseAdmin()
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);

    if (error) {
      console.error('[admin] role sync failed:', error.message);
    }
  } catch (err) {
    // A missing service-role key must not break sign-in.
    console.error('[admin] role sync unavailable:', err instanceof Error ? err.message : err);
  }

  return true;
}
