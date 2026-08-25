import type { Metadata } from 'next';
import Link from 'next/link';
import { DollarSign, Gavel, Layers, PlusCircle, ShoppingBag } from 'lucide-react';

import { AuctionTimer } from '@/components/auction-timer';
import { getActiveAuctionSummaries, getAdminStats, getRecentOrders } from '@/lib/queries';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Curator Dashboard — Mint & Memory',
};

const PAYMENT_TONE: Record<string, string> = {
  paid: 'bg-[#D8DCC8] border-[#8C9B7E] text-[#3F3A32]',
  pending: 'bg-[#EDE0D4] border-[#A08D6F] text-[#3F3A32]',
  failed: 'bg-rose-50 border-rose-300 text-rose-800',
  refunded: 'bg-[#F5F0E6] border-[#A08D6F] text-[#3F3A32]/80',
};

export default async function AdminDashboardPage() {
  const [stats, auctions, orders] = await Promise.all([
    getAdminStats(),
    getActiveAuctionSummaries(),
    getRecentOrders(),
  ]);

  const cards = [
    {
      label: 'Total Specimens',
      value: stats.totalListings.toLocaleString(),
      note: 'Every catalogued entry, all statuses',
      Icon: Layers,
    },
    {
      label: 'Active Auctions',
      value: stats.activeAuctions.toLocaleString(),
      note: `${stats.endingSoon} ending within 24 hours`,
      Icon: Gavel,
    },
    {
      label: 'Sales Revenue',
      value: `$${stats.paidRevenue.toFixed(2)}`,
      note: 'Sum of orders marked paid',
      Icon: DollarSign,
    },
    {
      label: 'Pending Dispatches',
      value: stats.pendingOrders.toLocaleString(),
      note: 'Orders awaiting payment settlement',
      Icon: ShoppingBag,
    },
  ];

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

        <Link
          href="/admin/listings/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#A08D6F] hover:bg-[#8A795D] text-[#F5F0E6] font-mono-tag font-bold text-xs uppercase shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Catalog New Specimen</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, note, Icon }) => (
          <div
            key={label}
            className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-2 shadow-md"
          >
            <div className="flex items-center justify-between font-mono-tag text-[#A08D6F] text-xs font-bold uppercase">
              <span>{label}</span>
              <Icon className="w-4 h-4 text-[#A08D6F]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#3F3A32]">{value}</div>
            <span className="text-[10px] font-serif-museum text-[#3F3A32]/80 block">{note}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-4 shadow-md">
          <h3 className="font-serif-museum text-base font-bold text-[#3F3A32] flex items-center gap-2">
            <Gavel className="w-4 h-4 text-[#A08D6F]" />
            Active Auction Bidding Trays
          </h3>

          {auctions.length === 0 ? (
            <p className="font-serif-museum text-xs text-[#3F3A32]/70">
              No auctions are running. Catalog a specimen with the auction mechanism to open one.
            </p>
          ) : (
            <div className="space-y-3 font-serif-museum text-xs">
              {auctions.map((auction) => (
                <Link
                  key={auction.id}
                  href={`/item/${auction.id}`}
                  className="flex items-center justify-between gap-3 p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40 hover:border-[#A08D6F] transition-colors"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-[#3F3A32] block truncate">{auction.title}</span>
                    <span className="font-mono-tag text-[10px] text-[#A08D6F]">
                      Highest Bid: $
                      {Number(auction.current_highest_bid ?? auction.starting_bid ?? 0).toFixed(2)} (
                      {auction.bidCount} {auction.bidCount === 1 ? 'bid' : 'bids'})
                    </span>
                  </div>
                  {auction.auction_end && (
                    <span className="flex-shrink-0">
                      <AuctionTimer endTime={auction.auction_end} compact />
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-4 shadow-md">
          <h3 className="font-serif-museum text-base font-bold text-[#3F3A32] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#A08D6F]" />
            Recent Orders &amp; Dispatches
          </h3>

          {orders.length === 0 ? (
            <p className="font-serif-museum text-xs text-[#3F3A32]/70">
              No orders recorded yet. They appear here as collectors acquire specimens.
            </p>
          ) : (
            <div className="space-y-3 font-serif-museum text-xs">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between gap-3 p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-[#3F3A32] block truncate">
                      {order.listing?.title ?? 'Withdrawn specimen'}
                    </span>
                    <span className="font-mono-tag text-[10px] text-[#A08D6F]">
                      {new Date(order.created_at).toLocaleDateString()} · dispatch{' '}
                      {order.order_status}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded border font-mono-tag font-bold flex-shrink-0 capitalize ${
                      PAYMENT_TONE[order.payment_status] ?? PAYMENT_TONE.pending
                    }`}
                  >
                    {order.payment_status} (${Number(order.amount ?? 0).toFixed(2)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
