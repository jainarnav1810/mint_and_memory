import { NextResponse, type NextRequest } from 'next/server';

import { verifyRazorpayWebhook } from '@/lib/razorpay';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

/** Razorpay events that mean money actually moved. */
const PAID_EVENTS = new Set(['order.paid', 'payment.captured']);
const FAILED_EVENTS = new Set(['payment.failed']);

export async function POST(request: NextRequest) {
  // The raw body is what was signed — parse only after verifying.
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  if (!verifyRazorpayWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid Razorpay webhook signature' }, { status: 400 });
  }

  let payload: {
    event?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string; notes?: Record<string, string> } } };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Malformed webhook payload' }, { status: 400 });
  }

  const event = payload.event ?? '';
  const payment = payload.payload?.payment?.entity;

  if (!payment || (!PAID_EVENTS.has(event) && !FAILED_EVENTS.has(event))) {
    // Acknowledge events we don't act on so Razorpay stops retrying them.
    return NextResponse.json({ status: 'ignored', event });
  }

  const supabase = getSupabaseAdmin();
  const razorpayOrderId = payment.order_id;
  const listingId = payment.notes?.listing_id;

  if (!razorpayOrderId && !listingId) {
    return NextResponse.json({ error: 'Webhook carried no order reference' }, { status: 400 });
  }

  // Match the specific order this payment belongs to. The listing id in `notes`
  // is only a fallback for orders created before the id was recorded.
  const locate = razorpayOrderId
    ? supabase.from('orders').select('id, listing_id').eq('razorpay_order_id', razorpayOrderId)
    : supabase
        .from('orders')
        .select('id, listing_id')
        .eq('listing_id', listingId!)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

  const { data: orders, error: findErr } = await locate;

  if (findErr) {
    return NextResponse.json({ error: findErr.message }, { status: 500 });
  }
  if (!orders || orders.length === 0) {
    return NextResponse.json({ status: 'no matching order', event }, { status: 202 });
  }

  const order = orders[0];

  if (FAILED_EVENTS.has(event)) {
    await supabase
      .from('orders')
      .update({ payment_status: 'failed', razorpay_payment_id: payment.id })
      .eq('id', order.id);

    return NextResponse.json({ status: 'ok', event, orderId: order.id });
  }

  const { error: updateErr } = await supabase
    .from('orders')
    .update({ payment_status: 'paid', razorpay_payment_id: payment.id })
    .eq('id', order.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  // Take the specimen off the floor now that it's paid for.
  await supabase
    .from('listings')
    .update({ status: 'sold' })
    .eq('id', order.listing_id ?? listingId);

  return NextResponse.json({ status: 'ok', event, orderId: order.id });
}
