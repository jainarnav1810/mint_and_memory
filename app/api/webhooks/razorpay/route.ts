import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayWebhook } from '@/lib/razorpay';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    const isValid = verifyRazorpayWebhook(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Razorpay webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === 'order.paid' || payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const listingId = payment.notes?.listing_id;

      if (listingId) {
        // Update order status to paid in database
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'paid', stripe_payment_intent_id: payment.id })
          .eq('listing_id', listingId);

        // Update listing status to sold
        await supabaseAdmin
          .from('listings')
          .update({ status: 'sold' })
          .eq('id', listingId);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Webhook processing failed' }, { status: 500 });
  }
}
