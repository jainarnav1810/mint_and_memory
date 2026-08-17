import React, { useState } from 'react';
import { SpecimenDrawer } from '@/components/specimen-drawer';
import { DrawerPull } from '@/components/svg/drawer-pull';
import { Listing } from '@/types/listing';
import { Archive } from 'lucide-react';

const SPECIMEN_COLLECTION: Listing[] = [
  {
    id: 'e2b4f96d-7c2d-4f1e-9a1b-8c5d2e3f4a1b',
    title: 'Ceylon King George V 15-Cents Stamp',
    description: 'Crisp 1921 King George V definitive issue from Ceylon with deep cobalt blue ink on watermarked wove paper.',
    category: 'stamp',
    country_of_origin: 'Ceylon',
    year_issued: 1921,
    condition: 'Extremely Fine',
    denomination: '15 Cents',
    listing_type: 'auction',
    starting_bid: 75.0,
    current_highest_bid: 95.0,
    reserve_price: 120.0,
    currency: 'USD',
    auction_start: new Date(Date.now() - 86400000 * 2).toISOString(),
    auction_end: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '1', listing_id: 'e2b4f96d-7c2d-4f1e-9a1b-8c5d2e3f4a1b', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'a1c3e5e7-8b4d-6f2e-0c1d-9e3f5a7b9c1d',
    title: 'Tanganyika 5 Shillings Banknote',
    description: 'Rare 1961 East African Currency Board banknote issued in Dar es Salaam during independence transition.',
    category: 'currency',
    country_of_origin: 'Tanganyika',
    year_issued: 1961,
    condition: 'Uncirculated',
    denomination: '5 Shillings',
    listing_type: 'auction',
    starting_bid: 45.0,
    current_highest_bid: 58.0,
    reserve_price: 60.0,
    currency: 'USD',
    auction_start: new Date(Date.now() - 86400000).toISOString(),
    auction_end: new Date(Date.now() + 3600000 * 8).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '2', listing_id: 'a1c3e5e7-8b4d-6f2e-0c1d-9e3f5a7b9c1d', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b',
    title: 'British Gold Sovereign Coin 1889',
    description: 'Queen Victoria Jubilee Head mint edition 22-carat gold sovereign coin minted in London.',
    category: 'coin',
    country_of_origin: 'United Kingdom',
    year_issued: 1889,
    condition: 'Proof',
    denomination: '1 Sovereign',
    listing_type: 'auction',
    starting_bid: 520.0,
    current_highest_bid: 580.0,
    reserve_price: 650.0,
    currency: 'USD',
    auction_start: new Date(Date.now() - 86400000 * 3).toISOString(),
    auction_end: new Date(Date.now() + 86400000 * 1).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '4', listing_id: 'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'f9d8c7b6-5a4e-3f2d-1c0b-9a8b7c6d5e4f',
    title: 'Japan Mount Fuji 24 Yen Airmail Stamp',
    description: 'Postwar airmail stamp depicting Mount Fuji over Tokyo bay in unhinged mint condition.',
    category: 'stamp',
    country_of_origin: 'Japan',
    year_issued: 1952,
    condition: 'Mint',
    denomination: '24 Yen',
    listing_type: 'fixed',
    fixed_price: 42.0,
    currency: 'USD',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '3', listing_id: 'f9d8c7b6-5a4e-3f2d-1c0b-9a8b7c6d5e4f', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
];

export default function HomePage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [activeDrawerIdx, setActiveDrawerIdx] = useState(0);

  const drawers = [
    { number: '01', title: 'Curated Stamps & Philately Specimen Tray', category: 'stamp' },
    { number: '02', title: 'Rare Numismatic Gold & Silver Coinage', category: 'coin' },
    { number: '03', title: 'Historic Paper Currency & Banknotes', category: 'currency' },
  ];

  const currentDrawer = drawers[activeDrawerIdx];
  const filteredItems = SPECIMEN_COLLECTION.filter(
    (item) => item.category === currentDrawer.category
  );
  const itemsToDisplay = filteredItems.length > 0 ? filteredItems : SPECIMEN_COLLECTION;

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  const handleNextDrawer = () => {
    setActiveDrawerIdx((prev) => (prev + 1) % drawers.length);
  };

  const handlePrevDrawer = () => {
    setActiveDrawerIdx((prev) => (prev - 1 + drawers.length) % drawers.length);
  };

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
            <span className="italic text-[#8A795D]">
              Philatelic &amp; Numismatic Archive
            </span>
          </h1>

          <p className="max-w-2xl mx-auto font-serif-museum text-base sm:text-lg text-[#3F3A32]/80 leading-relaxed font-normal">
            Each rare stamp, coin, and currency note sits preserved in a shallow specimen drawer, cataloged like an entomology tray or herbarium sheet with full provenance verification.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {drawers.map((d, idx) => (
              <button
                key={d.number}
                onClick={() => setActiveDrawerIdx(idx)}
                className={`px-4 py-2 rounded border font-mono-tag text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
                  activeDrawerIdx === idx
                    ? 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-md font-bold'
                    : 'bg-[#EDE0D4] text-[#3F3A32] border-[#A08D6F]/50 hover:bg-[#D8DCC8]'
                }`}
              >
                <DrawerPull className="w-8 h-3.5" label={d.number} />
                <span>{d.category.toUpperCase()} DRAWER</span>
              </button>
            ))}
          </div>

          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center border-t border-[#A08D6F]/30 font-mono-tag text-xs">
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">1,280+</span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Herbarium Stamps</span>
            </div>
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">420+</span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Numismatic Coins</span>
            </div>
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">310+</span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Paper Currency</span>
            </div>
            <div className="p-2 rounded bg-[#EDE0D4]/50 border border-[#A08D6F]/30">
              <span className="text-xl font-bold text-[#3F3A32] block">100%</span>
              <span className="text-[10px] text-[#A08D6F] uppercase">Museum Verified</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SpecimenDrawer
          drawerNumber={currentDrawer.number}
          drawerTitle={currentDrawer.title}
          items={itemsToDisplay}
          onSelectListing={(l) => handleNav(`/item/${l.id}`)}
          onNextDrawer={handleNextDrawer}
          onPrevDrawer={handlePrevDrawer}
        />
      </section>
    </div>
  );
}
