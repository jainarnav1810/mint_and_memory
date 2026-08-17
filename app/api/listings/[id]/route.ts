import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, images:listing_images(*), bids(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ listing: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
