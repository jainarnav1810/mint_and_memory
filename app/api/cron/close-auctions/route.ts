import { NextResponse, type NextRequest } from 'next/server';

import { evaluateAuctionWinner } from '@/lib/auction-logic';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { Bid } from '@/types/bid';

interface ExpiredAuction {
  id: string;
  currency: string | null;
  reserve_price: number | null;
  bids: Bid[] | null;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  // Vercel Cron sends `Bearer $CRON_SECRET`. Without a secret configured this
  // endpoint would be publicly triggerable, so refuse rather than run open.
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured' }, { status: 503 });
  }
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const nowIso = new Date().toISOString();

  const { data: expiredAuctions, error: fetchErr } = await supabase
    .from('listings')
    .select('id, currency, reserve_price, bids(id, listing_id, bidder_id, amount, created_at)')
    .eq('listing_type', 'auction')
    .eq('status', 'active')
    .lte('auction_end', nowIso);

  // Don't report a fetch failure as "0 expired auctions" — that hides an outage.
  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  const auctions = (expiredAuctions ?? []) as unknown as ExpiredAuction[];

  if (auctions.length === 0) {
    return NextResponse.json({
      message: 'Cron executed cleanly: 0 expired auctions found.',
      processedCount: 0,
      timestamp: nowIso,
    });
  }

  const results: Record<string, unknown>[] = [];

  for (const listing of auctions) {
    const highestBid =
      [...(listing.bids ?? [])].sort((a, b) => Number(b.amount) - Number(a.amount))[0] ?? null;
    const { winner, reserveMet } = evaluateAuctionWinner(listing, highestBid);

    const { error: closeErr } = await supabase
      .from('listings')
      .update({ status: 'closed' })
      .eq('id', listing.id)
      // Guard against a second cron run reprocessing the same auction.
      .eq('status', 'active');

    if (closeErr) {
      results.push({ listingId: listing.id, status: 'ERROR', reason: closeErr.message });
      continue;
    }

    if (!winner) {
      results.push({
        listingId: listing.id,
        status: 'CLOSED_NO_WINNER',
        reason: highestBid ? 'Reserve not met' : 'No bids',
      });
      continue;
    }

    const { error: orderErr } = await supabase.from('orders').insert({
      listing_id: listing.id,
      buyer_id: winner.bidder_id,
      order_type: 'auction',
      amount: winner.amount,
      currency: listing.currency || 'USD',
      payment_status: 'pending',
      order_status: 'processing',
    });

    results.push({
      listingId: listing.id,
      status: orderErr ? 'WON_ORDER_FAILED' : 'WON',
      winnerBidder: winner.bidder_id,
      amount: winner.amount,
      reserveMet,
      ...(orderErr ? { reason: orderErr.message } : {}),
    });
  }

  return NextResponse.json({
    message: `Cron completed: ${results.length} auctions processed.`,
    processedCount: results.length,
    results,
  });
}
