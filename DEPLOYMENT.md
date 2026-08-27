# Deploying Mint & Memory

Next.js 15 (App Router) on Vercel, backed by Supabase (Postgres + Auth + Storage),
with Razorpay for payments.

Everything in this guide has to run on your machine — the environment this code was
written in has no network access, so nothing below has been executed here.

---

## 1. Create the Supabase project

Create a **new** project at [supabase.com](https://supabase.com/dashboard). Don't reuse
`apekkgqzdyxxgmxwpngp` — its anon key was committed to this repo's git history and
should be rotated in that project's dashboard (Settings → API → "Reset anon key")
whether or not you keep using it.

From **Settings → API**, copy the project URL, the `anon` key, and the
`service_role` key.

## 2. Apply the schema

```bash
npx supabase link --project-ref <your-project-ref>
```

```bash
npx supabase db push
```

That applies all three migrations in order:

| Migration | What it does |
| --- | --- |
| `001_initial_schema.sql` | Tables, indexes, the highest-bid trigger |
| `002_auth_rls_storage.sql` | Profile trigger, `is_admin()`, hardened `place_bid`, tightened RLS, Razorpay columns |
| `003_storage.sql` | The `listing-images` bucket and its policies |

**002 is not optional.** 001 alone ships `using (true)` write policies, and since the
anon key is public by design, that means anyone could rewrite listings, forge orders,
and read every buyer's shipping address. 002 also adds the `razorpay_order_id` /
`razorpay_payment_id` columns the checkout route and webhook write to, and replaces
`place_bid` with a version that derives the bidder from `auth.uid()` instead of
trusting a parameter.

**If 003 fails** with `42501: must be owner of table objects`, that's expected on some
projects — `storage.objects` belongs to `supabase_storage_admin`, not the migration
role. 001 and 002 will have committed regardless (each file runs in its own
transaction, which is why storage is separate). Apply it through the dashboard
instead: **Storage → New bucket** named `listing-images` with *Public bucket* on, then
**Storage → Policies** → add the four rules from
[003_storage.sql](supabase/migrations/003_storage.sql).

Then verify — paste [supabase/verify.sql](supabase/verify.sql) into the SQL editor. Every
check prints its own PASS/FAIL, including an anonymous-write probe that proves RLS is
actually refusing writes. Read the **Messages/Notices** pane for the last two checks.

Optional demo listings:

```bash
npx supabase db seed
```

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` — it's git-ignored, so real keys stay out of the repo.

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | From Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public by design; RLS is the protection |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Bypasses RLS. Never prefix `NEXT_PUBLIC_` |
| `ADMIN_EMAILS` | Comma-separated. These accounts get `profiles.role = 'admin'` |
| `RAZORPAY_KEY_ID` / `_KEY_SECRET` | Test keys are fine to start |
| `RAZORPAY_WEBHOOK_SECRET` | Set in step 6 |
| `CRON_SECRET` | Any long random string, e.g. `openssl rand -hex 32` |

Without the Razorpay keys, checkout still works but runs in **mock mode** — it records
a pending order and skips the payment modal. Without `CRON_SECRET`, the auction closer
returns 503 rather than running unauthenticated.

## 4. Run it locally

```bash
npm install
```

```bash
npm run build
```

Get a clean build before deploying — it's the check that catches type errors, and it
has not been run in the environment this code was written in.

```bash
npm run dev
```

## 5. Deploy to Vercel

Push the branch, then import the repo at [vercel.com/new](https://vercel.com/new).
Root directory = repo root; framework auto-detects as Next.js.

Add every variable from step 3 under **Settings → Environment Variables** before the
first deploy — a missing `SUPABASE_SERVICE_ROLE_KEY` makes signup silently skip admin
promotion, and a missing URL/anon key fails the build.

[`vercel.json`](vercel.json) pins `installCommand` to npm on purpose. This repo still
carries a root `pnpm-lock.yaml` and `pnpm-workspace.yaml` from the Replit export; left
to auto-detect, Vercel would choose pnpm and fail trying to resolve the `catalog:` and
`workspace:*` protocols those files declare. (You can delete both files instead — they
serve no purpose now that the root is the app.)

The same file registers the auction closer as a cron:

```json
{ "path": "/api/cron/close-auctions", "schedule": "0 3 * * *" }
```

Vercel sends `Authorization: Bearer $CRON_SECRET` automatically once the variable is
set on the project.

**Why daily, and why that's not really enough.** Vercel's Hobby plan rejects any cron
expression that fires more than once a day — a deploy carrying `*/15 * * * *` fails with
"Hobby accounts are limited to daily cron jobs". Schedules are evaluated in **UTC**, so
`0 3 * * *` is 08:30 IST. On Hobby the run is triggered somewhere within that hour rather
than exactly on the minute.

The consequence is that an auction can sit expired for up to ~24 hours before a winner is
recorded, which is poor for a live auction site. Two ways out:

- Upgrade to Pro and restore `*/15 * * * *`.
- Keep the daily entry as a backstop and drive the real cadence from an external scheduler
  (GitHub Actions, cron-job.org) calling the endpoint directly. The route authorises on the
  bearer token alone, so any caller presenting it works:

  ```
  curl -H "Authorization: Bearer $CRON_SECRET" https://<your-app>.vercel.app/api/cron/close-auctions
  ```

  Re-running after a completed run is a no-op: the close is guarded by
  `.eq('status', 'active')`, so an already-closed auction is skipped. Don't let two runs
  overlap, though — the guard doesn't check how many rows it matched, so simultaneous runs
  could both create an order for the same auction. Sequential is safe; concurrent is not.

## 6. Point Razorpay at the deployment

In the Razorpay dashboard → **Settings → Webhooks**, add:

```
https://<your-app>.vercel.app/api/webhooks/razorpay
```

Subscribe to `order.paid`, `payment.captured`, and `payment.failed`. Copy the signing
secret into `RAZORPAY_WEBHOOK_SECRET` on Vercel and redeploy.

The webhook is what flips an order to `paid` and the listing to `sold`; until it's
configured, a completed payment leaves the order `pending` and the checkout page shows
"payment in progress".

> Stripe is dormant. `/api/checkout` and `/api/webhooks/stripe` both return 501. The
> Stripe webhook previously had **no signature verification at all**, so any
> unauthenticated POST could mark a listing sold — verify `stripe-signature` with
> `stripe.webhooks.constructEvent` before re-enabling it.

---

## Verification checklist

1. `npm run build` succeeds.
2. Sign up with an email **not** in `ADMIN_EMAILS` → `/admin/dashboard` redirects to `/`.
3. Sign up with an email **in** `ADMIN_EMAILS` → the dashboard loads with real counts.
4. As admin, create a listing at `/admin/listings/new` with a photo → it appears in
   `/browse` and on its item page.
5. Place a bid as a second account → it persists and `current_highest_bid` updates.
   Try a bid one cent above the current price → rejected with the minimum increment.
6. Buy a fixed-price listing → Razorpay test checkout → the webhook flips the order to
   `paid` and the listing to `sold`.
7. Set an auction's `auction_end` to the past, then hit the cron route with the right
   `Bearer` token → the auction closes and a pending order is created for the winner.
8. In the Supabase SQL editor, confirm an anonymous write is refused:

   ```sql
   set role anon;
   insert into public.listings (title, category, country_of_origin, listing_type)
   values ('should fail', 'coin', 'Nowhere', 'fixed');
   -- expected: new row violates row-level security policy
   reset role;
   ```
