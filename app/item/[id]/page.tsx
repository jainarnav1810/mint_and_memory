import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

import { AuctionTimer } from '@/components/auction-timer';
import { BidForm } from '@/components/bid-form';
import { BuyNowPanel } from '@/components/buy-now-panel';
import { SpecimenGallery } from '@/components/specimen-gallery';
import { getListingById } from '@/lib/queries';
import { getUser } from '@/lib/supabase/server';

// Bids and auction clocks move constantly — never serve this from a static cache.
export const revalidate = 0;

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) return { title: 'Specimen Not Found — Mint & Memory' };

  return {
    title: `${listing.title} — Mint & Memory`,
    description: listing.description?.slice(0, 160) ?? undefined,
  };
}

const STATUS_COPY: Record<string, string> = {
  sold: 'This specimen has been acquired and is no longer available.',
  closed: 'This auction has closed.',
  cancelled: 'This listing was withdrawn from the archive.',
  draft: 'This listing is not yet published.',
};

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { id } = await params;
  const [listing, user] = await Promise.all([getListingById(id), getUser()]);

  if (!listing) notFound();

  const isAuction = listing.listing_type === 'auction';
  const isOpen = listing.status === 'active';
  const specs: { label: string; value: React.ReactNode }[] = [
    { label: 'Country of Origin', value: listing.country_of_origin },
    { label: 'Year Issued', value: listing.year_issued || 'Undated' },
    { label: 'Grade & Condition', value: listing.condition || 'Ungraded' },
    { label: 'Face Denomination', value: listing.denomination || 'N/A' },
    { label: 'Sale Mechanism', value: <span className="capitalize">{listing.listing_type}</span> },
    {
      label: 'Verification',
      value: (
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8C9B7E]" /> Museum Verified
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/browse"
        className="inline-flex items-center gap-2 text-xs font-mono-tag font-bold text-[#A08D6F] hover:text-[#3F3A32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Specimen Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-4">
          <SpecimenGallery listing={listing} />

          <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 space-y-4 shadow-md">
            <h3 className="font-mono-tag text-xs font-bold text-[#3F3A32] uppercase tracking-wider">
              Specimen Specifications &amp; Provenance Notes
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-serif-museum">
              {specs.map(({ label, value }) => (
                <div key={label} className="p-3 rounded bg-[#F5F0E6] border border-[#A08D6F]/40">
                  <span className="font-mono-tag text-[10px] text-[#A08D6F] block uppercase">
                    {label}
                  </span>
                  <span className="font-bold text-[#3F3A32]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="font-serif-museum text-3xl font-extrabold text-[#3F3A32] leading-tight">
              {listing.title}
            </h1>
            {listing.description && (
              <p className="font-serif-museum text-sm text-[#3F3A32]/85 mt-3 leading-relaxed">
                {listing.description}
              </p>
            )}
          </div>

          {isAuction && listing.auction_end && (
            <div className="p-4 rounded-xl bg-[#D8DCC8] border border-[#8C9B7E]">
              <AuctionTimer endTime={listing.auction_end} />
            </div>
          )}

          {!isOpen ? (
            <div className="rounded-xl bg-[#EDE0D4] border-2 border-[#A08D6F] p-6 shadow-lg space-y-2">
              <span className="font-mono-tag text-xs uppercase font-bold tracking-wider text-[#A08D6F] block">
                Archive Status — {listing.status}
              </span>
              <p className="font-serif-museum text-sm text-[#3F3A32]/85">
                {STATUS_COPY[listing.status] ?? 'This specimen is not currently available.'}
              </p>
            </div>
          ) : isAuction ? (
            <BidForm listing={listing} isAuthenticated={Boolean(user)} />
          ) : (
            <BuyNowPanel listing={listing} isAuthenticated={Boolean(user)} />
          )}
        </div>
      </div>
    </div>
  );
}
