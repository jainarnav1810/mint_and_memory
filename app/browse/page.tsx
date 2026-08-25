import { Suspense } from 'react';
import type { Metadata } from 'next';
import { BrowseCatalog } from '@/components/browse-catalog';
import { getActiveListings } from '@/lib/queries';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Browse the Catalog — Mint & Memory',
  description:
    'Filter verified stamps, coins, and paper currency specimens by category, origin, and sale mechanism.',
};

export default async function BrowsePage() {
  const listings = await getActiveListings();

  return (
    // BrowseCatalog reads filters from the URL via useSearchParams.
    <Suspense fallback={null}>
      <BrowseCatalog listings={listings} />
    </Suspense>
  );
}
