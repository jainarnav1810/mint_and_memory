import React from 'react';
import { ArrowRight, Award, Compass, Flame, Globe, Gavel, ShieldCheck, Sparkles } from 'lucide-react';
import { ListingCard } from '@components/listing-card';
import { Listing } from '@types/listing';

const FEATURED_ITEMS: Listing[] = [
  {
    id: 'ceylon-king-george',
    title: 'Ceylon King George V 15-Cents Stamp',
    description: 'Crisp 1921 King George V definitive issue from Ceylon with deep cobalt blue ink on watermarked paper.',
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
    images: [{ id: '1', listing_id: 'ceylon-king-george', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'tanganyika-note',
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
    images: [{ id: '2', listing_id: 'tanganyika-note', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'uk-sovereign-1889',
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
    images: [{ id: '4', listing_id: 'uk-sovereign-1889', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'japan-fuji',
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
    images: [{ id: '3', listing_id: 'japan-fuji', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
];

export default function HomePage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950 pointer-events-none" />
        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Curated Global Philatelic & Numismatic Collection
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-100 tracking-tight leading-tight">
            Discover & Acquire Rare <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
              Stamps, Coins & Currency
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
            A premier global marketplace for philatelists and coin collectors. Place competitive live auction bids on rare historical artifacts or acquire fixed-price pieces instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleNav('/browse')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNav('/browse?type=auction')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold text-sm transition-all"
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>View Live Auctions</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center border-t border-zinc-800/80">
            <div>
              <span className="text-2xl font-bold text-amber-400 font-mono">1,280+</span>
              <span className="block text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Rare Stamps</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-amber-400 font-mono">420+</span>
              <span className="block text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Historic Coins</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-amber-400 font-mono">310+</span>
              <span className="block text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Banknotes</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-amber-400 font-mono">100%</span>
              <span className="block text-xs text-zinc-500 uppercase tracking-wider mt-0.5">Verified Origin</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-400 block">Featured Collectibles</span>
            <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              Active Auctions & Prime Listings
            </h2>
          </div>

          <button
            onClick={() => handleNav('/browse')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View All (1,700+)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_ITEMS.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onSelect={(l) => handleNav(`/item/${l.id}`)}
              onQuickBid={(l) => handleNav(`/item/${l.id}`)}
              onQuickBuy={(l) => handleNav(`/item/${l.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Worldwide Tracked Dispatch</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Full international shipping with insured postal coverage for precious coins, banknotes, and stamps.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Authenticity Guarantee</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Every item is verified by expert numismatists and philatelists with provenance notes attached.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-100">Protected Bidding & Checkout</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Powered by Stripe. Auction winners pay only upon final close verification.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
