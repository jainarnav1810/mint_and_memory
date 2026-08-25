import { NextResponse, type NextRequest } from 'next/server';

/**
 * Stripe is intentionally dormant — this deployment settles payments through
 * Razorpay (`/api/webhooks/razorpay`).
 *
 * The route is kept as a stub rather than left wired up, because it never
 * verified a Stripe signature: any unauthenticated POST could have marked an
 * arbitrary listing sold. Before enabling Stripe, verify the
 * `stripe-signature` header with `stripe.webhooks.constructEvent` against
 * `STRIPE_WEBHOOK_SECRET` and only then update orders/listings.
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe payments are not enabled on this deployment' },
    { status: 501 },
  );
}
