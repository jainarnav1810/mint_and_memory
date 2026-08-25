'use client';

import React, { useState } from 'react';
import type { Listing } from '@/types/listing';
import { SpecimenCard } from './specimen-card';
import { DrawerPull } from './svg/drawer-pull';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface SpecimenDrawerProps {
  drawerNumber: string;
  drawerTitle: string;
  items: Listing[];
  onNextDrawer?: () => void;
  onPrevDrawer?: () => void;
}

export const SpecimenDrawer: React.FC<SpecimenDrawerProps> = ({
  drawerNumber,
  drawerTitle,
  items,
  onNextDrawer,
  onPrevDrawer,
}) => {
  const [isSliding, setIsSliding] = useState(false);

  // Let the tray slide out before swapping its contents, then slide back in.
  const handleSlide = (action: () => void) => {
    setIsSliding(true);
    setTimeout(() => {
      action();
      setIsSliding(false);
    }, 250);
  };

  return (
    <section className="relative rounded-2xl bg-[#A08D6F]/20 border-4 border-[#A08D6F] p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#A08D6F]">
        <div className="flex items-center gap-3">
          <DrawerPull className="w-24 h-8" isSliding={isSliding} label={`DRAWER ${drawerNumber}`} />
          <div>
            <span className="font-mono-tag text-[10px] uppercase font-bold tracking-widest text-[#A08D6F] block">
              SPECIMEN TRAY NO. {drawerNumber}
            </span>
            <h2 className="font-serif-museum text-2xl font-extrabold text-[#3F3A32]">{drawerTitle}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onPrevDrawer && (
            <button
              onClick={() => handleSlide(onPrevDrawer)}
              className="p-2 rounded border border-[#A08D6F] bg-[#EDE0D4] hover:bg-[#D8DCC8] text-[#3F3A32] transition-colors"
              title="Previous Specimen Drawer"
              aria-label="Previous specimen drawer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div className="px-3 py-1 rounded bg-[#EDE0D4] border border-[#A08D6F] font-mono-tag text-xs text-[#3F3A32]">
            {items.length} SPECIMENS
          </div>

          {onNextDrawer && (
            <button
              onClick={() => handleSlide(onNextDrawer)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded border border-[#3F3A32] bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag text-xs tracking-wider uppercase font-semibold transition-all shadow-sm"
            >
              <span>Pull Next Drawer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-300 transform ${
          isSliding ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        {items.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-[#A08D6F]/40 p-12 text-center bg-[#F5F0E6]">
            <Layers className="w-8 h-8 text-[#A08D6F] mx-auto mb-2" />
            <p className="font-serif-museum text-sm text-[#3F3A32]/70">
              This specimen drawer is currently empty.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <SpecimenCard key={item.id} listing={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
