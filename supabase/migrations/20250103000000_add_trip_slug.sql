-- Add slug column to trips table for URL-friendly trip identifiers

-- Function to generate a slug from a trip name
CREATE OR REPLACE FUNCTION generate_trip_slug(trip_name text)
RETURNS text AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        trim(trip_name),
        '[^a-zA-Z0-9\s-]', '', 'g'  -- Remove special characters
      ),
      '\s+', '-', 'g'  -- Replace spaces with dashes
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add slug column (nullable initially for backfill)
ALTER TABLE trips ADD COLUMN IF NOT EXISTS slug text;

-- Backfill existing trips with generated slugs
UPDATE trips SET slug = generate_trip_slug(name) WHERE slug IS NULL;

-- Make slug NOT NULL after backfill
ALTER TABLE trips ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint per user (same user can't have duplicate slugs)
ALTER TABLE trips ADD CONSTRAINT trips_user_slug_unique UNIQUE (user_id, slug);

-- Trigger function to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION trips_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug if not provided or if name changed
  IF NEW.slug IS NULL OR NEW.slug = '' OR (TG_OP = 'UPDATE' AND OLD.name != NEW.name) THEN
    NEW.slug := generate_trip_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trips_slug_trigger ON trips;
CREATE TRIGGER trips_slug_trigger
  BEFORE INSERT OR UPDATE ON trips
  FOR EACH ROW
  EXECUTE FUNCTION trips_generate_slug();
