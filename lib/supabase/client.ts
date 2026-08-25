import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client. Reads/writes the same auth cookie the server
 * client uses, so a session established here is visible to server components
 * and route handlers.
 *
 * Only the anon key is used here — it ships to the browser by design and is
 * safe *provided* row-level security is enabled on every table.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill them in.',
    );
  }

  return createBrowserClient(url, anonKey);
}
