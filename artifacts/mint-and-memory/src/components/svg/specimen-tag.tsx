import React from 'react';

interface SpecimenTagProps {
  countryCode: string;
  year: string | number;
  catalogNo: string;
  type: 'auction' | 'fixed';
}

export const SpecimenTag: React.FC<SpecimenTagProps> = ({ countryCode, year, catalogNo, type }) => {
  const isAuction = type === 'auction';
  const tagBg = isAuction ? 'bg-[#D8DCC8]' : 'bg-[#EDE0D4]'; // Pastel Moss for Auction, Pale Bone for Fixed
  const tagBorder = isAuction ? 'border-[#8C9B7E]' : 'border-[#C8B8A6]';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border ${tagBg} ${tagBorder} shadow-sm text-[#3F3A32] font-mono-tag text-[10px] tracking-wider font-semibold uppercase`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#A08D6F]/60 border border-[#3F3A32]/30 flex-shrink-0" />
      <span>{countryCode}</span>
      <span className="text-[#A08D6F]">·</span>
      <span>{year}</span>
      <span className="text-[#A08D6F]">·</span>
      <span>NO. {catalogNo}</span>
    </div>
  );
};
