import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthForm } from '@/components/auth-form';
import { getUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Sign In — Mint & Memory',
  description: 'Sign in to bid on auctions and acquire specimens from the archive.',
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect('/');

  // AuthForm reads `?redirect=` via useSearchParams.
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
