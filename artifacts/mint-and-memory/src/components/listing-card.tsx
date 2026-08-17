import React from 'react';
import { Listing } from '../types/listing';
import { AuctionTimer } from './auction-timer';
import { ArrowUpRight, Award, Flame, Tag } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onSelect?: (listing: Listing) => void;
  onQuickBid?: (listing: Listing) => void;
  onQuickBuy?: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onQuickBid, onQuickBuy }) => {
  const isAuction = listing.listing_type === 'auction';
  const displayPrice = isAuction
    ? listing.current_highest_bid || listing.starting_bid || 0
    : listing.fixed_price || 0;

  const imageSrc = listing.images && listing.images.length > 0
    ? listing.images[0].storage_path
    : listing.category === 'stamp' ? '/archive-desk.jpg' : '/world-archive.jpg';

  const categoryColor = {
    stamp: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    coin: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    currency: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  }[listing.category];

  return (
    <div
      onClick={() => onSelect && onSelect(listing)}
      className="group relative flex flex-col rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer backdrop-blur-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={imageSrc}
          alt={listing.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize backdrop-blur-md ${categoryColor}`}>
            {listing.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-900/80 text-zinc-300 border border-zinc-700/60 backdrop-blur-md">
            {listing.country_of_origin}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          {isAuction ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
              Auction
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <Tag className="w-3 h-3 text-emerald-400" />
              Fixed Price
            </span>
          )}
        </div>

        {isAuction && listing.auction_end && (
          <div className="absolute bottom-3 left-3 right-3">
            <AuctionTimer endTime={listing.auction_end} compact />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>{listing.year_issued ? `Year ${listing.year_issued}` : 'Historic Issue'}</span>
            {listing.condition && (
              <span className="flex items-center gap-1 text-zinc-300">
                <Award className="w-3 h-3 text-amber-400" />
                {listing.condition}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 block">
              {isAuction ? (listing.current_highest_bid ? 'Current Highest Bid' : 'Starting Bid') : 'Buy Price'}
            </span>
            <div className="text-lg font-bold text-amber-400 font-mono">
              ${displayPrice.toFixed(2)}{' '}
              <span className="text-xs font-normal text-zinc-500">{listing.currency}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isAuction && onQuickBid) onQuickBid(listing);
              else if (!isAuction && onQuickBuy) onQuickBuy(listing);
              else if (onSelect) onSelect(listing);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all transform group-hover:translate-x-0.5 shadow-md shadow-amber-500/10"
          >
            <span>{isAuction ? 'Place Bid' : 'Buy Now'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
