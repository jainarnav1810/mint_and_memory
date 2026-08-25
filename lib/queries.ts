import { createClient } from '@/lib/supabase/server';
import type { CollectibleCategory, Listing, ListingType } from '@/types/listing';

/**
 * Shared read queries for server components.
 *
 * These run through the request-scoped (RLS-enforced) client, so they return
 * exactly what the current visitor is allowed to see. Reads of `listings` and
 * `listing_images` are public.
 */

const LISTING_SELECT = '*, images:listing_images(*)';

export interface ListingFilters {
  category?: CollectibleCategory | 'all';
  listingType?: ListingType | 'all';
  country?: string;
  search?: string;
  limit?: number;
}

/** Sort images so the primary one is first, matching what the UI expects. */
function normalise(row: Record<string, unknown>): Listing {
  const listing = row as unknown as Listing;
  const images = [...(listing.images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });
  return { ...listing, images };
}

export async function getActiveListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.listingType && filters.listingType !== 'all') {
    query = query.eq('listing_type', filters.listingType);
  }
  if (filters.country) {
    query = query.ilike('country_of_origin', `%${filters.country}%`);
  }
  if (filters.search) {
    // PostgREST `or` takes a comma-separated filter list; commas and parens in
    // the term itself would break out of it, so strip them.
    const term = filters.search.replace(/[,()]/g, ' ').trim();
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,country_of_origin.ilike.%${term}%,denomination.ilike.%${term}%`,
      );
    }
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[queries] getActiveListings failed:', error.message);
    return [];
  }

  return (data ?? []).map(normalise);
}

export async function getListingById(id: string): Promise<Listing | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[queries] getListingById failed:', error.message);
    return null;
  }

  return data ? normalise(data) : null;
}

export interface AdminStats {
  totalListings: number;
  activeAuctions: number;
  endingSoon: number;
  paidRevenue: number;
  pendingOrders: number;
}

/** Counts for the curator dashboard. Requires an admin session under RLS. */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();
  const inADay = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const [total, auctions, soon, orders] = await Promise.all([
    supabase.from('listings').select('id', { count: 'exact', head: true }),
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('listing_type', 'auction')
      .eq('status', 'active'),
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('listing_type', 'auction')
      .eq('status', 'active')
      .lte('auction_end', inADay),
    supabase.from('orders').select('amount, payment_status'),
  ]);

  const orderRows = (orders.data ?? []) as { amount: number | null; payment_status: string }[];

  return {
    totalListings: total.count ?? 0,
    activeAuctions: auctions.count ?? 0,
    endingSoon: soon.count ?? 0,
    paidRevenue: orderRows
      .filter((o) => o.payment_status === 'paid')
      .reduce((sum, o) => sum + Number(o.amount ?? 0), 0),
    pendingOrders: orderRows.filter((o) => o.payment_status === 'pending').length,
  };
}

export interface AuctionSummary {
  id: string;
  title: string;
  current_highest_bid: number | null;
  starting_bid: number | null;
  auction_end: string | null;
  bidCount: number;
}

/** Live auctions with bid counts, newest-ending first, for the dashboard. */
export async function getActiveAuctionSummaries(limit = 5): Promise<AuctionSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select('id, title, current_highest_bid, starting_bid, auction_end, bids(id)')
    .eq('listing_type', 'auction')
    .eq('status', 'active')
    .order('auction_end', { ascending: true, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('[queries] getActiveAuctionSummaries failed:', error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const { bids, ...rest } = row as typeof row & { bids?: { id: string }[] };
    return { ...rest, bidCount: bids?.length ?? 0 } as AuctionSummary;
  });
}

export interface OrderReceipt {
  id: string;
  amount: number | null;
  currency: string | null;
  payment_status: string;
  order_status: string;
  order_type: string;
  created_at: string;
  razorpay_payment_id: string | null;
  shipping_address: Record<string, string> | null;
  listing: { id: string; title: string } | null;
}

/**
 * One order for the receipt page. RLS restricts this to the buying collector
 * (or an admin), so a guessed id returns nothing rather than someone else's
 * shipping address.
 */
export async function getOrderById(id: string): Promise<OrderReceipt | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      'id, amount, currency, payment_status, order_status, order_type, created_at, razorpay_payment_id, shipping_address, listing:listings(id, title)',
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('[queries] getOrderById failed:', error.message);
    return null;
  }
  if (!data) return null;

  const { listing, ...rest } = data as typeof data & {
    listing?: { id: string; title: string } | { id: string; title: string }[] | null;
  };

  return {
    ...rest,
    listing: Array.isArray(listing) ? (listing[0] ?? null) : (listing ?? null),
  } as OrderReceipt;
}

export interface RecentOrder {
  id: string;
  amount: number | null;
  currency: string | null;
  payment_status: string;
  order_status: string;
  created_at: string;
  listing: { title: string } | null;
}

/** Newest orders for the curator dashboard. RLS limits this to admins. */
export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(
      'id, amount, currency, payment_status, order_status, created_at, listing:listings(title)',
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[queries] getRecentOrders failed:', error.message);
    return [];
  }

  // PostgREST types an embedded to-one relation as an array.
  return (data ?? []).map((row) => {
    const { listing, ...rest } = row as typeof row & {
      listing?: { title: string } | { title: string }[] | null;
    };
    return {
      ...rest,
      listing: Array.isArray(listing) ? (listing[0] ?? null) : (listing ?? null),
    } as RecentOrder;
  });
}
