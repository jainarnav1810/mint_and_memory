import { createServerClient, type SetAllCookies } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { supabasePublicKey, supabaseUrl } from '@/lib/supabase/env';

/** See lib/supabase/server.ts — the cookies option is a union, so annotate. */
type CookiesToSet = Parameters<SetAllCookies>[0];

/**
 * Refreshes the Supabase auth cookie on every navigation.
 *
 * Without this, an expired access token is only refreshed in the browser, so
 * server components and route handlers would intermittently see the user as
 * signed out.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = supabaseUrl();
  const anonKey = supabasePublicKey();

  // Nothing to refresh if Supabase isn't configured yet; let the page render
  // and surface its own configuration error.
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Touching getUser() is what triggers the refresh + Set-Cookie.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets, image optimisation output, and the
     * bundled art. Webhooks and cron are excluded too — they authenticate with
     * their own signatures/secrets and carry no user session.
     */
    '/((?!_next/static|_next/image|api/webhooks|api/cron|favicon\\.svg|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
