import React, { useState } from 'react';
import { ImageUploader } from '@components/image-uploader';
import { CollectibleCategory, ItemCondition, ListingType } from '@types/listing';
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
    } fontally {
      setLoading(false);
    }
  };

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => handleNav('/admin/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-amber-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Dashboard</span>
      </button>

      <div className="pb-4 border-b border-zinc-800">
        <span className="text-xs uppercase font-semibold tracking-wider text-amber-400 block">Inventory Listing</span>
        <h1 className="text-3xl font-extrabold text-zinc-100 flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-amber-400" />
          Create New Collectible Listing
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-6 backdrop-blur-md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Collectible Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ceylon King George V 15-Cents Stamp 1921"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Historical Description & Provenance Notes *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background, watermark details, grade, mint marks, paper condition..."
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-100 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CollectibleCategory)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-3 py-2.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
            >
              <option value="stamp">Stamp</option>
              <option value="coin">Coin</option>
              <option value="currency">Paper Currency / Banknote</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Country of Origin *</label>
            <input
              type="text"
              required
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
              placeholder="e.g. Ceylon, Japan, UK"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Year Issued</label>
            <input
              type="number"
              value={yearIssued}
              onChange={(e) => setYearIssued(e.target.value)}
              placeholder="e.g. 1921"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Grade / Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-3 py-2.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
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
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Face Denomination</label>
            <input
              type="text"
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
              placeholder="e.g. 15 Cents, 1 Sovereign, 5 Shillings"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">Sale Mechanism *</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setListingType('auction')}
              className={`flex-1 p-4 rounded-xl border flex items-center gap-3 transition-all ${
                listingType === 'auction'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
              }`}
            >
              <Gavel className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <span className="font-bold text-xs block">Live Auction</span>
                <span className="text-[10px] opacity-75">Bidding with timer & reserve price</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setListingType('fixed')}
              className={`flex-1 p-4 rounded-xl border flex items-center gap-3 transition-all ${
                listingType === 'fixed'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
              }`}
            >
              <Tag className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <span className="font-bold text-xs block">Fixed Price Buy Now</span>
                <span className="text-[10px] opacity-75">Instant single-item checkout</span>
              </div>
            </button>
          </div>
        </div>

        {listingType === 'auction' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Starting Bid ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                placeholder="75.00"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Reserve Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                placeholder="120.00"
                className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">Buy Now Fixed Price ($ USD) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={fixedPrice}
              onChange={(e) => setFixedPrice(e.target.value)}
              placeholder="42.00"
              className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-4 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
            />
          </div>
        )}

        <ImageUploader images={images} onChange={setImages} />

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Listing published successfully! Redirecting to catalog...</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{loading ? 'Publishing Listing...' : 'Publish Listing'}</span>
        </button>
      </form>
    </div>
  );
}
