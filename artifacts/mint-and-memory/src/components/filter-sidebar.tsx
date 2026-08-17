import React from 'react';
import { CollectibleCategory, ListingType } from '../types/listing';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface FilterSidebarProps {
  category: CollectibleCategory | 'all';
  setCategory: (c: CollectibleCategory | 'all') => void;
  listingType: ListingType | 'all';
  setListingType: (t: ListingType | 'all') => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: any) => void;
  onReset: () => void;
}

const COUNTRIES = ['All Countries', 'Ceylon', 'Tanganyika', 'Japan', 'United Kingdom', 'India', 'United States'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  setCategory,
  listingType,
  setListingType,
  selectedCountry,
  setSelectedCountry,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  onReset,
}) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6 rounded-xl bg-[#EDE0D4]/90 border-2 border-[#A08D6F] p-5 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#A08D6F]/40">
        <div className="flex items-center gap-2 font-mono-tag font-bold text-xs uppercase tracking-wider text-[#3F3A32]">
          <Filter className="w-4 h-4 text-[#A08D6F]" />
          <span>Specimen Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 font-mono-tag text-xs text-[#A08D6F] hover:text-[#3F3A32] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono-tag font-semibold text-[#A08D6F] uppercase tracking-wider block">
          Search Keywords
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A08D6F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stamps, origin, era..."
            className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] pl-9 pr-4 py-2 text-xs font-serif-museum text-[#3F3A32] placeholder-[#A08D6F]/60 focus:border-[#3F3A32] focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono-tag font-semibold text-[#A08D6F] uppercase tracking-wider block">
          Category
        </label>
        <div className="grid grid-cols-2 gap-2 font-mono-tag">
          {(['all', 'stamp', 'coin', 'currency'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded text-xs font-bold uppercase border transition-all text-center ${
                category === cat
                  ? 'bg-[#A08D6F] text-[#F5F0E6] border-[#3F3A32] shadow-sm'
                  : 'bg-[#F5F0E6] text-[#3F3A32] border-[#A08D6F]/50 hover:bg-[#D8DCC8]'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono-tag font-semibold text-[#A08D6F] uppercase tracking-wider block">
          Sale Mechanism
        </label>
        <div className="flex rounded bg-[#F5F0E6] border border-[#A08D6F] p-1 font-mono-tag">
          {(['all', 'auction', 'fixed'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setListingType(type)}
              className={`flex-1 py-1.5 rounded text-xs uppercase font-bold transition-all ${
                listingType === type
                  ? 'bg-[#A08D6F] text-[#F5F0E6] shadow-sm'
                  : 'text-[#3F3A32] hover:text-[#A08D6F]'
              }`}
            >
              {type === 'all' ? 'All' : type === 'fixed' ? 'Fixed' : 'Auction'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono-tag font-semibold text-[#A08D6F] uppercase tracking-wider block">
          Country of Origin
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2 text-xs font-serif-museum text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none transition-colors"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c === 'All Countries' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono-tag font-semibold text-[#A08D6F] uppercase tracking-wider block">
          Sort Order
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded border border-[#A08D6F] bg-[#F5F0E6] px-3 py-2 text-xs font-serif-museum text-[#3F3A32] focus:border-[#3F3A32] focus:outline-none transition-colors"
        >
          <option value="ending_soonest">Ending Soonest (Auctions)</option>
          <option value="newest">Newest Additions</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </aside>
  );
};
