import React from 'react';
import Link from 'next/link';
import type { Listing } from '@/types/listing';
import { primaryImageUrl } from '@/lib/images';
import { SpecimenTag } from './svg/specimen-tag';
import { HingeCorner } from './svg/hinge-corner';
import { DrawerPull } from './svg/drawer-pull';
import { Gavel, Tag } from 'lucide-react';

interface SpecimenCardProps {
  listing: Listing;
}

export const SpecimenCard: React.FC<SpecimenCardProps> = ({ listing }) => {
  const primaryImage = primaryImageUrl(listing.images);
  const isAuction = listing.listing_type === 'auction';

  const countryCode = (listing.country_of_origin || 'GLO').slice(0, 3).toUpperCase();
  const catalogNo = listing.id.slice(0, 4).toUpperCase();
  const year = listing.year_issued || 'CIRC';

  return (
    <Link
      href={`/item/${listing.id}`}
      className="group relative rounded-lg bg-[#F5F0E6] border-2 border-[#A08D6F] p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
    >
      {/* Brass hinge corners */}
      <HingeCorner position="top-left" />
      <HingeCorner position="top-right" />
      <HingeCorner position="bottom-left" />
      <HingeCorner position="bottom-right" />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-[#A08D6F]/30 pb-2">
          <SpecimenTag
            countryCode={countryCode}
            year={year}
            catalogNo={catalogNo}
            type={listing.listing_type}
          />

          <span className="font-mono-tag text-[9px] font-bold uppercase tracking-wider text-[#A08D6F]">
            {listing.category}
          </span>
        </div>

        {/* Specimen frame */}
        <div className="relative aspect-[4/3] w-full rounded border border-[#A08D6F]/40 bg-[#EDE0D4] overflow-hidden p-2 shadow-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover rounded border border-[#3F3A32]/10 transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#F5F0E6]/90 border border-[#A08D6F] text-[9px] font-mono-tag font-semibold text-[#3F3A32] shadow-sm">
            {listing.condition || 'Verified'}
          </div>
        </div>

        <div>
          <h3 className="font-serif-museum text-base font-bold text-[#3F3A32] leading-snug group-hover:text-[#8A795D] transition-colors">
            {listing.title}
          </h3>
          <p className="font-serif-museum text-xs text-[#3F3A32]/75 line-clamp-2 mt-1 leading-relaxed">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Pricing tray footer */}
      <div className="pt-3 mt-3 border-t border-[#A08D6F]/30 space-y-2">
        {isAuction ? (
          <div className="rounded p-2 bg-[#D8DCC8] border border-[#8C9B7E] flex items-center justify-between text-xs font-mono-tag">
            <div className="flex items-center gap-1.5 text-[#3F3A32]">
              <Gavel className="w-3.5 h-3.5" />
              <span>Current Bid:</span>
            </div>
            <div className="font-bold text-sm text-[#3F3A32]">
              ${(listing.current_highest_bid || listing.starting_bid || 0).toFixed(2)}
            </div>
          </div>
        ) : (
          <div className="rounded p-2 bg-[#EDE0D4] border border-[#C8B8A6] flex items-center justify-between text-xs font-mono-tag">
            <div className="flex items-center gap-1.5 text-[#3F3A32]">
              <Tag className="w-3.5 h-3.5" />
              <span>Fixed Price:</span>
            </div>
            <div className="font-bold text-sm text-[#3F3A32]">
              ${(listing.fixed_price || 0).toFixed(2)}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-1">
          <DrawerPull className="w-20 h-5" label="Inspect" />
        </div>
      </div>
    </Link>
  );
};
