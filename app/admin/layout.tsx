import { redirect } from 'next/navigation';

import { getSessionContext } from '@/lib/supabase/server';

/**
 * Server-side guard for every `/admin/*` route. Rendering stops here for
 * non-admins, so no admin markup or data is ever produced for them — the
 * database's RLS policies are the second, authoritative line of defence.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = await getSessionContext();

  if (!user) redirect('/login?redirect=/admin/dashboard');
  if (!isAdmin) redirect('/');

  return <>{children}</>;
}
