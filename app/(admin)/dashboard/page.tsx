import React from 'react';
import { Award, DollarSign, Gavel, Layers, PlusCircle, ShoppingBag, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-amber-400 block">Seller Admin Panel</span>
          <h1 className="text-3xl font-extrabold text-zinc-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-400" />
            Inventory & Auction Dashboard
          </h1>
        </div>

        <button
          onClick={() => handleNav('/admin/listings/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Catalog Items</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">1,702</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">+14 added this week</span>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Active Auctions</span>
            <Gavel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">128</div>
          <span className="text-[10px] text-amber-300">24 ending in 24 hours</span>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">$24,850.00</div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">+18.5% vs last month</span>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pending Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">9</div>
          <span className="text-[10px] text-zinc-400">Ready for dispatch</span>
        </div>
      </div>

      {/* Admin Quick Actions & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-amber-400" />
            Active Auction Bidding Status
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div>
                <span className="font-semibold text-zinc-200 block">Ceylon King George V 15-Cents Stamp</span>
                <span className="text-zinc-500">Highest Bid: $95.00 (3 bids)</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono">2d 04h left</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div>
                <span className="font-semibold text-zinc-200 block">Tanganyika 5 Shillings Banknote</span>
                <span className="text-zinc-500">Highest Bid: $58.00 (6 bids)</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 font-mono">8h 12m left</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Recent Orders & Dispatch
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <div>
                <span className="font-semibold text-zinc-200 block">Japan Mount Fuji 24 Yen Stamp</span>
                <span className="text-zinc-500">Buyer: collector_tokyo@mail.com</span>
              </div>
              <span className="px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400">Paid ($42.00)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
