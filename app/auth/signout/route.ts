import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';

/**
 * Sign-out is a POST so it can't be triggered by a stray link prefetch or an
 * <img> tag pointed at this URL.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
