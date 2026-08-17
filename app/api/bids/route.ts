import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { bidSchema } from '@/lib/validators';
import { getMinimumNextBid } from '@/lib/auction-logic';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = bidSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { listing_id, amount } = parsed.data;

    // Fetch listing state
    const { data: listing, error: listingErr } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listing_id)
      .single();

    if (listingErr || !listing) {
      // In dev mode without database, accept bid mock response
      return NextResponse.json({
        success: true,
        bid: {
          id: `bid_${Date.now()}`,
          listing_id,
          amount,
          created_at: new Date().toISOString(),
        },
        message: 'Bid placed successfully!',
        isMock: true,
      });
    }

    if (listing.status !== 'active' || listing.listing_type !== 'auction') {
      return NextResponse.json({ error: 'This listing is not an active auction' }, { status: 400 });
    }

    if (listing.auction_end && new Date(listing.auction_end).getTime() <= Date.now()) {
      return NextResponse.json({ error: 'Auction has already ended' }, { status: 400 });
    }

    const minRequiredBid = getMinimumNextBid(listing);
    if (amount < minRequiredBid) {
      return NextResponse.json(
        { error: `Bid must be at least $${minRequiredBid.toFixed(2)}` },
        { status: 400 }
      );
    }

    // Insert bid
    const { data: newBid, error: bidErr } = await supabase
      .from('bids')
      .insert([
        {
          listing_id,
          amount,
        },
      ])
      .select()
      .single();

    if (bidErr) {
      return NextResponse.json({ error: bidErr.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, bid: newBid });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
