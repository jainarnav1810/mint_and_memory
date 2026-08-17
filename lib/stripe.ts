// Stripe integration module
export interface StripeCheckoutParams {
  listingId: string;
  itemTitle: string;
  amountInCents: number;
  currency?: string;
  buyerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createStripeCheckoutSession(params: StripeCheckoutParams) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    // Simulated checkout session for local development / testing without live keys
    return {
      sessionId: `mock_session_${Date.now()}`,
      url: `${params.successUrl}?session_id=mock_session_${Date.now()}`,
      isMock: true,
    };
  }

  // Live Stripe checkout implementation when API key is present
  const body = new URLSearchParams({
    'payment_method_types[0]': 'card',
    'line_items[0][price_data][currency]': params.currency?.toLowerCase() || 'usd',
    'line_items[0][price_data][product_data][name]': params.itemTitle,
    'line_items[0][price_data][unit_amount]': params.amountInCents.toString(),
    'line_items[0][quantity]': '1',
    'mode': 'payment',
    'success_url': params.successUrl,
    'cancel_url': params.cancelUrl,
    'metadata[listing_id]': params.listingId,
  });

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to create Stripe checkout session');
  }

  return {
    sessionId: data.id,
    url: data.url,
    isMock: false,
  };
}
