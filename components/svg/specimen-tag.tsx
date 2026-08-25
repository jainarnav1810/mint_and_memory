import React from 'react';
import type { ListingType } from '@/types/listing';

interface SpecimenTagProps {
  countryCode: string;
  year: string | number;
  catalogNo: string;
  type: ListingType;
}

/** The hand-written museum label pinned beside each specimen. */
export const SpecimenTag: React.FC<SpecimenTagProps> = ({ countryCode, year, catalogNo, type }) => {
  const isAuction = type === 'auction';
  // Pastel moss for auction lots, pale bone for fixed-price stock.
  const tagBg = isAuction ? 'bg-[#D8DCC8]' : 'bg-[#EDE0D4]';
  const tagBorder = isAuction ? 'border-[#8C9B7E]' : 'border-[#C8B8A6]';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border ${tagBg} ${tagBorder} shadow-sm text-[#3F3A32] font-mono-tag text-[10px] tracking-wider font-semibold uppercase`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#A08D6F]/60 border border-[#3F3A32]/30 flex-shrink-0" />
      <span>{countryCode}</span>
      <span className="text-[#A08D6F]">·</span>
      <span>{year}</span>
      <span className="text-[#A08D6F]">·</span>
      <span>NO. {catalogNo}</span>
    </div>
  );
};
