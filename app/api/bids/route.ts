import { NextResponse, type NextRequest } from 'next/server';

import { getMinimumNextBid } from '@/lib/auction-logic';
import { createClient } from '@/lib/supabase/server';
import { bidSchema, firstIssue } from '@/lib/validators';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bidSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }

  const { listing_id, amount } = parsed.data;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to place a bid' }, { status: 401 });
  }

  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('id, status, listing_type, auction_end, starting_bid, current_highest_bid')
    .eq('id', listing_id)
    .maybeSingle();

  // No mock fallback: a missing listing is a 404, not a fake accepted bid.
  if (listingErr) {
    return NextResponse.json({ error: listingErr.message }, { status: 500 });
  }
  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  if (listing.status !== 'active' || listing.listing_type !== 'auction') {
    return NextResponse.json({ error: 'This listing is not an active auction' }, { status: 409 });
  }

  if (listing.auction_end && new Date(listing.auction_end).getTime() <= Date.now()) {
    return NextResponse.json({ error: 'This auction has already ended' }, { status: 409 });
  }

  const minRequiredBid = getMinimumNextBid(listing);
  if (amount < minRequiredBid) {
    return NextResponse.json(
      { error: `Bid must be at least $${minRequiredBid.toFixed(2)}` },
      { status: 400 },
    );
  }

  // place_bid locks the listing row and re-checks the increment, so it is the
  // authority under concurrent bids; the checks above only give better messages.
  // It derives the bidder from auth.uid() — the caller cannot bid as someone else.
  const { data, error } = await supabase.rpc('place_bid', {
    p_listing_id: listing_id,
    p_amount: amount,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  return NextResponse.json({ success: true, bid: data });
}
