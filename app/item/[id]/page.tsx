import React, { useState } from 'react';
import { AuctionTimer } from '@components/auction-timer';
import { BidForm } from '@components/bid-form';
import { Listing } from '@types/listing';
import { ArrowLeft, Award, Calendar, CheckCircle2, Globe, ShieldCheck, Tag, Zap } from 'lucide-react';

const MOCK_ITEMS: Record<string, Listing> = {
  'ceylon-king-george': {
    id: 'ceylon-king-george',
    title: 'Ceylon King George V 15-Cents Stamp',
    description:
      'Extremely crisp 1921 King George V definitive stamp from Ceylon (modern Sri Lanka). Deep cobalt blue printing on woven paper with watermark intact. Preserved in original collector hinge.',
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
    images: [
      { id: '1', listing_id: 'ceylon-king-george', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true },
      { id: '2', listing_id: 'ceylon-king-george', storage_path: '/world-archive.jpg', display_order: 1, is_primary: false },
    ],
  },
  'tanganyika-note': {
    id: 'tanganyika-note',
    title: 'Tanganyika 5 Shillings Banknote',
    description:
      'Historic 1961 East African Currency Board banknote issued in Dar es Salaam during the brief transition period between British colonial rule and the formation of Tanzania.',
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
    images: [
      { id: '3', listing_id: 'tanganyika-note', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true },
      { id: '4', listing_id: 'tanganyika-note', storage_path: '/archive-desk.jpg', display_order: 1, is_primary: false },
    ],
  },
  'japan-fuji': {
    id: 'japan-fuji',
    title: 'Japan Mount Fuji 24 Yen Airmail Stamp',
    description:
      'Vibrant 1952 postwar Japanese airmail stamp depicting Mount Fuji shrouded in early morning mist over Tokyo bay.',
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
    images: [{ id: '5', listing_id: 'japan-fuji', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
  'uk-sovereign-1889': {
    id: 'uk-sovereign-1889',
    title: 'British Sovereign Gold Coin 1889',
    description:
      'Stunning 1889 British Gold Sovereign minted in London under Queen Victoria’s Jubilee reign. 22-carat gold coin featuring St George slaying the dragon on the reverse.',
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
    images: [{ id: '6', listing_id: 'uk-sovereign-1889', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
};

export default function ItemDetailPage({
  id = 'ceylon-king-george',
  onNavigate,
}: {
  id?: string;
  onNavigate?: (path: string) => void;
}) {
  const item = MOCK_ITEMS[id] || MOCK_ITEMS['ceylon-king-george'];
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [buying, setBuying] = useState(false);

  const images = item.images && item.images.length > 0
    ? item.images.map((img) => img.storage_path)
    : ['/archive-desk.jpg', '/world-archive.jpg'];

  const isAuction = item.listing_type === 'auction';

  const handleCheckout = async () => {
    setBuying(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: item.id,
          shipping_address: {
            fullName: 'Collector Buyer',
            addressLine1: '123 Heritage Lane',
            city: 'London',
            state: 'Greater London',
            postalCode: 'EC1A 1BB',
            country: 'United Kingdom',
          },
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBuying(false);
    }
  };

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => handleNav('/browse')}
        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl">
            <img
              src={images[selectedImgIndex]}
              alt={item.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                {item.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900/80 text-zinc-300 border border-zinc-700 backdrop-blur-md">
                {item.country_of_origin}
              </span>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImgIndex === idx ? 'border-amber-500 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4 backdrop-blur-md">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Item Specifications & Provenance</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block">Country of Origin</span>
                <span className="font-semibold text-zinc-200">{item.country_of_origin}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block">Year Issued</span>
                <span className="font-semibold text-zinc-200">{item.year_issued || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block">Grade & Condition</span>
                <span className="font-semibold text-amber-300">{item.condition}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block">Face Denomination</span>
                <span className="font-semibold text-zinc-200">{item.denomination}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block">Listing Format</span>
                <span className="font-semibold text-zinc-200 capitalize">{item.listing_type}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="text-zinc-500 block">Verification</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-100 leading-tight">{item.title}</h1>
            <p className="text-xs text-zinc-400 font-light mt-3 leading-relaxed">{item.description}</p>
          </div>

          {isAuction && item.auction_end && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
              <AuctionTimer endTime={item.auction_end} />
            </div>
          )}

          {isAuction ? (
            <BidForm listing={item} />
          ) : (
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-5 shadow-xl">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-zinc-500 block">Fixed Buy Price</span>
                <div className="text-3xl font-bold font-mono text-amber-400 mt-1">
                  ${(item.fixed_price || 0).toFixed(2)}{' '}
                  <span className="text-sm font-normal text-zinc-500">{item.currency}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={buying}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{buying ? 'Redirecting to Checkout...' : 'Buy Now with Stripe'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Immediate dispatch upon successful payment</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
