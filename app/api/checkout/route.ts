import { NextResponse, type NextRequest } from 'next/server';

/**
 * Stripe checkout is intentionally dormant — this deployment settles payments
 * through Razorpay (`/api/checkout/razorpay`), which prices the order from the
 * listing row rather than the hardcoded amount this route used to send.
 *
 * `lib/stripe.ts` is left in place for a future switch.
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe checkout is not enabled on this deployment' },
    { status: 501 },
  );
}
