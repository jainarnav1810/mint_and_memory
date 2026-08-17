import React from 'react';
import { CheckCircle, PackageCheck, ShoppingBag } from 'lucide-react';

export default function CheckoutPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-xl">
        <CheckCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Order Confirmed & Paid</span>
        <h1 className="text-3xl font-extrabold text-zinc-100">Thank You For Your Acquisition!</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your payment was processed securely via Stripe. A tracking receipt and insurance confirmation have been sent to your registered email.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-left space-y-3 max-w-md mx-auto text-xs">
        <div className="flex justify-between border-b border-zinc-800 pb-2">
          <span className="text-zinc-500">Order Number</span>
          <span className="font-mono text-zinc-200 font-bold">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div className="flex justify-between border-b border-zinc-800 pb-2">
          <span className="text-zinc-500">Dispatched Via</span>
          <span className="text-zinc-200">International Insured Airmail</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Estimated Delivery</span>
          <span className="text-amber-400 font-semibold">3-5 Business Days</span>
        </div>
      </div>

      <div className="pt-4 flex justify-center gap-4">
        <button
          onClick={() => handleNav('/browse')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Browsing Catalog</span>
        </button>
      </div>
    </div>
  );
}
