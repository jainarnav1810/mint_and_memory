import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { Listing } from '@/types/listing';

// Initial sample mock listings for fallback when DB is offline
const MOCK_LISTINGS: Listing[] = [
  {
    id: 'ceylon-king-george',
    title: 'Ceylon, King George V 15-Cents Stamp',
    description: 'A rare 1921 King George V stamp from Ceylon with distinct deep blue ink on watermarked paper.',
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
    description: 'Issued in 1961 by East African Currency Board in Dar es Salaam during independence transition.',
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
    title: 'Japan, Mount Fuji 24 Yen Airmail Stamp',
    description: 'Postwar airmail issue depicting Mount Fuji over Tokyo bay, unhinged mint condition.',
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
    title: 'British Gold Sovereign Coin 1889',
    description: 'Queen Victoria Jubilee Head mint edition 22k gold sovereign coin.',
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
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const country = searchParams.get('country');
  const type = searchParams.get('type');
  const search = searchParams.get('search')?.toLowerCase().trim();

  try {
    let query = supabase.from('listings').select('*, images:listing_images(*)');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (country) {
      query = query.ilike('country_of_origin', `%${country}%`);
    }
    if (type && type !== 'all') {
      query = query.eq('listing_type', type);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Filter mock data when Supabase connection is not present
      let results = [...MOCK_LISTINGS];
      if (category && category !== 'all') results = results.filter((item) => item.category === category);
      if (type && type !== 'all') results = results.filter((item) => item.listing_type === type);
      if (country) results = results.filter((item) => item.country_of_origin.toLowerCase().includes(country.toLowerCase()));
      if (search) results = results.filter((item) => `${item.title} ${item.country_of_origin} ${item.description}`.toLowerCase().includes(search));

      return NextResponse.json({ listings: results, isMock: true });
    }

    return NextResponse.json({ listings: data, isMock: false });
  } catch (err) {
    return NextResponse.json({ listings: MOCK_LISTINGS, isMock: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('listings').insert([body]).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ listing: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
