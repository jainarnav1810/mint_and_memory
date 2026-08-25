import { z } from 'zod';

export const bidSchema = z.object({
  listing_id: z.string().uuid({ message: 'Invalid listing ID' }),
  amount: z.number().positive({ message: 'Bid amount must be greater than 0' }),
});

export const newListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['stamp', 'coin', 'currency']),
  country_of_origin: z.string().min(2, 'Country of origin is required'),
  year_issued: z.number().optional().nullable(),
  condition: z.enum(['Mint', 'Used', 'Uncirculated', 'Fine', 'Extremely Fine', 'Proof']).optional().nullable(),
  denomination: z.string().optional().nullable(),
  listing_type: z.enum(['fixed', 'auction']),
  fixed_price: z.number().positive().optional().nullable(),
  starting_bid: z.number().positive().optional().nullable(),
  reserve_price: z.number().positive().optional().nullable(),
  currency: z.string().default('USD'),
  auction_duration_days: z.number().min(1).max(30).optional(),
  /** Storage paths (or public URLs) of already-uploaded photos, in display order. */
  images: z.array(z.string().min(1)).max(8).optional(),
})
  .refine((v) => v.listing_type !== 'fixed' || (v.fixed_price ?? 0) > 0, {
    message: 'A fixed-price listing needs a price',
    path: ['fixed_price'],
  })
  .refine((v) => v.listing_type !== 'auction' || (v.starting_bid ?? 0) > 0, {
    message: 'An auction needs a starting bid',
    path: ['starting_bid'],
  })
  .refine(
    (v) =>
      v.listing_type !== 'auction' ||
      v.reserve_price == null ||
      v.reserve_price >= (v.starting_bid ?? 0),
    {
      message: 'Reserve price cannot be below the starting bid',
      path: ['reserve_price'],
    },
  );

export const credentialsSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const checkoutSchema = z.object({
  listing_id: z.string().uuid(),
  shipping_address: z.object({
    fullName: z.string().min(2, 'Full name required'),
    addressLine1: z.string().min(5, 'Address line 1 required'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'City required'),
    state: z.string().min(2, 'State required'),
    postalCode: z.string().min(3, 'Postal code required'),
    country: z.string().min(2, 'Country required'),
  }),
});

export type BidInput = z.infer<typeof bidSchema>;
export type NewListingInput = z.infer<typeof newListingSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CredentialsInput = z.infer<typeof credentialsSchema>;

/** First human-readable message from a failed `safeParse`. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Invalid request';
}
