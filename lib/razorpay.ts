import crypto from 'crypto';

export interface CreateRazorpayOrderParams {
  listingId: string;
  amountInUnits: number; // e.g. 42.00
  currency?: string;     // e.g. 'USD' or 'INR'
  receipt?: string;
}

export async function createRazorpayOrder(params: CreateRazorpayOrderParams) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const currency = params.currency || 'USD';
  // Razorpay amounts are in smallest currency unit (paise for INR, cents for USD)
  const amountInSubunits = Math.round(params.amountInUnits * 100);

  if (!keyId || !keySecret) {
    // Development Mock Fallback when API keys are not yet configured
    const mockId = `order_mock_${Date.now()}`;
    return {
      orderId: mockId,
      amount: amountInSubunits,
      currency,
      keyId: 'rzp_test_mock_key',
      isMock: true,
    };
  }

  // Live Razorpay API call using Basic Auth
  const authStr = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authStr}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInSubunits,
      currency: currency.toUpperCase(),
      receipt: params.receipt || `receipt_${params.listingId.slice(0, 8)}`,
      notes: {
        listing_id: params.listingId,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.description || 'Failed to create Razorpay Order');
  }

  return {
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId,
    isMock: false,
  };
}

/**
 * Verifies Razorpay payment signature from client callback.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return true; // Mock mode returns true

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest('hex');

  return generatedSignature === signature;
}

/**
 * Verifies Razorpay webhook signature.
 */
export function verifyRazorpayWebhook(
  rawBody: string,
  signature: string
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return true;

  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(rawBody);
  const generatedSignature = hmac.digest('hex');

  return generatedSignature === signature;
}
