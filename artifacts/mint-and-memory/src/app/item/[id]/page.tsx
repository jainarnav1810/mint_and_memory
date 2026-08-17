import React, { useState, useEffect } from 'react';
import { AuctionTimer } from '@/components/auction-timer';
import { BidForm } from '@/components/bid-form';
import { SpecimenTag } from '@/components/svg/specimen-tag';
import { HingeCorner } from '@/components/svg/hinge-corner';
import { Listing } from '@/types/listing';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const MOCK_ITEMS: Record<string, Listing> = {
  'e2b4f96d-7c2d-4f1e-9a1b-8c5d2e3f4a1b': {
    id: 'e2b4f96d-7c2d-4f1e-9a1b-8c5d2e3f4a1b',
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
      { id: '1', listing_id: 'e2b4f96d-7c2d-4f1e-9a1b-8c5d2e3f4a1b', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true },
      { id: '2', listing_id: 'e2b4f96d-7c2d-4f1e-9a1b-8c5d2e3f4a1b', storage_path: '/world-archive.jpg', display_order: 1, is_primary: false },
    ],
  },
  'a1c3e5e7-8b4d-6f2e-0c1d-9e3f5a7b9c1d': {
    id: 'a1c3e5e7-8b4d-6f2e-0c1d-9e3f5a7b9c1d',
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
      { id: '3', listing_id: 'a1c3e5e7-8b4d-6f2e-0c1d-9e3f5a7b9c1d', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true },
      { id: '4', listing_id: 'a1c3e5e7-8b4d-6f2e-0c1d-9e3f5a7b9c1d', storage_path: '/archive-desk.jpg', display_order: 1, is_primary: false },
    ],
  },
  'f9d8c7b6-5a4e-3f2d-1c0b-9a8b7c6d5e4f': {
    id: 'f9d8c7b6-5a4e-3f2d-1c0b-9a8b7c6d5e4f',
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
    images: [{ id: '5', listing_id: 'f9d8c7b6-5a4e-3f2d-1c0b-9a8b7c6d5e4f', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
  'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b': {
    id: 'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b',
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
    images: [{ id: '6', listing_id: 'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
  // Alias map for legacy route params
  'ceylon-king-george': {
    id: 'e2b4f96d-7c2d-4f1e-9a1b-8c5d2e3f4a1b',
    title: 'Ceylon King George V 15-Cents Stamp',
    description: 'Extremely crisp 1921 King George V definitive stamp from Ceylon (modern Sri Lanka).',
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
  'uk-sovereign-1889': {
    id: 'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b',
    title: 'British Sovereign Gold Coin 1889',
    description: 'Stunning 1889 British Gold Sovereign minted in London under Queen Victoria’s Jubilee reign.',
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
    images: [{ id: '6', listing_id: 'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
};

export default function ItemDetailPage({
  id = 'c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b',
  onNavigate,
}: {
  id?: string;
  onNavigate?: (path: string) => void;
}) {
  const [item, setItem] = useState<Listing>(() => MOCK_ITEMS[id] || MOCK_ITEMS['c3b2a1f0-9e8d-7c6b-5a4f-3e2d1c0b9a8b']);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [buying, setBuying] = useState(false);

  // Fetch live item details from Supabase if valid UUID
  useEffect(() => {
    async function loadItem() {
      if (id && id.length > 20) {
        try {
          const { data, error } = await supabase
            .from('listings')
            .select('*, listing_images(*)')
            .eq('id', id)
            .single();

          if (!error && data) {
            setItem({
              ...data,
              images: data.listing_images || [],
            });
          }
        } catch (err) {
          console.warn('Using local fallback item:', err);
        }
      }
    }
    loadItem();
  }, [id]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const images = item.images && item.images.length > 0
    ? item.images.map((img) => img.storage_path)
    : ['/archive-desk.jpg', '/world-archive.jpg'];

  const isAuction = item.listing_type === 'auction';

  const handleRazorpayCheckout = async () => {
    setBuying(true);
    try {
      let orderData: any = { isMock: true };
      try {
        const response = await fetch('/api/checkout/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listing_id: item.id,
            shipping_address: {
              fullName: 'Collector Buyer',
              addressLine1: '123 Heritage Lane',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400001',
              country: 'India',
            },
          }),
        });
        const text = await response.text();
        if (text) {
          orderData = JSON.parse(text);
        }
      } catch (err) {
        console.warn('API endpoint unavailable, using mock checkout mode:', err);
      }

      if (orderData.isMock || !orderData.keyId) {
        if (onNavigate) onNavigate('/checkout');
        else window.location.href = '/checkout';
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Mint & Memory Specimen Archive',
        description: item.title,
        order_id: orderData.orderId,
        handler: function (res: any) {
          if (onNavigate) onNavigate(`/checkout?payment_id=${res.razorpay_payment_id}`);
          else window.location.href = `/checkout?payment_id=${res.razorpay_payment_id}`;
        },
        prefill: {
          name: 'Collector Buyer',
          email: 'buyer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#A08D6F',
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error(err);
      if (onNavigate) onNavigate('/checkout');
    } finally {
      setBuying(false);
    }
  };

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  const countryCode = (item.country_of_origin || 'GLO').slice(0, 3).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => handleNav('/browse')}
        className="inline-flex items-center gap-2 text-xs font-mono-tag font-bold text-[#A08D6F] hover:text-[#3F3A32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Specimen Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-lg bg-[#EDE0D4] border-2 border-[#A08D6F] overflow-hidden p-3 shadow-xl">
            <HingeCorner position="top-left" />
            <HingeCorner position="top-right" />
            <HingeCorner position="bottom-left" />
            <HingeCorner position="bottom-right" />

            <img
              src={images[selectedImgIndex]}
              alt={item.title}
              className="w-full h-full object-cover rounded border border-[#A08D6F]/40"
            />

            <div className="absolute top-5 left-5">
              <SpecimenTag
                countryCode={countryCode}
                year={item.year_issued || 'CIRC'}
                catalogNo={item.id.slice(0, 4).toUpperCase()}
                type={item.listing_type}
              />
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative aspect-square w-20 rounded border-2 transition-all ${
                    selectedImgIndex === idx ? 'border-[#3F3A32] scale-105 shadow-md' : 'border-[#A08D6F]/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          )}

          <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-4 shadow-md">
            <h3 className="font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider">
              Specimen Specifications &amp; Provenance Notes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-serif-museum">
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <span className="font-mono-tag text-[10px] text-[#A08D6F] block uppercase">Country of Origin</span>
                <span className="font-bold text-[#3F3A32]">{item.country_of_origin}</span>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <span className="font-mono-tag text-[10px] text-[#A08D6F] block uppercase">Year Issued</span>
                <span className="font-bold text-[#3F3A32]">{item.year_issued || 'N/A'}</span>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <span className="font-mono-tag text-[10px] text-[#A08D6F] block uppercase">Grade &amp; Condition</span>
                <span className="font-bold text-[#3F3A32]">{item.condition}</span>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <span className="font-mono-tag text-[10px] text-[#A08D6F] block uppercase">Face Denomination</span>
                <span className="font-bold text-[#3F3A32]">{item.denomination}</span>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <span className="font-mono-tag text-[10px] text-[#A08D6F] block uppercase">Sale Mechanism</span>
                <span className="font-bold text-[#3F3A32] capitalize">{item.listing_type}</span>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <span className="font-mono-tag text-[10px] text-[#A08D6F] block uppercase">Verification</span>
                <span className="font-bold text-[#3F3A32] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8C9B7E]" /> Museum Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="font-serif-museum text-3xl font-extrabold text-[#3F3A32] leading-tight">{item.title}</h1>
            <p className="font-serif-museum text-sm text-[#3F3A32]/85 mt-3 leading-relaxed">{item.description}</p>
          </div>

          {isAuction && item.auction_end && (
            <div className="p-4 rounded-xl bg-[#D8DCC8] border border-[#8C9B7E]">
              <AuctionTimer endTime={item.auction_end} />
            </div>
          )}

          {isAuction ? (
            <BidForm listing={item} onBidSubmitted={(amt) => setItem((prev) => ({ ...prev, current_highest_bid: amt }))} />
          ) : (
            <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-5 shadow-lg">
              <div>
                <span className="font-mono-tag text-xs uppercase font-bold tracking-wider text-[#A08D6F] block">
                  Fixed Acquisition Price
                </span>
                <div className="text-3xl font-bold font-mono text-[#3F3A32] mt-1">
                  ${(item.fixed_price || 0).toFixed(2)}{' '}
                  <span className="text-sm font-normal text-[#A08D6F]">{item.currency}</span>
                </div>
              </div>

              <button
                onClick={handleRazorpayCheckout}
                disabled={buying}
                className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{buying ? 'Opening Razorpay...' : 'Acquire Specimen via Razorpay'}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-serif-museum text-[#3F3A32]/80 pt-1">
                <CheckCircle2 className="w-4 h-4 text-[#8C9B7E]" />
                <span>Supports International Cards, UPI, Netbanking &amp; Cards</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
