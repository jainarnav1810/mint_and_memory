import { cookies } from 'next/headers';
import { createServerClient, type SetAllCookies } from '@supabase/ssr';

import { MISSING_PUBLIC_ENV, supabasePublicKey, supabaseUrl } from './env';

/**
 * `createServerClient` accepts either the modern `getAll`/`setAll` cookie shape
 * or the deprecated `get`/`set`/`remove` one. Because the option is a union,
 * TypeScript can't infer the callback parameter contextually, so annotate it.
 */
type CookiesToSet = Parameters<SetAllCookies>[0];

/**
 * Server-side Supabase client bound to the request's cookies, so `auth.uid()`
 * resolves to the signed-in user inside RLS policies and RPCs.
 *
 * Use this for anything acting *as the user*. For privileged writes that must
 * bypass RLS (webhooks, cron, role assignment) use `lib/supabase/admin.ts`.
 */
export async function createClient() {
  const url = supabaseUrl();
  const publicKey = supabasePublicKey();

  if (!url || !publicKey) {
    throw new Error(MISSING_PUBLIC_ENV);
  }

  const cookieStore = await cookies();

  return createServerClient(url, publicKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // middleware refreshes the session cookie, so this is safe to ignore.
        }
      },
    },
  });
}

/** The signed-in user, or null. Never throws on a missing session. */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export interface SessionContext {
  user: Awaited<ReturnType<typeof getUser>>;
  isAdmin: boolean;
}

/**
 * The signed-in user plus their admin flag, read from `profiles.role`.
 * `profiles` is readable by its owner under RLS, so no service-role key needed.
 */
export async function getSessionContext(): Promise<SessionContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  return { user, isAdmin: profile?.role === 'admin' };
}
