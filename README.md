# KBJ Collectibles

A global marketplace for philatelic and numismatic collectibles: stamps, coins, banknotes, telephone cards, and antiques. It combines fixed-price listings with timed auctions, aimed at international buyers and sellers.

Live at: https://kbjcollectibles.com

## Tech Stack

- **Framework:** Next.js, deployed on Vercel
- **Backend:** Supabase (Postgres, Auth, Storage) with Row Level Security on all tables
- **Payments:** Razorpay

## Features

- Fixed-price listings and auctions with bidding
- Cart and order flow
- Category-aware listings (stamps, coins, banknotes, phonecards, antiques)
- Filterable attributes: format, condition, rarity tier, era, and category-specific data (e.g. coin grade, banknote signature)
- Supabase Auth with per-user profiles

## Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profile data |
| `listings` | Items for sale or auction |
| `listing_images` | Images attached to listings |
| `carts` / `cart_items` | Shopping cart |
| `bids` | Auction bids |
| `orders` | Completed orders |

Category-specific data lives in a JSONB `attributes` column on `listings`. `price_tier` is a generated column.

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- Razorpay account (test keys are fine for development)

### Setup

```bash
git clone https://github.com/<your-username>/mint_and_memory.git
cd mint_and_memory
npm install
```

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> Never commit `.env.local` or any real keys. Rotate immediately if a key is ever exposed.

Run the SQL migrations in the Supabase SQL Editor, one snippet at a time, in order. Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Project Structure

```
app/            Next.js routes and pages
components/     Shared UI components
lib/            Supabase client and helpers
```

(Adjust to match the actual folder layout.)

## Known Issues

- Race condition in the auction-closing route can cause double orders. Fix this before running the auction closer at high frequency.
- Vercel Hobby limits cron frequency. A GitHub Actions workflow is the planned workaround for 15-minute auction closing.

## Roadmap

- Fix the auction-closing race condition
- Custom domain email (contact@ / hello@kbjcollectibles.com)
- Shopify for fixed-price listings, with the custom stack handling auctions
- Multichannel selling (eBay, Amazon, Flipkart)
- Stripe for international payments

## Compliance Notes (India)

GST registration, IEC from DGFT, and FEMA/RBI compliance apply to international sales. Items over 100 years old (including coins) need ASI licensing under the Antiquities and Art Treasures Act, 1972 before export.

## Contributing

1. Branch off `main` (active work happens on `supabase-integration`)
2. Commit your changes
3. Open a pull request

## License

All rights reserved © KBJ Collectibles.
