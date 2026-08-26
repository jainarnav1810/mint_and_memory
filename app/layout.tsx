import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';
import { SpecimenNavbar } from '@/components/specimen-navbar';
import { getSessionContext } from '@/lib/supabase/server';
import './globals.css';

/**
 * This layout reads the auth cookie on every request, so no route beneath it can
 * ever be statically generated. Saying so up front stops Next from attempting a
 * static render pass and then discarding it.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mint & Memory — The Specimen Drawer Archive',
  description:
    'Curated museum-grade archive of global stamps, coins, and paper currency specimens.',
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Mint & Memory — Specimen Drawer Archive',
    description: 'Museum-grade philatelic & numismatic collection.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const FOOTER_TRAYS = [
  { href: '/browse?category=stamp', label: 'Stamps' },
  { href: '/browse?category=coin', label: 'Coins' },
  { href: '/browse?category=currency', label: 'Banknotes' },
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read once per request and hand down, so the navbar stays a cheap client component.
  let userEmail: string | null = null;
  let isAdmin = false;

  try {
    const session = await getSessionContext();
    userEmail = session.user?.email ?? null;
    isAdmin = session.isAdmin;
  } catch (err) {
    // Next signals control flow (dynamic rendering, redirects, notFound) by
    // throwing. Swallowing those would fight the framework, so hand them back.
    unstable_rethrow(err);
    // A genuine failure — usually Supabase not configured yet. Render the site
    // anonymously rather than 500 the whole app.
    console.error('[layout] could not resolve session:', err);
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F5F0E6] text-[#3F3A32] antialiased">
        <div className="min-h-screen bg-[#F5F0E6] text-[#3F3A32] font-serif-museum selection:bg-[#C7B79C] selection:text-[#3F3A32] flex flex-col">
          {/* Suspense: the navbar reads search params to highlight the active tray. */}
          <Suspense fallback={<div className="h-20 border-b-2 border-[#A08D6F]/40 bg-[#F5F0E6]" />}>
            <SpecimenNavbar userEmail={userEmail} isAdmin={isAdmin} />
          </Suspense>

          <main className="flex-1">{children}</main>

          <footer className="border-t-2 border-[#A08D6F]/40 bg-[#EDE0D4]/80 py-8 px-4 text-center font-mono-tag text-xs text-[#3F3A32]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-semibold text-[#3F3A32]">
                © {new Date().getFullYear()} Mint &amp; Memory — The Specimen Drawer Archive.
              </span>
              <div className="flex gap-4 text-[#A08D6F] uppercase">
                {FOOTER_TRAYS.map((tray) => (
                  <Link key={tray.href} href={tray.href} className="hover:text-[#3F3A32]">
                    {tray.label}
                  </Link>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
