import { NextRequest, NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe';
import { checkoutSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = checkoutSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { listing_id } = parsed.data;
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await createStripeCheckoutSession({
      listingId: listing_id,
      itemTitle: `Collectible Purchase - Listing #${listing_id.slice(0, 8)}`,
      amountInCents: 4200, // example price or fetched price
      successUrl: `${origin}/checkout?status=success&listing_id=${listing_id}`,
      cancelUrl: `${origin}/item/${listing_id}?status=cancelled`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.sessionId, isMock: session.isMock });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
