'use client';

import React, { useState } from 'react';
import type { Listing } from '@/types/listing';
import { PLACEHOLDER_IMAGE, resolveImageUrl } from '@/lib/images';
import { HingeCorner } from './svg/hinge-corner';
import { SpecimenTag } from './svg/specimen-tag';

interface SpecimenGalleryProps {
  listing: Listing;
}

export const SpecimenGallery: React.FC<SpecimenGalleryProps> = ({ listing }) => {
  const images =
    listing.images && listing.images.length > 0
      ? listing.images.map((img) => resolveImageUrl(img.storage_path))
      : [PLACEHOLDER_IMAGE];

  const [selectedIdx, setSelectedIdx] = useState(0);
  const countryCode = (listing.country_of_origin || 'GLO').slice(0, 3).toUpperCase();

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full rounded-lg bg-[#EDE0D4] border-2 border-[#A08D6F] overflow-hidden p-3 shadow-xl">
        <HingeCorner position="top-left" />
        <HingeCorner position="top-right" />
        <HingeCorner position="bottom-left" />
        <HingeCorner position="bottom-right" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[selectedIdx]}
          alt={listing.title}
          className="w-full h-full object-cover rounded border border-[#A08D6F]/40"
        />

        <div className="absolute top-5 left-5">
          <SpecimenTag
            countryCode={countryCode}
            year={listing.year_issued || 'CIRC'}
            catalogNo={listing.id.slice(0, 4).toUpperCase()}
            type={listing.listing_type}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 flex-wrap">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              onClick={() => setSelectedIdx(idx)}
              aria-label={`View image ${idx + 1} of ${images.length}`}
              aria-current={selectedIdx === idx}
              className={`relative aspect-square w-20 rounded border-2 transition-all ${
                selectedIdx === idx
                  ? 'border-[#3F3A32] scale-105 shadow-md'
                  : 'border-[#A08D6F]/40 opacity-70 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${listing.title} — view ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
