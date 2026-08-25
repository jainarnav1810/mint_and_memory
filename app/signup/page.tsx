import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { AuthForm } from '@/components/auth-form';
import { getUser } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Register — Mint & Memory',
  description: 'Create a collector account to bid on and acquire archived specimens.',
};

export default async function SignupPage() {
  const user = await getUser();
  if (user) redirect('/');

  // AuthForm reads `?redirect=` via useSearchParams.
  return (
    <Suspense fallback={null}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
