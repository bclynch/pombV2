-- Allow any geometry type (LineString or MultiLineString)
ALTER TABLE trips ALTER COLUMN summary_geometry TYPE geography(GEOMETRY, 4326);

-- Recreate spatial index
CREATE INDEX IF NOT EXISTS trips_geo_idx ON trips USING gist (summary_geometry);

-- Create computed field function for GeoJSON conversion
CREATE OR REPLACE FUNCTION trips_summary_geometry_geojson(trip trips)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT ST_AsGeoJSON(trip.summary_geometry)::text
$$;

GRANT EXECUTE ON FUNCTION trips_summary_geometry_geojson(trips) TO anon, authenticated;

-- Function to get trip geometry as GeoJSON by ID (for merging uploads)
CREATE OR REPLACE FUNCTION get_trip_geometry_geojson(trip_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT ST_AsGeoJSON(summary_geometry)::text
  FROM trips
  WHERE id = trip_id
$$;

GRANT EXECUTE ON FUNCTION get_trip_geometry_geojson(uuid) TO anon, authenticated;
