import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';
import { checkoutSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = checkoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { listing_id } = parsed.data;

    // Example item amount (in real app fetched from DB or payload)
    const amountInUnits = 42.00; // $42.00 USD

    const razorpayOrder = await createRazorpayOrder({
      listingId: listing_id,
      amountInUnits,
      currency: 'USD',
    });

    return NextResponse.json({
      orderId: razorpayOrder.orderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayOrder.keyId,
      isMock: razorpayOrder.isMock,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Razorpay order creation failed' }, { status: 500 });
  }
}
