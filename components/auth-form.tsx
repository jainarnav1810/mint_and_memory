'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, KeyRound, Loader2, MailCheck, UserPlus } from 'lucide-react';

import { DrawerPull } from './svg/drawer-pull';

type Mode = 'login' | 'signup';

interface AuthFormProps {
  mode: Mode;
}

const COPY: Record<Mode, { kicker: string; heading: string; blurb: string; cta: string }> = {
  login: {
    kicker: 'Collector Access Card',
    heading: 'Sign In to the Archive',
    blurb: 'Your credentials unlock bidding, acquisitions, and your dispatch history.',
    cta: 'Open the Drawer',
  },
  signup: {
    kicker: 'New Accession Record',
    heading: 'Register as a Collector',
    blurb: 'Create an account to bid on auctions and acquire specimens from the archive.',
    cta: 'Create Collector Account',
  },
};

/** Only allow same-site paths back from `?redirect=` — never an absolute URL. */
function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get('redirect'));
  const copy = COPY[mode];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.error ?? `Sign-${mode === 'login' ? 'in' : 'up'} failed`);
        return;
      }

      // Signup with email confirmation enabled returns no session — say so instead
      // of bouncing the collector to a page that will treat them as anonymous.
      if (payload?.needsConfirmation) {
        setConfirmSent(true);
        return;
      }

      const destination = payload?.isAdmin && redirectTo === '/' ? '/admin/dashboard' : redirectTo;
      // Refresh so server components pick up the new session cookie.
      router.replace(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  if (confirmSent) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="rounded-2xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-8 shadow-xl text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-[#F5F0E6] border border-[#A08D6F]/50">
              <MailCheck className="w-8 h-8 text-[#8C9B7E]" />
            </div>
          </div>
          <h1 className="font-serif-museum text-2xl font-extrabold text-[#3F3A32]">
            Confirm Your Email
          </h1>
          <p className="font-serif-museum text-sm text-[#3F3A32]/85 leading-relaxed">
            We sent a confirmation link to <strong>{email}</strong>. Open it to activate your
            collector account, then sign in.
          </p>
          <Link
            href="/login"
            className="inline-block px-5 py-3 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-2xl bg-[#EDE0D4] border-2 border-[#A08D6F] shadow-xl overflow-hidden">
        <div className="bg-[#A08D6F] px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <span className="font-mono-tag text-[10px] uppercase font-bold tracking-widest text-[#F5F0E6]/80 block">
              {copy.kicker}
            </span>
            <h1 className="font-serif-museum text-xl font-extrabold text-[#F5F0E6]">
              {copy.heading}
            </h1>
          </div>
          <DrawerPull className="w-16 h-6 flex-shrink-0" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <p className="font-serif-museum text-sm text-[#3F3A32]/85 leading-relaxed">
            {copy.blurb}
          </p>

          <div>
            <label
              htmlFor="auth-email"
              className="block font-mono-tag text-[10px] font-bold text-[#A08D6F] mb-1 uppercase"
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2.5 text-sm font-serif-museum text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block font-mono-tag text-[10px] font-bold text-[#A08D6F] mb-1 uppercase"
            >
              Password {mode === 'signup' && <span className="normal-case">(min 8 characters)</span>}
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2.5 text-sm font-mono text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-serif-museum">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <KeyRound className="w-4 h-4" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            <span>{busy ? 'Working...' : copy.cta}</span>
          </button>

          <div className="text-center font-serif-museum text-xs text-[#3F3A32]/80 pt-2 border-t border-[#A08D6F]/40">
            {mode === 'login' ? (
              <>
                No collector account yet?{' '}
                <Link
                  href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                  className="font-bold text-[#3F3A32] underline decoration-[#A08D6F]"
                >
                  Register here
                </Link>
              </>
            ) : (
              <>
                Already catalogued?{' '}
                <Link
                  href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
                  className="font-bold text-[#3F3A32] underline decoration-[#A08D6F]"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
