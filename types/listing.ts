export type CollectibleCategory = 'stamp' | 'coin' | 'currency';
export type ListingType = 'fixed' | 'auction';
export type ListingStatus = 'active' | 'sold' | 'closed' | 'draft' | 'cancelled';
export type ItemCondition = 'Mint' | 'Used' | 'Uncirculated' | 'Fine' | 'Extremely Fine' | 'Proof';

export interface ListingImage {
  id: string;
  listing_id: string;
  storage_path: string;
  display_order: number;
  is_primary: boolean;
  created_at?: string;
}

export interface Listing {
  id: string;
  seller_id?: string | null;
  title: string;
  description: string;
  category: CollectibleCategory;
  country_of_origin: string;
  year_issued?: number | null;
  condition?: ItemCondition | null;
  denomination?: string | null;
  listing_type: ListingType;
  fixed_price?: number | null;
  starting_bid?: number | null;
  reserve_price?: number | null;
  current_highest_bid?: number | null;
  currency: string;
  auction_start?: string | null;
  auction_end?: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  images?: ListingImage[];
}

export interface FilterOptions {
  category?: CollectibleCategory | 'all';
  country?: string;
  listingType?: ListingType | 'all';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'ending_soonest';
}
