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
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // `profiles` is created by the handle_new_user trigger, so the row exists here.
  const isAdmin = data.user ? await syncAdminRole(data.user.id, data.user.email) : false;

  // With email confirmation enabled Supabase returns a user but no session.
  return NextResponse.json({
    ok: true,
    needsConfirmation: !data.session,
    isAdmin,
  });
}
