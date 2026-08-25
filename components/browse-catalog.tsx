'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FilterSidebar, type SortOption } from './filter-sidebar';
import { SpecimenCard } from './specimen-card';
import type { CollectibleCategory, Listing, ListingType } from '@/types/listing';
import { Layers, SlidersHorizontal } from 'lucide-react';

const CATEGORIES: readonly string[] = ['stamp', 'coin', 'currency'];
const TYPES: readonly string[] = ['auction', 'fixed'];

interface BrowseCatalogProps {
  /** Every active listing, fetched on the server. Filtering happens here. */
  listings: Listing[];
}

export const BrowseCatalog: React.FC<BrowseCatalogProps> = ({ listings }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Category and sale mechanism live in the URL so the navbar trays, deep links,
  // and this sidebar all agree on one source of truth.
  const rawCategory = searchParams.get('category');
  const rawType = searchParams.get('type');
  const category = (CATEGORIES.includes(rawCategory ?? '') ? rawCategory : 'all') as
    | CollectibleCategory
    | 'all';
  const listingType = (TYPES.includes(rawType ?? '') ? rawType : 'all') as ListingType | 'all';

  // Ephemeral UI state — no reason to round-trip these through the server.
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('ending_soonest');

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all') params.delete(key);
      else params.set(key, value);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const countries = useMemo(
    () =>
      Array.from(new Set(listings.map((l) => l.country_of_origin).filter(Boolean))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [listings],
  );

  // Derived, never written back into `listings` — filtering must stay reversible.
  const visible = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = listings.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (listingType !== 'all' && item.listing_type !== listingType) return false;
      if (selectedCountry && item.country_of_origin !== selectedCountry) return false;
      if (query) {
        const haystack = [item.title, item.country_of_origin, item.description, item.denomination]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const priceOf = (l: Listing) =>
      l.listing_type === 'auction'
        ? (l.current_highest_bid ?? l.starting_bid ?? 0)
        : (l.fixed_price ?? 0);

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case 'price_desc':
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'ending_soonest':
        // Auctions first, soonest end date leading; fixed-price stock trails.
        sorted.sort((a, b) => {
          if (!a.auction_end && !b.auction_end) return 0;
          if (!a.auction_end) return 1;
          if (!b.auction_end) return -1;
          return new Date(a.auction_end).getTime() - new Date(b.auction_end).getTime();
        });
        break;
    }
    return sorted;
  }, [listings, category, listingType, selectedCountry, searchQuery, sortBy]);

  const handleReset = () => {
    setSelectedCountry('');
    setSearchQuery('');
    setSortBy('ending_soonest');
    router.replace(pathname, { scroll: false });
  };

  const catalogEmpty = listings.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#A08D6F]">
        <div>
          <span className="font-mono-tag text-xs uppercase font-bold tracking-widest text-[#A08D6F] block">
            Catalog Collection Archive
          </span>
          <h1 className="font-serif-museum text-3xl font-extrabold text-[#3F3A32] flex items-center gap-2 mt-1">
            <Layers className="w-6 h-6 text-[#A08D6F]" />
            Browse Collectible Inventory
          </h1>
          <p className="font-serif-museum text-xs text-[#3F3A32]/80 mt-1">
            Filter through verified stamps, coins, and currency notes from global mints and archives.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#EDE0D4] border border-[#A08D6F] font-mono-tag text-xs text-[#3F3A32] self-start sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#A08D6F]" />
          <span>
            Showing {visible.length} of {listings.length} Specimens
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          category={category}
          setCategory={(c) => setParam('category', c)}
          listingType={listingType}
          setListingType={(t) => setParam('type', t)}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          countries={countries}
          onReset={handleReset}
        />

        <div className="flex-1">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#EDE0D4]/60 border-2 border-dashed border-[#A08D6F] p-12 text-center space-y-4">
              <div className="p-4 rounded-full bg-[#EDE0D4] text-[#A08D6F]">
                <Layers className="w-8 h-8" />
              </div>

              {catalogEmpty ? (
                <>
                  <h3 className="font-serif-museum text-base font-bold text-[#3F3A32]">
                    The archive has no specimens yet
                  </h3>
                  <p className="font-serif-museum text-xs text-[#3F3A32]/70 max-w-sm">
                    Once a curator catalogs the first stamp, coin, or banknote it will appear in
                    this tray.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-serif-museum text-base font-bold text-[#3F3A32]">
                    No specimens match your active filters
                  </h3>
                  <p className="font-serif-museum text-xs text-[#3F3A32]/70 max-w-sm">
                    Try widening your country selection, clearing search keywords, or switching
                    categories.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded bg-[#A08D6F] text-[#F5F0E6] font-mono-tag text-xs font-bold uppercase shadow-sm"
                  >
                    Reset All Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {visible.map((item) => (
                <SpecimenCard key={item.id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
