import { createBrowserClient } from '@supabase/ssr';

import { MISSING_PUBLIC_ENV, supabasePublicKey, supabaseUrl } from './env';

/**
 * Browser-side Supabase client. Reads/writes the same auth cookie the server
 * client uses, so a session established here is visible to server components
 * and route handlers.
 *
 * Only the publishable (anon) key is used here — it ships to the browser by
 * design and is safe *provided* row-level security is enabled on every table.
 */
export function createClient() {
  const url = supabaseUrl();
  const publicKey = supabasePublicKey();

  if (!url || !publicKey) {
    throw new Error(MISSING_PUBLIC_ENV);
  }

  return createBrowserClient(url, publicKey);
}
