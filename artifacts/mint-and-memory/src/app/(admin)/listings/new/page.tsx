import React, { useState } from 'react';
import { ImageUploader } from '@/components/image-uploader';
import { CollectibleCategory, ItemCondition, ListingType } from '@/types/listing';
import { ArrowLeft, CheckCircle2, Gavel, PlusCircle, Tag } from 'lucide-react';

export default function NewListingPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CollectibleCategory>('stamp');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [yearIssued, setYearIssued] = useState<string>('');
  const [condition, setCondition] = useState<ItemCondition>('Extremely Fine');
  const [denomination, setDenomination] = useState('');
  const [listingType, setListingType] = useState<ListingType>('auction');
  const [fixedPrice, setFixedPrice] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        category,
        country_of_origin: countryOfOrigin,
        year_issued: yearIssued ? parseInt(yearIssued, 10) : null,
        condition,
        denomination,
        listing_type: listingType,
        fixed_price: fixedPrice ? parseFloat(fixedPrice) : null,
        starting_bid: startingBid ? parseFloat(startingBid) : null,
        reserve_price: reservePrice ? parseFloat(reservePrice) : null,
        images,
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSuccessMsg(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('/browse');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-serif-museum">
      <button
        onClick={() => handleNav('/admin/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-mono-tag font-bold text-[#A08D6F] hover:text-[#3F3A32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Admin Dashboard</span>
      </button>

      <div className="pb-4 border-b-2 border-[#A08D6F]">
        <span className="font-mono-tag text-xs uppercase font-bold tracking-widest text-[#A08D6F] block">
          Museum Cataloging Form
        </span>
        <h1 className="text-3xl font-extrabold text-[#3F3A32] flex items-center gap-2 mt-1">
          <PlusCircle className="w-6 h-6 text-[#A08D6F]" />
          Create New Specimen Entry
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 sm:p-8 space-y-6 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">
              Specimen Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ceylon King George V 15-Cents Stamp 1921"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2.5 text-sm text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">
              Historical Description &amp; Provenance Notes *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background, watermark details, grade, mint marks, paper condition..."
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2.5 text-sm text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Category *</label>
            <select
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
            <label className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Country of Origin *</label>
            <input
              type="text"
              required
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
              placeholder="e.g. Ceylon, Japan, UK"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Year Issued</label>
            <input
              type="number"
              value={yearIssued}
              onChange={(e) => setYearIssued(e.target.value)}
              placeholder="e.g. 1921"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Grade / Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2.5 text-xs text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
            >
              <option value="Mint">Mint</option>
              <option value="Uncirculated">Uncirculated</option>
              <option value="Extremely Fine">Extremely Fine</option>
              <option value="Proof">Proof</option>
              <option value="Fine">Fine</option>
              <option value="Used">Used</option>
            </select>
          </div>

          <div>
            <label className="block font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Face Denomination</label>
            <input
              type="text"
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
              placeholder="e.g. 15 Cents, 1 Sovereign, 5 Shillings"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#A08D6F]/40 font-mono-tag">
          <label className="block text-xs font-bold text-[#3F3A32] uppercase tracking-wider">Sale Mechanism *</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setListingType('auction')}
              className={`flex-1 p-4 rounded border-2 flex items-center gap-3 transition-all ${
                listingType === 'auction'
                  ? 'bg-[#D8DCC8] border-[#8C9B7E] text-[#3F3A32] font-bold shadow-sm'
                  : 'bg-[#F5F0E6] border-[#A08D6F]/50 text-[#3F3A32]/70'
              }`}
            >
              <Gavel className="w-5 h-5 text-[#3F3A32]" />
              <div className="text-left">
                <span className="font-bold text-xs block">Live Auction</span>
                <span className="text-[10px] opacity-80">Bidding with timer &amp; reserve price</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setListingType('fixed')}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tag">
            <div>
              <label className="block text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Starting Bid ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                placeholder="75.00"
                className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs font-mono font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Reserve Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="120.00"
                className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs font-mono font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="font-mono-tag">
            <label className="block text-xs font-bold text-[#3F3A32] uppercase tracking-wider mb-1">Buy Now Fixed Price ($ USD) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              placeholder="42.00"
              className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-4 py-2 text-xs font-mono font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none"
            />
          </div>
        )}

        <ImageUploader images={images} onChange={setImages} />

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded bg-[#D8DCC8] border border-[#8C9B7E] text-[#3F3A32] text-xs font-serif-museum">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#8C9B7E]" />
            <span>Specimen published successfully! Redirecting to catalog...</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Publishing Specimen...' : 'Publish Specimen Entry'}</span>
        </button>
      </form>
    </div>
  );
}
