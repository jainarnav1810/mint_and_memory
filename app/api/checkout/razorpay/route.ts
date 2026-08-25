import { NextResponse, type NextRequest } from 'next/server';

import { createRazorpayOrder } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { checkoutSchema, firstIssue } from '@/lib/validators';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }

  const { listing_id, shipping_address } = parsed.data;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to acquire a specimen' }, { status: 401 });
  }

  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('id, title, status, listing_type, fixed_price, currency')
    .eq('id', listing_id)
    .maybeSingle();

  if (listingErr) {
    return NextResponse.json({ error: listingErr.message }, { status: 500 });
  }
  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }
  if (listing.status !== 'active') {
    return NextResponse.json({ error: 'This specimen is no longer available' }, { status: 409 });
  }
  if (listing.listing_type !== 'fixed') {
    return NextResponse.json(
      { error: 'This specimen is sold by auction, not fixed price' },
      { status: 409 },
    );
  }

  // The price comes from the listing row — never from the request body, or a
  // collector could name their own amount.
  const amountInUnits = Number(listing.fixed_price ?? 0);
  if (!(amountInUnits > 0)) {
    return NextResponse.json({ error: 'This specimen has no price set' }, { status: 409 });
  }

  const currency = listing.currency || 'USD';

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      listing_id: listing.id,
      buyer_id: user.id,
      order_type: 'fixed',
      amount: amountInUnits,
      currency,
      payment_status: 'pending',
      order_status: 'processing',
      shipping_address,
    })
    .select('id')
    .single();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: orderErr?.message ?? 'Could not record the order' },
      { status: 400 },
    );
  }

  try {
    const razorpayOrder = await createRazorpayOrder({
      listingId: listing.id,
      amountInUnits,
      currency,
      receipt: `order_${order.id.slice(0, 18)}`,
    });

    // Recorded so the webhook can match a payment to this exact order rather
    // than to every order that shares the listing.
    await supabase
      .from('orders')
      .update({ razorpay_order_id: razorpayOrder.orderId })
      .eq('id', order.id);

    return NextResponse.json({
      orderRecordId: order.id,
      orderId: razorpayOrder.orderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayOrder.isMock ? null : razorpayOrder.keyId,
      isMock: razorpayOrder.isMock,
    });
  } catch (err) {
    await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order.id);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Razorpay order creation failed' },
      { status: 502 },
    );
  }
}
