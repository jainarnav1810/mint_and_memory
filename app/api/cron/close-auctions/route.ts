import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  // Optional security check for Vercel Cron Header
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized cron invocation' }, { status: 401 });
  }

  try {
    const nowIso = new Date().toISOString();

    // 1. Fetch expired active auctions
    const { data: expiredAuctions, error: fetchErr } = await supabaseAdmin
      .from('listings')
      .select('*, bids(*)')
      .eq('listing_type', 'auction')
      .eq('status', 'active')
      .lte('auction_end', nowIso);

    if (fetchErr || !expiredAuctions || expiredAuctions.length === 0) {
      return NextResponse.json({
        message: 'Cron executed cleanly: 0 expired auctions found.',
        processedCount: 0,
        timestamp: new Date().toISOString(),
      });
    }

    const results = [];

    for (const listing of expiredAuctions) {
      // Find highest bid
      const sortedBids = (listing.bids || []).sort((a: any, b: any) => b.amount - a.amount);
      const winningBid = sortedBids[0];
      const reserve = listing.reserve_price || 0;

      if (winningBid && winningBid.amount >= reserve) {
        // Mark listing as closed/sold
        await supabaseAdmin
          .from('listings')
          .update({ status: 'closed' })
          .eq('id', listing.id);

        // Create pending order for winner
        await supabaseAdmin.from('orders').insert([
          {
            listing_id: listing.id,
            buyer_id: winningBid.bidder_id,
            order_type: 'auction',
            amount: winningBid.amount,
            currency: listing.currency || 'USD',
            payment_status: 'pending',
            order_status: 'processing',
          },
        ]);

        results.push({ listingId: listing.id, status: 'WON', winnerBidder: winningBid.bidder_id, amount: winningBid.amount });
      } else {
        // Reserve not met or no bids placed
        await supabaseAdmin
          .from('listings')
          .update({ status: 'closed' })
          .eq('id', listing.id);

        results.push({ listingId: listing.id, status: 'CLOSED_NO_WINNER', reason: winningBid ? 'Reserve not met' : 'No bids' });
      }
    }

    return NextResponse.json({
      message: `Cron completed: ${results.length} auctions processed.`,
      processedCount: results.length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Cron job failure' }, { status: 500 });
  }
}
