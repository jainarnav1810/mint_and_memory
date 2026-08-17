-- Supabase Database Schema for Stamp, Coin & Currency Marketplace

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'buyer' check (role in ('buyer', 'admin')),
  country text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Core Listings Table (Stamps, Coins, Currency)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  category text not null check (category in ('stamp', 'coin', 'currency')),
  country_of_origin text not null,
  year_issued int,
  condition text check (condition in ('Mint', 'Used', 'Uncirculated', 'Fine', 'Extremely Fine', 'Proof')),
  denomination text,
  listing_type text not null check (listing_type in ('fixed', 'auction')),
  fixed_price numeric(10,2),
  starting_bid numeric(10,2),
  reserve_price numeric(10,2),
  current_highest_bid numeric(10,2),
  currency text not null default 'USD',
  auction_start timestamptz,
  auction_end timestamptz,
  status text not null default 'active'
    check (status in ('active', 'sold', 'closed', 'draft', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Performance Indexes
create index if not exists idx_listings_country on public.listings(country_of_origin);
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_type_status on public.listings(listing_type, status);
create index if not exists idx_listings_price on public.listings(fixed_price);
create index if not exists idx_listings_auction_end on public.listings(auction_end);

-- 3. Listing Images Table (Multiple images per collectible)
create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  display_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_listing_images_listing on public.listing_images(listing_id);

-- 4. Bids Table (Auction bidding history)
create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  bidder_id uuid references public.profiles(id) on delete set null,
  amount numeric(10,2) not null,
  created_at timestamptz default now()
);

create index if not exists idx_bids_listing on public.bids(listing_id, amount desc);

-- 5. Orders Table (Purchases & Won Auctions)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id),
  buyer_id uuid references public.profiles(id) on delete set null,
  order_type text not null check (order_type in ('fixed', 'auction')),
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  stripe_payment_intent_id text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  shipping_address jsonb,
  order_status text not null default 'processing'
    check (order_status in ('processing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz default now()
);

create index if not exists idx_orders_buyer on public.orders(buyer_id);
create index if not exists idx_orders_listing on public.orders(listing_id);

-- Trigger: Automatically update current_highest_bid on listings table when a new bid is placed
create or replace function public.update_listing_highest_bid()
returns trigger as $$
begin
  update public.listings
  set current_highest_bid = new.amount,
      updated_at = now()
  where id = new.listing_id
    and (current_highest_bid is null or new.amount > current_highest_bid);
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_highest_bid
after insert on public.bids
for each row
execute function public.update_listing_highest_bid();

-- RPC Function: Bidding Procedure for Guest or Authenticated Bidders
create or replace function public.place_bid(
  p_listing_id uuid,
  p_amount numeric,
  p_bidder_id uuid default null
) returns jsonb security definer as $$
declare
  v_current_bid numeric;
  v_bid_id uuid;
begin
  select current_highest_bid into v_current_bid
  from public.listings
  where id = p_listing_id;

  if v_current_bid is not null and p_amount <= v_current_bid then
    raise exception 'Bid amount must be greater than current highest bid of %', v_current_bid;
  end if;

  insert into public.bids (listing_id, bidder_id, amount)
  values (p_listing_id, p_bidder_id, p_amount)
  returning id into v_bid_id;

  update public.listings
  set current_highest_bid = p_amount,
      updated_at = now()
  where id = p_listing_id;

  return jsonb_build_object('success', true, 'bid_id', v_bid_id, 'new_amount', p_amount);
end;
$$ language plpgsql;

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.bids enable row level security;
alter table public.orders enable row level security;

-- RLS Policy Definitions
create policy "Public profile read" on public.profiles for select using (true);
create policy "User self update profile" on public.profiles for update using (auth.uid() = id);

create policy "Public read listings" on public.listings for select using (true);
create policy "Public insert listings" on public.listings for insert with check (true);
create policy "Public update listings" on public.listings for update using (true);

create policy "Public read images" on public.listing_images for select using (true);
create policy "Public insert images" on public.listing_images for insert with check (true);

create policy "Public read bids" on public.bids for select using (true);
create policy "Public insert bids" on public.bids for insert with check (true);

create policy "Public read orders" on public.orders for select using (true);
create policy "Public insert orders" on public.orders for insert with check (true);
