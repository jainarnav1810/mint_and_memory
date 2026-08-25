import { NextResponse, type NextRequest } from 'next/server';

import { createClient } from '@/lib/supabase/server';

// Next.js 15 hands route params in as a Promise.
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('listings')
    .select('*, images:listing_images(*), bids(id, amount, created_at)')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  return NextResponse.json({ listing: data });
}
