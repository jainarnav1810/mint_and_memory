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
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 font-semibold text-zinc-100">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Catalog Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search Keywords</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stamps, origin, era..."
            className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Collectible Category */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {(['all', 'stamp', 'coin', 'currency'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize border transition-all text-center ${
                category === cat
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listing Format (Auction vs Fixed Price) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sale Type</label>
        <div className="flex rounded-xl bg-zinc-950/80 border border-zinc-800 p-1">
          {(['all', 'auction', 'fixed'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setListingType(type)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                listingType === type
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {type === 'all' ? 'All' : type === 'fixed' ? 'Fixed Price' : 'Auction'}
            </button>
          ))}
        </div>
      </div>

      {/* Country of Origin Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Country of Origin</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none transition-colors"
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c === 'All Countries' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sort Order</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-xl bg-zinc-950/80 border border-zinc-800 px-3 py-2 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none transition-colors"
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
