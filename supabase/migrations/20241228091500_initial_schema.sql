-- 1. Enable PostGIS for spatial queries (Distance, Bounding Boxes)
create extension if not exists postgis with schema extensions;

-- 2. Create a "Profiles" table (Links to Supabase Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create the "Trips" table (The core parent object)
create table public.trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  name text not null,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,

  -- PERFORMANCE KEY: This column stores the merged, simplified line
  -- that you display on the map. We use 'geography' for accurate meters.
  summary_geometry geography(LineString, 4326),

  -- Store min/max bounds so you can "Zoom to Fit" instantly on the client
  bounds_min_lat float,
  bounds_min_lng float,
  bounds_max_lat float,
  bounds_max_lng float,

  is_published boolean default false, -- If true, friends can see it
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Create "Trip Uploads" (Tracks the raw GPX files in R2)
create table public.trip_uploads (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,

  filename text not null,
  r2_key text not null, -- The path in your Cloudflare Bucket
  file_size_bytes bigint,

  -- If you want to keep the raw geometry of *just this file* for editing later
  raw_geometry geography(MultiLineString, 4326),

  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Create "Photos" (Optimized for your "No Lag" UI)
create table public.photos (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,

  -- Cloudflare R2 References
  r2_key_thumb text,  -- Small (30KB)
  r2_key_large text,  -- Large (400KB)

  -- THE MAGIC TRICK: Blurhash string for instant loading
  blurhash text,

  -- Spatial data: Where was the photo taken?
  location geography(Point, 4326),
  captured_at timestamp with time zone, -- From EXIF data

  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Create Indexes (Crucial for Map Performance)
create index trips_geo_idx on public.trips using GIST (summary_geometry);
create index photos_geo_idx on public.photos using GIST (location);
create index trips_user_idx on public.trips (user_id);
create index photos_trip_idx on public.photos (trip_id);

-- 7. Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_uploads enable row level security;
alter table public.photos enable row level security;

-- POLICY: Profiles are viewable by everyone, editable only by owner
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);
create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- POLICY: Trips - Viewable if 'is_published' is true OR if you own it
create policy "Public trips are viewable by everyone"
  on trips for select using (is_published = true or auth.uid() = user_id);
create policy "Users can insert their own trips"
  on trips for insert with check (auth.uid() = user_id);
create policy "Users can update their own trips"
  on trips for update using (auth.uid() = user_id);
create policy "Users can delete their own trips"
  on trips for delete using (auth.uid() = user_id);

-- POLICY: Photos - Same rules as trips
create policy "Photos viewable if trip is public or owned"
  on photos for select using (
    exists (
      select 1 from trips
      where trips.id = photos.trip_id
      and (trips.is_published = true or trips.user_id = auth.uid())
    )
  );
create policy "Users can upload photos to own trips"
  on photos for insert with check (auth.uid() = user_id);

-- POLICY: Trip Uploads - Same rules as trips
create policy "Trip uploads viewable if trip is public or owned"
  on trip_uploads for select using (
    exists (
      select 1 from trips
      where trips.id = trip_uploads.trip_id
      and (trips.is_published = true or trips.user_id = auth.uid())
    )
  );
create policy "Users can upload to own trips"
  on trip_uploads for insert with check (auth.uid() = user_id);
create policy "Users can update own uploads"
  on trip_uploads for update using (auth.uid() = user_id);
create policy "Users can delete own uploads"
  on trip_uploads for delete using (auth.uid() = user_id);
