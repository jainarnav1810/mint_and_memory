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
