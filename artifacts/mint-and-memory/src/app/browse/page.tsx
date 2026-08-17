import React, { useEffect, useState } from 'react';
import { FilterSidebar } from '@/components/filter-sidebar';
import { SpecimenCard } from '@/components/specimen-card';
import { CollectibleCategory, Listing, ListingType } from '@/types/listing';
import { supabase } from '@/lib/supabase/client';
import { Layers, SlidersHorizontal } from 'lucide-react';

const MOCK_CATALOG: Listing[] = [
  {
    id: 'ceylon-king-george',
    title: 'Ceylon King George V 15-Cents Stamp',
    description: 'Extremely crisp 1921 King George V definitive stamp from Ceylon.',
    category: 'stamp',
    country_of_origin: 'Ceylon',
    year_issued: 1921,
    condition: 'Extremely Fine',
    denomination: '15 Cents',
    listing_type: 'auction',
    starting_bid: 75.0,
    current_highest_bid: 95.0,
    reserve_price: 120.0,
    currency: 'USD',
    auction_start: new Date(Date.now() - 86400000 * 2).toISOString(),
    auction_end: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '1', listing_id: 'ceylon-king-george', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'tanganyika-note',
    title: 'Tanganyika 5 Shillings Banknote',
    description: 'Historic 1961 East African Currency Board banknote issued in Dar es Salaam.',
    category: 'currency',
    country_of_origin: 'Tanganyika',
    year_issued: 1961,
    condition: 'Uncirculated',
    denomination: '5 Shillings',
    listing_type: 'auction',
    starting_bid: 45.0,
    current_highest_bid: 58.0,
    reserve_price: 60.0,
    currency: 'USD',
    auction_start: new Date(Date.now() - 86400000).toISOString(),
    auction_end: new Date(Date.now() + 3600000 * 8).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '2', listing_id: 'tanganyika-note', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'japan-fuji',
    title: 'Japan Mount Fuji 24 Yen Airmail Stamp',
    description: 'Vibrant 1952 postwar Japanese airmail stamp depicting Mount Fuji.',
    category: 'stamp',
    country_of_origin: 'Japan',
    year_issued: 1952,
    condition: 'Mint',
    denomination: '24 Yen',
    listing_type: 'fixed',
    fixed_price: 42.0,
    currency: 'USD',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '3', listing_id: 'japan-fuji', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'uk-sovereign-1889',
    title: 'British Sovereign Gold Coin 1889',
    description: 'Stunning 1889 British Gold Sovereign minted under Queen Victoria.',
    category: 'coin',
    country_of_origin: 'United Kingdom',
    year_issued: 1889,
    condition: 'Proof',
    denomination: '1 Sovereign',
    listing_type: 'auction',
    starting_bid: 520.0,
    current_highest_bid: 580.0,
    reserve_price: 650.0,
    currency: 'USD',
    auction_start: new Date(Date.now() - 86400000 * 3).toISOString(),
    auction_end: new Date(Date.now() + 86400000 * 1).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '4', listing_id: 'uk-sovereign-1889', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'india-rupee-1918',
    title: 'India 1 Rupee George V Silver Coin',
    description: '1918 Imperial British India 1 Rupee silver coin minted in Bombay.',
    category: 'coin',
    country_of_origin: 'India',
    year_issued: 1918,
    condition: 'Fine',
    denomination: '1 Rupee',
    listing_type: 'fixed',
    fixed_price: 35.0,
    currency: 'USD',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '5', listing_id: 'india-rupee-1918', storage_path: '/archive-desk.jpg', display_order: 0, is_primary: true }],
  },
  {
    id: 'us-banknote-1934',
    title: 'United States 1934 $10 Silver Certificate',
    description: 'Famous Blue Seal 1934 Alexander Hamilton Silver Certificate banknote.',
    category: 'currency',
    country_of_origin: 'United States',
    year_issued: 1934,
    condition: 'Extremely Fine',
    denomination: '$10',
    listing_type: 'fixed',
    fixed_price: 110.0,
    currency: 'USD',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    images: [{ id: '6', listing_id: 'us-banknote-1934', storage_path: '/world-archive.jpg', display_order: 0, is_primary: true }],
  },
];

export default function BrowsePage({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [category, setCategory] = useState<CollectibleCategory | 'all'>('all');
  const [listingType, setListingType] = useState<ListingType | 'all'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('ending_soonest');

  const [listings, setListings] = useState<Listing[]>(MOCK_CATALOG);

  // Fetch live Supabase listings if available
  useEffect(() => {
    async function loadLiveListings() {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*, listing_images(*)');

        if (!error && data && data.length > 0) {
          const formatted: Listing[] = data.map((item: any) => ({
            ...item,
            images: item.listing_images || [],
          }));
          setListings(formatted);
        }
      } catch (err) {
        console.warn('Using local catalog cache:', err);
      }
    }
    loadLiveListings();
  }, []);

  useEffect(() => {
    let filtered = listings.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (listingType !== 'all' && item.listing_type !== listingType) return false;
      if (selectedCountry && !item.country_of_origin.toLowerCase().includes(selectedCountry.toLowerCase())) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullText = `${item.title} ${item.country_of_origin} ${item.description} ${item.denomination}`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }
      return true;
    });

    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => (a.fixed_price || a.starting_bid || 0) - (b.fixed_price || b.starting_bid || 0));
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => (b.fixed_price || b.starting_bid || 0) - (a.fixed_price || a.starting_bid || 0));
    } else if (sortBy === 'ending_soonest') {
      filtered.sort((a, b) => {
        if (!a.auction_end) return 1;
        if (!b.auction_end) return -1;
        return new Date(a.auction_end).getTime() - new Date(b.auction_end).getTime();
      });
    }

    setListings(filtered);
  }, [category, listingType, selectedCountry, searchQuery, sortBy]);

  const handleReset = () => {
    setCategory('all');
    setListingType('all');
    setSelectedCountry('');
    setSearchQuery('');
    setSortBy('ending_soonest');
  };

  const handleNav = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

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

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-[#EDE0D4] border border-[#A08D6F] font-mono-tag text-xs text-[#3F3A32]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#A08D6F]" />
          <span>Showing {listings.length} Specimens</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar
          category={category}
          setCategory={setCategory}
          listingType={listingType}
          setListingType={setListingType}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleReset}
        />

        <div className="flex-1">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-[#EDE0D4]/60 border-2 border-dashed border-[#A08D6F] p-12 text-center space-y-4">
              <div className="p-4 rounded-full bg-[#EDE0D4] text-[#A08D6F]">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="font-serif-museum text-base font-bold text-[#3F3A32]">No specimens match your active filters</h3>
              <p className="font-serif-museum text-xs text-[#3F3A32]/70 max-w-sm">
                Try widening your country selection, clearing search keywords, or switching categories.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded bg-[#A08D6F] text-[#F5F0E6] font-mono-tag text-xs font-bold uppercase shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <SpecimenCard
                  key={item.id}
                  listing={item}
                  onSelect={(l) => handleNav(`/item/${l.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
