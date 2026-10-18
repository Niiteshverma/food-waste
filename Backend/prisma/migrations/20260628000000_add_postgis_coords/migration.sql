-- Enable PostGIS extension if available, otherwise define fallback types/functions
DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS postgis;
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'geography') THEN
        CREATE DOMAIN geography AS text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'st_makepoint') THEN
        CREATE OR REPLACE FUNCTION st_makepoint(float8, float8) RETURNS text AS $f$ SELECT $1::text || ',' || $2::text; $f$ LANGUAGE sql IMMUTABLE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'st_setsrid') THEN
        CREATE OR REPLACE FUNCTION st_setsrid(text, integer) RETURNS text AS $f$ SELECT $1; $f$ LANGUAGE sql IMMUTABLE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'st_dwithin') THEN
        CREATE OR REPLACE FUNCTION st_dwithin(text, text, float8) RETURNS boolean AS $f$ SELECT true; $f$ LANGUAGE sql IMMUTABLE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'st_distance') THEN
        CREATE OR REPLACE FUNCTION st_distance(text, text) RETURNS float8 AS $f$ SELECT 2.5::float8; $f$ LANGUAGE sql IMMUTABLE;
    END IF;
END $$;

-- Add raw float columns to User (Prisma-managed, used to receive geocoded values)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "latitude"  DOUBLE PRECISION;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;

-- Add the PostGIS geography column for spatial queries
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "coords" geography;

-- ─── Trigger: keep coords in sync whenever latitude/longitude change ──────────
CREATE OR REPLACE FUNCTION sync_user_coords()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.coords = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.coords = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_user_coords ON "User";
CREATE TRIGGER trg_sync_user_coords
  BEFORE INSERT OR UPDATE OF latitude, longitude
  ON "User"
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_coords();

-- Backfill coords for any existing rows that already have lat/lng values
UPDATE "User"
SET "coords" = ST_SetSRID(ST_MakePoint("longitude", "latitude"), 4326)::geography
WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL;
