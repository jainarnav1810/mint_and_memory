'use client';

import React, { useState } from 'react';
import type { CollectibleCategory, Listing } from '@/types/listing';
import { SpecimenDrawer } from './specimen-drawer';
import { DrawerPull } from './svg/drawer-pull';
import { Archive } from 'lucide-react';

export interface DrawerDefinition {
  number: string;
  title: string;
  category: CollectibleCategory;
}

const DRAWERS: DrawerDefinition[] = [
  { number: '01', title: 'Curated Stamps & Philately Specimen Tray', category: 'stamp' },
  { number: '02', title: 'Rare Numismatic Gold & Silver Coinage', category: 'coin' },
  { number: '03', title: 'Historic Paper Currency & Banknotes', category: 'currency' },
];

interface HomeArchiveProps {
  /** Active listings grouped by category, fetched on the server. */
  listingsByCategory: Record<CollectibleCategory, Listing[]>;
  counts: Record<CollectibleCategory, number>;
}

export const HomeArchive: React.FC<HomeArchiveProps> = ({ listingsByCategory, counts }) => {
  const [activeDrawerIdx, setActiveDrawerIdx] = useState(0);

  const currentDrawer = DRAWERS[activeDrawerIdx];
  const items = listingsByCategory[currentDrawer.category] ?? [];

  const nextDrawer = () => setActiveDrawerIdx((prev) => (prev + 1) % DRAWERS.length);
  const prevDrawer = () => setActiveDrawerIdx((prev) => (prev - 1 + DRAWERS.length) % DRAWERS.length);

  const totalSpecimens = counts.stamp + counts.coin + counts.currency;

  return (
    <div className="space-y-12 pb-16">
      <section className="relative pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b-2 border-[#A08D6F]/30 bg-[#F5F0E6]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded border border-[#A08D6F] bg-[#EDE0D4] text-[#3F3A32] font-mono-tag text-xs tracking-widest uppercase shadow-sm">
            <Archive className="w-3.5 h-3.5 text-[#A08D6F]" />
            Natural History &amp; Archival Collection
          </div>

          <h1 className="font-serif-museum text-4xl sm:text-6xl font-extrabold text-[#3F3A32] tracking-tight leading-tight">
            The Specimen Drawer <br />
            <span className="italic text-[#8A795D]">Philatelic &amp; Numismatic Archive</span>
          </h1>

          <p className="max-w-2xl mx-auto font-serif-museum text-base sm:text-lg text-[#3F3A32]/80 leading-relaxed font-normal">
            Each rare stamp, coin, and currency note sits preserved in a shallow specimen drawer,
            cataloged like an entomology tray or herbarium sheet with full provenance verification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {DRAWERS.map((drawer, idx) => (
              <button
                key={drawer.number}
                onClick={() => setActiveDrawerIdx(idx)}
                className={`px-4 py-2 rounded border font-mono-tag text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
                  activeDrawerIdx === idx
                    ? 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-md font-bold'
                    : 'bg-[#EDE0D4] text-[#3F3A32] border-[#A08D6F]/50 hover:bg-[#D8DCC8]'
                }`}
              >
                <DrawerPull className="w-8 h-3.5" label={drawer.number} />
                <span>{drawer.category.toUpperCase()} DRAWER</span>
              </button>
            ))}
          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center border-t border-[#A08D6F]/30 font-mono-tag text-xs">
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">{counts.stamp}</span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Herbarium Stamps</span>
            </div>
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">{counts.coin}</span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Numismatic Coins</span>
            </div>
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">{counts.currency}</span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Paper Currency</span>
            </div>
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">
                {totalSpecimens > 0 ? '100%' : '—'}
              </span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Museum Verified</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SpecimenDrawer
          drawerNumber={currentDrawer.number}
          drawerTitle={currentDrawer.title}
          items={items}
          onNextDrawer={nextDrawer}
          onPrevDrawer={prevDrawer}
        />
      </section>
    </div>
  );
};
