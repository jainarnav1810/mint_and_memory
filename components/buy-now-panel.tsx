'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Listing } from '@/types/listing';
import { AlertCircle, CheckCircle2, LogIn, Zap } from 'lucide-react';

interface BuyNowPanelProps {
  listing: Listing;
  isAuthenticated: boolean;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

/**
 * Load Razorpay's checkout script once, on demand. Injecting it on mount (and
 * removing it on unmount) would tear the SDK out from under an open modal.
 */
function loadRazorpay(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'));
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve();

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Razorpay failed to load')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay failed to load'));
    document.body.appendChild(script);
  });
}

const EMPTY_ADDRESS = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
};

const FIELDS: { key: keyof typeof EMPTY_ADDRESS; label: string; span: boolean }[] = [
  { key: 'fullName', label: 'Recipient Full Name', span: true },
  { key: 'addressLine1', label: 'Address Line 1', span: true },
  { key: 'addressLine2', label: 'Address Line 2 (Optional)', span: true },
  { key: 'city', label: 'City', span: false },
  { key: 'state', label: 'State / Province', span: false },
  { key: 'postalCode', label: 'Postal Code', span: false },
  { key: 'country', label: 'Country', span: false },
];

export const BuyNowPanel: React.FC<BuyNowPanelProps> = ({ listing, isAuthenticated }) => {
  const router = useRouter();
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = listing.fixed_price ?? 0;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const response = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id, shipping_address: address }),
      });

      const order = await response.json().catch(() => null);

      if (!response.ok) {
        setError(order?.error ?? `Could not start checkout (${response.status})`);
        return;
      }

      // No Razorpay keys configured: the order row exists and is pending, so send
      // the collector to the receipt page instead of pretending payment happened.
      if (order.isMock || !order.keyId) {
        router.push(`/checkout?order_id=${encodeURIComponent(order.orderRecordId ?? '')}&mock=1`);
        return;
      }

      await loadRazorpay();

      const RazorpayCtor = (
        window as unknown as {
          Razorpay: new (options: Record<string, unknown>) => { open: () => void };
        }
      ).Razorpay;

      const checkout = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Mint & Memory Specimen Archive',
        description: listing.title,
        order_id: order.orderId,
        handler: (res: RazorpayResponse) => {
          const params = new URLSearchParams({
            order_id: order.orderRecordId ?? '',
            payment_id: res.razorpay_payment_id,
          });
          router.push(`/checkout?${params.toString()}`);
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
        notes: { listing_id: listing.id },
        theme: { color: '#A08D6F' },
      });

      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed to open');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-5 shadow-lg">
      <div>
        <span className="font-mono-tag text-xs uppercase font-bold tracking-wider text-[#A08D6F] block">
          Fixed Acquisition Price
        </span>
        <div className="text-3xl font-bold font-mono text-[#3F3A32] mt-1">
          ${price.toFixed(2)}{' '}
          <span className="text-sm font-normal text-[#A08D6F]">{listing.currency}</span>
        </div>
      </div>

      {!isAuthenticated ? (
        <>
          <p className="font-serif-museum text-sm text-[#3F3A32]/85 leading-relaxed">
            Acquisitions are recorded against your collector account. Sign in to purchase this
            specimen.
          </p>
          <Link
            href={`/login?redirect=/item/${listing.id}`}
            className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Acquire</span>
          </Link>
        </>
      ) : (
        <form onSubmit={handleBuy} className="space-y-4">
          <h4 className="font-mono-tag text-[11px] font-bold text-[#3F3A32] uppercase tracking-wider pt-1 border-t border-[#A08D6F]/40">
            Dispatch Address
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map(({ key, label, span }) => (
              <div key={key} className={span ? 'col-span-2' : 'col-span-1'}>
                <label
                  htmlFor={`ship-${key}`}
                  className="block font-mono-tag text-[10px] font-bold text-[#A08D6F] mb-1 uppercase"
                >
                  {label}
                </label>
                <input
                  id={`ship-${key}`}
                  type="text"
                  required={key !== 'addressLine2'}
                  autoComplete={
                    key === 'fullName'
                      ? 'name'
                      : key === 'addressLine1'
                        ? 'address-line1'
                        : key === 'addressLine2'
                          ? 'address-line2'
                          : key === 'city'
                            ? 'address-level2'
                            : key === 'state'
                              ? 'address-level1'
                              : key === 'postalCode'
                                ? 'postal-code'
                                : 'country-name'
                  }
                  value={address[key]}
                  onChange={(e) => setAddress((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2 text-sm font-serif-museum text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none transition-colors"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs font-serif-museum">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>{busy ? 'Opening Razorpay...' : 'Acquire Specimen via Razorpay'}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-serif-museum text-[#3F3A32]/80">
            <CheckCircle2 className="w-4 h-4 text-[#8C9B7E]" />
            <span>Supports UPI, Netbanking &amp; International Cards</span>
          </div>
        </form>
      )}
    </div>
  );
};
