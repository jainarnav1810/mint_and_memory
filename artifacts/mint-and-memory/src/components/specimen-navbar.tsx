import React from 'react';
import { DrawerPull } from './svg/drawer-pull';
import { Archive, Gavel, Layers, PlusCircle, ShieldCheck } from 'lucide-react';

interface SpecimenNavbarProps {
  activeDrawer?: string;
  onNavigate: (path: string) => void;
}

export const SpecimenNavbar: React.FC<SpecimenNavbarProps> = ({ activeDrawer = 'all', onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E6]/95 backdrop-blur-md border-b-2 border-[#A08D6F]/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Museum Archive Title */}
          <div
            onClick={() => onNavigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
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
          </div>

          {/* Drawer Navigation Handles */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onNavigate('/browse')}
              className={`px-3 py-1.5 rounded border text-xs font-mono-tag tracking-wider uppercase transition-all flex items-center gap-2 ${
                activeDrawer === 'all'
                  ? 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-sm font-bold'
                  : 'bg-[#EDE0D4]/60 text-[#3F3A32] border-[#A08D6F]/40 hover:bg-[#D8DCC8]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Full Catalog</span>
            </button>

            <button
              onClick={() => onNavigate('/browse?category=stamp')}
              className={`px-3 py-1.5 rounded border text-xs font-mono-tag tracking-wider uppercase transition-all flex items-center gap-2 ${
                activeDrawer === 'stamps'
                  ? 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-sm font-bold'
                  : 'bg-[#EDE0D4]/60 text-[#3F3A32] border-[#A08D6F]/40 hover:bg-[#D8DCC8]'
              }`}
            >
              <DrawerPull className="w-10 h-4" label="01" />
              <span>Stamps Tray</span>
            </button>

            <button
              onClick={() => onNavigate('/browse?category=coin')}
              className={`px-3 py-1.5 rounded border text-xs font-mono-tag tracking-wider uppercase transition-all flex items-center gap-2 ${
                activeDrawer === 'coins'
                  ? 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-sm font-bold'
                  : 'bg-[#EDE0D4]/60 text-[#3F3A32] border-[#A08D6F]/40 hover:bg-[#D8DCC8]'
              }`}
            >
              <DrawerPull className="w-10 h-4" label="02" />
              <span>Coins Tray</span>
            </button>

            <button
              onClick={() => onNavigate('/browse?category=currency')}
              className={`px-3 py-1.5 rounded border text-xs font-mono-tag tracking-wider uppercase transition-all flex items-center gap-2 ${
                activeDrawer === 'currency'
                  ? 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-sm font-bold'
                  : 'bg-[#EDE0D4]/60 text-[#3F3A32] border-[#A08D6F]/40 hover:bg-[#D8DCC8]'
              }`}
            >
              <DrawerPull className="w-10 h-4" label="03" />
              <span>Banknotes Tray</span>
            </button>
          </nav>

          {/* Admin & Live Auction Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/browse?type=auction')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#8C9B7E] bg-[#D8DCC8] hover:bg-[#c9cfb7] text-[#3F3A32] font-mono-tag text-xs tracking-wider uppercase transition-all shadow-sm"
            >
              <Gavel className="w-3.5 h-3.5 text-[#3F3A32]" />
              <span>Live Bids</span>
            </button>

            <button
              onClick={() => onNavigate('/admin/listings/new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#3F3A32] bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag text-xs tracking-wider uppercase font-semibold transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Specimen</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
