import { Listing } from '../types/listing';
import { Bid } from '../types/bid';

export function getMinimumNextBid(listing: Pick<Listing, 'starting_bid' | 'current_highest_bid'>): number {
  const current = listing.current_highest_bid || listing.starting_bid || 0;
  if (current === 0) return 1.0;

  if (current < 50) return current + 2.0;
  if (current < 200) return current + 5.0;
  if (current < 1000) return current + 25.0;
  return current + 50.0;
}

export function isAuctionExpired(listing: Pick<Listing, 'listing_type' | 'auction_end' | 'status'>): boolean {
  if (listing.listing_type !== 'auction' || listing.status !== 'active') return false;
  if (!listing.auction_end) return false;
  return new Date(listing.auction_end).getTime() <= Date.now();
}

export function evaluateAuctionWinner(
  listing: Pick<Listing, 'reserve_price'>,
  highestBid: Bid | null
): { winner: Bid | null; reserveMet: boolean } {
  if (!highestBid) {
    return { winner: null, reserveMet: false };
  }

  const reserve = listing.reserve_price || 0;
  const reserveMet = highestBid.amount >= reserve;

  return {
    winner: reserveMet ? highestBid : null,
    reserveMet,
  };
}
