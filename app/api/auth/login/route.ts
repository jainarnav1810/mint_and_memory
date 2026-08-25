import { NextResponse, type NextRequest } from 'next/server';

import { syncAdminRole } from '@/lib/admin';
import { createClient } from '@/lib/supabase/server';
import { credentialsSchema, firstIssue } from '@/lib/validators';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = credentialsSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Don't distinguish "no such user" from "wrong password".
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // Keep profiles.role in step with the allowlist, so an email added to
  // ADMIN_EMAILS after signup gains admin on next sign-in.
  const isAdmin = data.user ? await syncAdminRole(data.user.id, data.user.email) : false;

  return NextResponse.json({ ok: true, isAdmin });
}
