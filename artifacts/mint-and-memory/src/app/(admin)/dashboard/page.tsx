import React from 'react';
import { DollarSign, Gavel, Layers, PlusCircle, ShoppingBag } from 'lucide-react';

export default function AdminDashboardPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#A08D6F]">
        <div>
          <span className="font-mono-tag text-xs uppercase font-bold tracking-widest text-[#A08D6F] block">
            Curator &amp; Seller Admin Portal
          </span>
          <h1 className="font-serif-museum text-3xl font-extrabold text-[#3F3A32] flex items-center gap-2 mt-1">
            <Layers className="w-6 h-6 text-[#A08D6F]" />
            Specimen Inventory &amp; Auction Dashboard
          </h1>
        </div>

        <button
          onClick={() => handleNav('/admin/listings/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Catalog New Specimen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-2 shadow-md">
          <div className="flex items-center justify-between font-mono-tag text-[#A08D6F] text-xs font-bold uppercase">
            <span>Total Specimens</span>
            <Layers className="w-4 h-4 text-[#A08D6F]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#3F3A32]">1,702</div>
          <span className="text-[10px] font-serif-museum text-[#3F3A32]/80">+14 added this week</span>
        </div>

        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-2 shadow-md">
          <div className="flex items-center justify-between font-mono-tag text-[#A08D6F] text-xs font-bold uppercase">
            <span>Active Auctions</span>
            <Gavel className="w-4 h-4 text-[#A08D6F]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#3F3A32]">128</div>
          <span className="text-[10px] font-serif-museum text-[#3F3A32]/80">24 ending in 24 hours</span>
        </div>

        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-2 shadow-md">
          <div className="flex items-center justify-between font-mono-tag text-[#A08D6F] text-xs font-bold uppercase">
            <span>Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-[#A08D6F]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#3F3A32]">$24,850.00</div>
          <span className="text-[10px] font-serif-museum text-[#3F3A32]/80">+18.5% vs last month</span>
        </div>

        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-2 shadow-md">
          <div className="flex items-center justify-between font-mono-tag text-[#A08D6F] text-xs font-bold uppercase">
            <span>Pending Dispatches</span>
            <ShoppingBag className="w-4 h-4 text-[#A08D6F]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#3F3A32]">9</div>
          <span className="text-[10px] font-serif-museum text-[#3F3A32]/80">Ready for postal dispatch</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-4 shadow-md">
          <h3 className="font-serif-museum text-base font-bold text-[#3F3A32] flex items-center gap-2">
            <Gavel className="w-4 h-4 text-[#A08D6F]" />
            Active Auction Bidding Trays
          </h3>
          <div className="space-y-3 font-serif-museum text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
              <div>
                <span className="font-bold text-[#3F3A32] block">Ceylon King George V 15-Cents Stamp</span>
                <span className="font-mono-tag text-[10px] text-[#A08D6F]">Highest Bid: $95.00 (3 bids)</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#D8DCC8] border border-[#8C9B7E] font-mono-tag text-xs font-bold text-[#3F3A32]">2d 04h left</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
              <div>
                <span className="font-bold text-[#3F3A32] block">Tanganyika 5 Shillings Banknote</span>
                <span className="font-mono-tag text-[10px] text-[#A08D6F]">Highest Bid: $58.00 (6 bids)</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#D8DCC8] border border-[#8C9B7E] font-mono-tag text-xs font-bold text-[#3F3A32]">8h 12m left</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-4 shadow-md">
          <h3 className="font-serif-museum text-base font-bold text-[#3F3A32] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#A08D6F]" />
            Recent Orders &amp; Dispatches
          </h3>
          <div className="space-y-3 font-serif-museum text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
              <div>
                <span className="font-bold text-[#3F3A32] block">Japan Mount Fuji 24 Yen Stamp</span>
                <span className="font-mono-tag text-[10px] text-[#A08D6F]">Buyer: collector_tokyo@mail.com</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono-tag font-bold bg-[#D8DCC8] border border-[#8C9B7E] text-[#3F3A32]">Paid ($42.00)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
