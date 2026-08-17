import React from 'react';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export default function CheckoutPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6 font-serif-museum">
      <div className="mx-auto w-16 h-16 rounded-full bg-[#D8DCC8] text-[#3F3A32] border-2 border-[#8C9B7E] flex items-center justify-center shadow-md">
        <CheckCircle className="w-8 h-8 text-[#8C9B7E]" />
      </div>

      <div className="space-y-2">
        <span className="font-mono-tag text-xs font-bold uppercase tracking-widest text-[#A08D6F]">
          Acquisition Order Confirmed &amp; Paid
        </span>
        <h1 className="text-3xl font-extrabold text-[#3F3A32]">Thank You For Your Specimen Acquisition!</h1>
        <p className="text-sm text-[#3F3A32]/80 max-w-md mx-auto leading-relaxed">
          Your payment was processed securely via Razorpay. A tracking receipt and insurance postal confirmation have been logged for your item.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] text-left space-y-3 max-w-md mx-auto text-xs font-serif-museum shadow-md">
        <div className="flex justify-between border-b border-[#A08D6F]/30 pb-2">
          <span className="font-mono-tag text-[#A08D6F]">Specimen Order No.</span>
          <span className="font-mono text-[#3F3A32] font-bold">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div className="flex justify-between border-b border-[#A08D6F]/30 pb-2">
          <span className="font-mono-tag text-[#A08D6F]">Dispatched Via</span>
          <span className="text-[#3F3A32] font-semibold">International Insured Postal Airmail</span>
        </div>
        <div className="flex justify-between">
          <span className="font-mono-tag text-[#A08D6F]">Estimated Delivery</span>
          <span className="text-[#3F3A32] font-bold">3-5 Business Days</span>
        </div>
      </div>

      <div className="pt-4 flex justify-center gap-4">
        <button
          onClick={() => handleNav('/browse')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase shadow-md transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Return to Specimen Drawers</span>
        </button>
      </div>
    </div>
  );
}
