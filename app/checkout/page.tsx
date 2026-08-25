import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Clock, PackageCheck } from 'lucide-react';

import { getOrderById } from '@/lib/queries';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Acquisition Receipt — Mint & Memory',
  description: 'Confirmation and dispatch record for your specimen acquisition.',
};

interface CheckoutPageProps {
  searchParams: Promise<{ order_id?: string; payment_id?: string; mock?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { order_id: orderId, payment_id: paymentId, mock } = await searchParams;
  const order = orderId ? await getOrderById(orderId) : null;

  // The webhook is what flips an order to `paid`; it may land a moment after the
  // browser returns here, so treat "pending with a payment id" as in-progress.
  const isPaid = order?.payment_status === 'paid';
  const isPending = !isPaid && Boolean(paymentId);
  const isMock = mock === '1';

  const heading = isPaid
    ? 'Acquisition Confirmed'
    : isPending
      ? 'Payment Received — Awaiting Confirmation'
      : isMock
        ? 'Order Reserved — Payment Not Configured'
        : 'Order Recorded';

  const Icon = isPaid ? CheckCircle2 : isMock ? AlertCircle : Clock;
  const iconTone = isPaid ? 'text-[#8C9B7E]' : isMock ? 'text-amber-700' : 'text-[#A08D6F]';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-2xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-8 sm:p-10 shadow-xl space-y-7 text-center">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-[#F5F0E6] border border-[#A08D6F]/50">
            <Icon className={`w-9 h-9 ${iconTone}`} />
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-mono-tag text-xs uppercase font-bold tracking-widest text-[#A08D6F] block">
            Specimen Acquisition Record
          </span>
          <h1 className="font-serif-museum text-3xl font-extrabold text-[#3F3A32]">{heading}</h1>
        </div>

        {order ? (
          <>
            <p className="font-serif-museum text-sm text-[#3F3A32]/85 leading-relaxed">
              {isPaid ? (
                <>
                  Payment for <strong>{order.listing?.title ?? 'your specimen'}</strong> has cleared.
                  The piece is being prepared for archival packing and dispatch.
                </>
              ) : isPending ? (
                <>
                  Razorpay has accepted your payment for{' '}
                  <strong>{order.listing?.title ?? 'your specimen'}</strong>. This record updates to
                  confirmed as soon as the payment webhook settles — usually within a minute.
                </>
              ) : isMock ? (
                <>
                  Your order for <strong>{order.listing?.title ?? 'your specimen'}</strong> is held
                  as pending. Razorpay credentials are not configured on this deployment, so no
                  charge was made.
                </>
              ) : (
                <>
                  Your order for <strong>{order.listing?.title ?? 'your specimen'}</strong> is
                  recorded as pending payment.
                </>
              )}
            </p>

            <dl className="grid grid-cols-2 gap-3 text-left font-mono-tag text-xs">
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40 col-span-2">
                <dt className="text-[10px] uppercase text-[#A08D6F]">Order Reference</dt>
                <dd className="font-bold text-[#3F3A32] break-all">{order.id}</dd>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <dt className="text-[10px] uppercase text-[#A08D6F]">Amount</dt>
                <dd className="font-bold text-[#3F3A32]">
                  ${Number(order.amount ?? 0).toFixed(2)} {order.currency}
                </dd>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <dt className="text-[10px] uppercase text-[#A08D6F]">Payment</dt>
                <dd className="font-bold text-[#3F3A32] capitalize">{order.payment_status}</dd>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <dt className="text-[10px] uppercase text-[#A08D6F]">Acquisition Type</dt>
                <dd className="font-bold text-[#3F3A32] capitalize">{order.order_type}</dd>
              </div>
              <div className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                <dt className="text-[10px] uppercase text-[#A08D6F]">Dispatch</dt>
                <dd className="font-bold text-[#3F3A32] capitalize">{order.order_status}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p className="font-serif-museum text-sm text-[#3F3A32]/85 leading-relaxed">
            {orderId
              ? 'We could not find that acquisition record under your account. If you have just signed in, try opening the link again.'
              : 'No acquisition reference was supplied. Browse the archive to begin a new acquisition.'}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/browse"
            className="px-5 py-3 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase tracking-wider shadow-md transition-colors inline-flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Continue Browsing the Archive</span>
          </Link>
          {order?.listing && (
            <Link
              href={`/item/${order.listing.id}`}
              className="px-5 py-3 rounded bg-[#F5F0E6] hover:bg-[#D8DCC8] text-[#3F3A32] border border-[#A08D6F] font-mono-tag font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center"
            >
              View Specimen Record
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
