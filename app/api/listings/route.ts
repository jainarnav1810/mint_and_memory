import { NextResponse, type NextRequest } from 'next/server';

import { createClient, getSessionContext } from '@/lib/supabase/server';
import { firstIssue, newListingSchema } from '@/lib/validators';
import type { CollectibleCategory, ListingType } from '@/types/listing';

const CATEGORIES = ['stamp', 'coin', 'currency'];
const TYPES = ['auction', 'fixed'];

/** Public catalog read. Filters mirror the browse page's query string. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const listingType = searchParams.get('type');
  const country = searchParams.get('country');
  const limitParam = Number(searchParams.get('limit'));

  const supabase = await createClient();

  let query = supabase
    .from('listings')
    .select('*, images:listing_images(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (category && CATEGORIES.includes(category)) {
    query = query.eq('category', category as CollectibleCategory);
  }
  if (listingType && TYPES.includes(listingType)) {
    query = query.eq('listing_type', listingType as ListingType);
  }
  if (country) {
    query = query.ilike('country_of_origin', `%${country}%`);
  }
  query = query.limit(Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 100) : 60);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ listings: data ?? [] });
}

export async function POST(request: NextRequest) {
  const { user, isAdmin } = await getSessionContext();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to catalog a specimen' }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: 'Curator access required' }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = newListingSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: firstIssue(parsed.error) }, { status: 400 });
  }

  const { images = [], auction_duration_days, ...fields } = parsed.data;
  const supabase = await createClient();

  const isAuction = fields.listing_type === 'auction';
  const now = new Date();
  const auctionEnd = isAuction
    ? new Date(now.getTime() + (auction_duration_days ?? 7) * 24 * 60 * 60 * 1000)
    : null;

  const { data: listing, error: insertErr } = await supabase
    .from('listings')
    .insert({
      ...fields,
      seller_id: user.id,
      // Keep the money columns consistent with the chosen mechanism so a
      // fixed-price listing can never carry a stale starting bid.
      fixed_price: isAuction ? null : fields.fixed_price,
      starting_bid: isAuction ? fields.starting_bid : null,
      reserve_price: isAuction ? fields.reserve_price : null,
      current_highest_bid: null,
      auction_start: isAuction ? now.toISOString() : null,
      auction_end: auctionEnd ? auctionEnd.toISOString() : null,
      status: 'active',
    })
    .select('id')
    .single();

  if (insertErr || !listing) {
    return NextResponse.json(
      { error: insertErr?.message ?? 'Could not create the listing' },
      { status: 400 },
    );
  }

  if (images.length > 0) {
    const { error: imageErr } = await supabase.from('listing_images').insert(
      images.map((storage_path, index) => ({
        listing_id: listing.id,
        storage_path,
        display_order: index,
        is_primary: index === 0,
      })),
    );

    // The listing exists either way; report the partial failure rather than
    // letting the curator believe every plate was attached.
    if (imageErr) {
      return NextResponse.json(
        {
          listing,
          warning: `Listing created, but its images failed to attach: ${imageErr.message}`,
        },
        { status: 207 },
      );
    }
  }

  return NextResponse.json({ listing }, { status: 201 });
}
