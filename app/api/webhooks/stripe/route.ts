import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const listingId = session.metadata?.listing_id;

      if (listingId) {
        // Update order status to paid
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'paid', stripe_payment_intent_id: session.payment_intent })
          .eq('listing_id', listingId);

        // Update listing status to sold
        await supabaseAdmin
          .from('listings')
          .update({ status: 'sold' })
          .eq('id', listingId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook error' }, { status: 400 });
  }
}
