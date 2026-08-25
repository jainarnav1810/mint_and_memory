import type { Metadata } from 'next';

import { NewListingForm } from '@/components/new-listing-form';

export const metadata: Metadata = {
  title: 'Catalog New Specimen — Mint & Memory',
};

export default function NewListingPage() {
  return <NewListingForm />;
}
