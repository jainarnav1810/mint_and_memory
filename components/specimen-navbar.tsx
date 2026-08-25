'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { DrawerPull } from './svg/drawer-pull';
import { Archive, Gavel, Layers, LogIn, LogOut, PlusCircle, ShieldCheck } from 'lucide-react';

interface SpecimenNavbarProps {
  /** Signed-in user's email, or null when browsing anonymously. */
  userEmail?: string | null;
  isAdmin?: boolean;
}

const TRAYS = [
  { category: 'stamp', label: 'Stamps Tray', pull: '01' },
  { category: 'coin', label: 'Coins Tray', pull: '02' },
  { category: 'currency', label: 'Banknotes Tray', pull: '03' },
] as const;

const ACTIVE_TRAY = 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-sm font-bold';
const IDLE_TRAY = 'bg-[#EDE0D4]/60 text-[#3F3A32] border-[#A08D6F]/40 hover:bg-[#D8DCC8]';

export const SpecimenNavbar: React.FC<SpecimenNavbarProps> = ({ userEmail, isAdmin = false }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onBrowse = pathname === '/browse';
  const activeCategory = onBrowse ? searchParams.get('category') : null;
  const activeType = onBrowse ? searchParams.get('type') : null;
  const catalogActive = onBrowse && !activeCategory && !activeType;

  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E6]/95 backdrop-blur-md border-b-2 border-[#A08D6F]/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-20">
          {/* Museum archive title */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
            <div className="p-2 rounded border border-[#A08D6F] bg-[#EDE0D4] shadow-sm group-hover:bg-[#C7B79C]/20 transition-colors">
              <Archive className="w-5 h-5 text-[#3F3A32]" />
            </div>
            <div>
              <span className="font-serif-museum text-xl font-bold tracking-tight text-[#3F3A32] block leading-none">
                Mint &amp; Memory
              </span>
              <span className="font-mono-tag text-[9px] text-[#A08D6F] uppercase tracking-widest block mt-1">
                Specimen Drawer Archive · Vol. IV
              </span>
            </div>
          </Link>

          {/* Drawer navigation handles */}
          <nav className="hidden lg:flex items-center gap-2">
            <Link
              href="/browse"
              className={`px-3 py-1.5 rounded border text-xs font-mono-tag tracking-wider uppercase transition-all flex items-center gap-2 ${
                catalogActive ? ACTIVE_TRAY : IDLE_TRAY
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Catalog</span>
            </Link>

            {TRAYS.map((tray) => (
              <Link
                key={tray.category}
                href={`/browse?category=${tray.category}`}
                className={`px-3 py-1.5 rounded border text-xs font-mono-tag tracking-wider uppercase transition-all flex items-center gap-2 ${
                  activeCategory === tray.category ? ACTIVE_TRAY : IDLE_TRAY
                }`}
              >
                <DrawerPull className="w-10 h-4" label={tray.pull} />
                <span>{tray.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auctions, admin, auth */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/browse?type=auction"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono-tag text-xs tracking-wider uppercase transition-all shadow-sm ${
                activeType === 'auction'
                  ? 'border-[#3F3A32] bg-[#8C9B7E] text-[#F5F0E6] font-bold'
                  : 'border-[#8C9B7E] bg-[#D8DCC8] hover:bg-[#c9cfb7] text-[#3F3A32]'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Bids</span>
            </Link>

            {isAdmin && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#A08D6F] bg-[#EDE0D4] hover:bg-[#D8DCC8] text-[#3F3A32] font-mono-tag text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Curator</span>
                </Link>

                <Link
                  href="/admin/listings/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#3F3A32] bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag text-xs tracking-wider uppercase font-semibold transition-all shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add Specimen</span>
                </Link>
              </>
            )}

            {userEmail ? (
              <form action="/auth/signout" method="post" className="flex items-center gap-2">
                <span
                  className="hidden xl:block font-mono-tag text-[10px] text-[#A08D6F] uppercase tracking-wider max-w-[10rem] truncate"
                  title={userEmail}
                >
                  {userEmail}
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#A08D6F] bg-[#EDE0D4] hover:bg-[#D8DCC8] text-[#3F3A32] font-mono-tag text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#3F3A32] bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag text-xs tracking-wider uppercase font-semibold transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
