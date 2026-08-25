import { HomeArchive } from '@/components/home-archive';
import { getActiveListings } from '@/lib/queries';
import type { CollectibleCategory, Listing } from '@/types/listing';

// Auction state and inventory change constantly; don't serve a stale shell.
export const revalidate = 0;

const CATEGORIES: CollectibleCategory[] = ['stamp', 'coin', 'currency'];

export default async function HomePage() {
  const listings = await getActiveListings();

  const listingsByCategory = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = listings.filter((l) => l.category === category);
      return acc;
    },
    {} as Record<CollectibleCategory, Listing[]>,
  );

  const counts = CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = listingsByCategory[category].length;
      return acc;
    },
    {} as Record<CollectibleCategory, number>,
  );

  return <HomeArchive listingsByCategory={listingsByCategory} counts={counts} />;
}
