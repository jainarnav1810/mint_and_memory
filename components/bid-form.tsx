import React, { useState } from 'react';
import { Listing } from '../types/listing';
import { getMinimumNextBid } from '../lib/auction-logic';
import { AlertCircle, CheckCircle2, Gavel, ShieldCheck } from 'lucide-react';

interface BidFormProps {
  listing: Listing;
  onBidSubmitted?: (amount: number) => void;
}

export const BidForm: React.FC<BidFormProps> = ({ listing, onBidSubmitted }) => {
  const minNextBid = getMinimumNextBid(listing);
  const [bidAmount, setBidAmount] = useState<string>(minNextBid.toFixed(2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const numericAmount = parseFloat(bidAmount);
    if (isNaN(numericAmount) || numericAmount < minNextBid) {
      setError(`Minimum bid required is $${minNextBid.toFixed(2)}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          amount: numericAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit bid');
      }

      setSuccessMsg(`Bid of $${numericAmount.toFixed(2)} recorded! You are currently the highest bidder.`);
      if (onBidSubmitted) onBidSubmitted(numericAmount);
    } catch (err: any) {
      setError(err.message || 'Bid submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-zinc-900/90 border border-amber-500/30 p-6 shadow-xl space-y-5 backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-amber-400 block">Auction Bidding</span>
          <h4 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-amber-400" />
            Place Your Bid
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Current High Bid</span>
          <span className="text-xl font-bold font-mono text-amber-400">
            ${(listing.current_highest_bid || listing.starting_bid || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Your Bid Amount (Min: ${minNextBid.toFixed(2)})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-zinc-400 font-mono font-bold">$</span>
            <input
              type="number"
              step="0.01"
              min={minNextBid}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full rounded-xl bg-zinc-950/90 border border-zinc-800 pl-8 pr-4 py-2.5 text-base font-mono font-bold text-amber-300 focus:border-amber-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Quick increment buttons */}
        <div className="flex gap-2">
          {[minNextBid, minNextBid + 10, minNextBid + 25, minNextBid + 50].map((quickVal) => (
            <button
              key={quickVal}
              type="button"
              onClick={() => setBidAmount(quickVal.toFixed(2))}
              className="flex-1 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-amber-500/20 text-zinc-300 hover:text-amber-300 text-xs font-mono border border-zinc-700/60 hover:border-amber-500/40 transition-colors"
            >
              +${(quickVal - minNextBid).toFixed(0)}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Submitting Bid...</span>
          ) : (
            <>
              <Gavel className="w-4 h-4" />
              <span>Confirm & Place Bid</span>
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Verified Authenticity & Secure Auction Settlement</span>
      </div>
    </div>
  );
};
