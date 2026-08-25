'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle2, Gavel, PlusCircle, Tag } from 'lucide-react';

import { ImageUploader } from '@/components/image-uploader';
import type { CollectibleCategory, ItemCondition, ListingType } from '@/types/listing';

const CONDITIONS: ItemCondition[] = [
  'Mint',
  'Uncirculated',
  'Extremely Fine',
  'Proof',
  'Fine',
  'Used',
];

export const NewListingForm: React.FC = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CollectibleCategory>('stamp');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [yearIssued, setYearIssued] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Extremely Fine');
  const [denomination, setDenomination] = useState('');
  const [listingType, setListingType] = useState<ListingType>('auction');
  const [fixedPrice, setFixedPrice] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [auctionDays, setAuctionDays] = useState('7');
  const [images, setImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [published, setPublished] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        category,
        country_of_origin: countryOfOrigin,
        year_issued: yearIssued ? parseInt(yearIssued, 10) : null,
        condition,
        denomination: denomination || null,
        listing_type: listingType,
        fixed_price: listingType === 'fixed' && fixedPrice ? parseFloat(fixedPrice) : null,
        starting_bid: listingType === 'auction' && startingBid ? parseFloat(startingBid) : null,
        reserve_price: listingType === 'auction' && reservePrice ? parseFloat(reservePrice) : null,
        auction_duration_days:
          listingType === 'auction' ? parseInt(auctionDays, 10) || undefined : undefined,
        images,
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      // The original form reported success unconditionally — a failed insert
      // looked identical to a published specimen.
      if (!response.ok) {
        setError(result?.error ?? `Publishing failed (${response.status})`);
        return;
      }

      setPublished(true);
      router.push(result?.listing?.id ? `/item/${result.listing.id}` : '/browse');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publishing failed');
    } finally {
      setLoading(false);
    }
  };

  const labelClass =
    'block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1';
  const inputClass =
    'w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2.5 text-sm text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none transition-colors';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-serif-museum">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-xs font-mono-tag font-bold text-[#A08D6F] hover:text-[#3F3A32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Admin Dashboard</span>
      </Link>

      <div className="pb-4 border-b-2 border-[#A08D6F]">
        <span className="font-mono-tag text-xs uppercase font-bold tracking-widest text-[#A08D6F] block">
          Museum Cataloging Form
        </span>
        <h1 className="text-3xl font-extrabold text-[#3F3A32] flex items-center gap-2 mt-1">
          <PlusCircle className="w-6 h-6 text-[#A08D6F]" />
          Create New Specimen Entry
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 sm:p-8 space-y-6 shadow-lg"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="listing-title" className={labelClass}>
              Specimen Title *
            </label>
            <input
              id="listing-title"
              type="text"
              required
              minLength={5}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ceylon King George V 15-Cents Stamp 1921"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="listing-description" className={labelClass}>
              Historical Description &amp; Provenance Notes *
            </label>
            <textarea
              id="listing-description"
              required
              minLength={10}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background, watermark details, grade, mint marks, paper condition..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="listing-category" className={labelClass}>
              Category *
            </label>
            <select
              id="listing-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CollectibleCategory)}
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2.5 text-xs text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
            >
              <option value="stamp">Stamp</option>
              <option value="coin">Coin</option>
              <option value="currency">Paper Currency / Banknote</option>
            </select>
          </div>

          <div>
            <label htmlFor="listing-country" className={labelClass}>
              Country of Origin *
            </label>
            <input
              id="listing-country"
              type="text"
              required
              minLength={2}
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
              placeholder="e.g. Ceylon, Japan, UK"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="listing-year" className={labelClass}>
              Year Issued
            </label>
            <input
              id="listing-year"
              type="number"
              min={1}
              max={new Date().getFullYear()}
              value={yearIssued}
              onChange={(e) => setYearIssued(e.target.value)}
              placeholder="e.g. 1921"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="listing-condition" className={labelClass}>
              Grade / Condition
            </label>
            <select
              id="listing-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2.5 text-xs text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="listing-denomination" className={labelClass}>
              Face Denomination
            </label>
            <input
              id="listing-denomination"
              type="text"
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
              placeholder="e.g. 15 Cents, 1 Sovereign, 5 Shillings"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#A08D6F]/40 font-mono-tag">
          <span className="block text-xs font-bold text-[#3F3A32] uppercase tracking-wider">
            Sale Mechanism *
          </span>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => setListingType('auction')}
              aria-pressed={listingType === 'auction'}
              className={`flex-1 p-4 rounded border-2 flex items-center gap-3 transition-all ${
                listingType === 'auction'
                  ? 'bg-[#D8DCC8] border-[#8C9B7E] text-[#3F3A32] font-bold shadow-sm'
                  : 'bg-[#F5F0E6] border-[#A08D6F]/50 text-[#3F3A32]/70'
              }`}
            >
              <Gavel className="w-5 h-5 text-[#3F3A32]" />
              <div className="text-left">
                <span className="font-bold text-xs block">Live Auction</span>
                <span className="text-[10px] opacity-80">
                  Bidding with timer &amp; reserve price
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setListingType('fixed')}
              aria-pressed={listingType === 'fixed'}
              className={`flex-1 p-4 rounded border-2 flex items-center gap-3 transition-all ${
                listingType === 'fixed'
                  ? 'bg-[#EDE0D4] border-[#C8B8A6] text-[#3F3A32] font-bold shadow-sm'
                  : 'bg-[#F5F0E6] border-[#A08D6F]/50 text-[#3F3A32]/70'
              }`}
            >
              <Tag className="w-5 h-5 text-[#3F3A32]" />
              <div className="text-left">
                <span className="font-bold text-xs block">Fixed Price Buy Now</span>
                <span className="text-[10px] opacity-80">Instant single-item checkout</span>
              </div>
            </button>
          </div>
        </div>

        {listingType === 'auction' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-tag">
            <div>
              <label htmlFor="listing-starting-bid" className={labelClass}>
                Starting Bid ($ USD) *
              </label>
              <input
                id="listing-starting-bid"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                placeholder="75.00"
                className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs font-mono font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="listing-reserve" className={labelClass}>
                Reserve Price ($ USD)
              </label>
              <input
                id="listing-reserve"
                type="number"
                step="0.01"
                min="0.01"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="120.00"
                className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs font-mono font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="listing-duration" className={labelClass}>
                Duration (Days) *
              </label>
              <input
                id="listing-duration"
                type="number"
                min={1}
                max={30}
                required
                value={auctionDays}
                onChange={(e) => setAuctionDays(e.target.value)}
                className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs font-mono font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="font-mono-tag">
            <label htmlFor="listing-fixed-price" className={labelClass}>
              Buy Now Fixed Price ($ USD) *
            </label>
            <input
              id="listing-fixed-price"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              placeholder="42.00"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs font-mono font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
            />
          </div>
        )}

        <ImageUploader images={images} onChange={setImages} />

        {error && (
          <div className="flex items-center gap-2 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {published && (
          <div className="flex items-center gap-2 p-3 rounded bg-[#D8DCC8] border border-[#8C9B7E] text-[#3F3A32] text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#8C9B7E]" />
            <span>Specimen published. Opening its catalog record...</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || published}
          className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Publishing Specimen...' : 'Publish Specimen Entry'}</span>
        </button>
      </form>
    </div>
  );
};
