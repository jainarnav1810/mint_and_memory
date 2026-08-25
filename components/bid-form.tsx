'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Listing } from '@/types/listing';
import { getMinimumNextBid } from '@/lib/auction-logic';
import { AlertCircle, CheckCircle2, Gavel, LogIn, ShieldCheck } from 'lucide-react';

interface BidFormProps {
  listing: Listing;
  isAuthenticated: boolean;
}

export const BidForm: React.FC<BidFormProps> = ({ listing, isAuthenticated }) => {
  const router = useRouter();
  const minNextBid = getMinimumNextBid(listing);

  const [bidAmount, setBidAmount] = useState<string>(minNextBid.toFixed(2));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentHigh = listing.current_highest_bid || listing.starting_bid || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const numericAmount = parseFloat(bidAmount);
    if (Number.isNaN(numericAmount) || numericAmount < minNextBid) {
      setError(`Minimum bid required is $${minNextBid.toFixed(2)}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id, amount: numericAmount }),
      });

      const payload = await response.json().catch(() => null);

      // The server is authoritative on increments, auction state, and identity —
      // a rejected bid must surface, never be papered over with a direct write.
      if (!response.ok) {
        setError(payload?.error ?? `Bid rejected (${response.status})`);
        return;
      }

      setSuccessMsg(
        `Bid of $${numericAmount.toFixed(2)} recorded. You are currently the highest bidder.`,
      );
      // Pull the new highest bid (and minimum increment) back from the server.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bid submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 shadow-lg space-y-5">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#A08D6F]/40">
        <div>
          <span className="font-mono-tag text-xs uppercase font-bold tracking-wider text-[#A08D6F] block">
            Auction Bidding Form
          </span>
          <h4 className="font-serif-museum text-lg font-bold text-[#3F3A32] flex items-center gap-2 mt-0.5">
            <Gavel className="w-5 h-5 text-[#A08D6F]" />
            Submit Competitive Bid
          </h4>
        </div>
        <div className="text-right font-mono-tag flex-shrink-0">
          <span className="text-[10px] uppercase font-bold text-[#A08D6F] block">
            Current High Bid
          </span>
          <span className="text-xl font-bold text-[#3F3A32]">${currentHigh.toFixed(2)}</span>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="space-y-4">
          <p className="font-serif-museum text-sm text-[#3F3A32]/85 leading-relaxed">
            Bids are recorded against your collector account. Sign in to place a bid on this
            specimen.
          </p>
          <Link
            href={`/login?redirect=/item/${listing.id}`}
            className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Bid</span>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bid-amount"
              className="block font-mono-tag text-xs font-bold text-[#3F3A32] mb-1.5 uppercase"
            >
              Your Bid Amount (Min: ${minNextBid.toFixed(2)})
            </label>
            <div className="relative font-mono">
              <span className="absolute left-4 top-3 text-[#A08D6F] font-bold">$</span>
              <input
                id="bid-amount"
                type="number"
                step="0.01"
                min={minNextBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] pl-8 pr-4 py-2.5 text-base font-bold text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2 font-mono">
            {[minNextBid, minNextBid + 10, minNextBid + 25, minNextBid + 50].map((quickVal) => (
              <button
                key={quickVal}
                type="button"
                onClick={() => setBidAmount(quickVal.toFixed(2))}
                className="flex-1 py-1.5 rounded bg-[#F5F0E6] hover:bg-[#D8DCC8] text-[#3F3A32] text-xs font-semibold border border-[#A08D6F]/60 transition-colors"
              >
                +${(quickVal - minNextBid).toFixed(0)}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-serif-museum">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded bg-[#D8DCC8] border border-[#8C9B7E] text-[#3F3A32] text-xs font-serif-museum">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#8C9B7E]" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Recording Bid...</span>
            ) : (
              <>
                <Gavel className="w-4 h-4" />
                <span>Confirm &amp; Record Bid</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className="flex items-center gap-2 text-xs font-serif-museum text-[#3F3A32]/80 pt-2 border-t border-[#A08D6F]/40">
        <ShieldCheck className="w-4 h-4 text-[#8C9B7E]" />
        <span>Bids are validated server-side and recorded against your account.</span>
      </div>
    </div>
  );
};
