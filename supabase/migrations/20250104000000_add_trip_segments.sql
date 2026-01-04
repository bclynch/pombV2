-- Create trip_segments table for organizing trip content
create table public.trip_segments (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  name text,
  description text,
  geometry geography(MultiLineString, 4326),
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes for trip_segments
create index trip_segments_trip_idx on public.trip_segments (trip_id);
create index trip_segments_geo_idx on public.trip_segments using GIST (geometry);

-- RLS for trip_segments
alter table public.trip_segments enable row level security;

create policy "Segments viewable if trip is public or owned"
  on trip_segments for select using (
    exists (
      select 1 from trips
      where trips.id = trip_segments.trip_id
      and (trips.is_published = true or trips.user_id = auth.uid())
    )
  );

create policy "Users can insert own segments"
  on trip_segments for insert with check (auth.uid() = user_id);

create policy "Users can update own segments"
  on trip_segments for update using (auth.uid() = user_id);

create policy "Users can delete own segments"
  on trip_segments for delete using (auth.uid() = user_id);

-- Add segment_id to photos table (optional association)
alter table public.photos add column segment_id uuid references public.trip_segments(id) on delete set null;
create index photos_segment_idx on public.photos (segment_id);

-- Add segment_id to trip_uploads table (link GPX files to segments)
alter table public.trip_uploads add column segment_id uuid references public.trip_segments(id) on delete set null;
create index trip_uploads_segment_idx on public.trip_uploads (segment_id);

-- Function to get segment geometry as GeoJSON by ID (for merging segments)
CREATE OR REPLACE FUNCTION get_segment_geometry_geojson(segment_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT ST_AsGeoJSON(geometry)::text
  FROM trip_segments
  WHERE id = segment_id
$$;

GRANT EXECUTE ON FUNCTION get_segment_geometry_geojson(uuid) TO anon, authenticated;
