-- Allow anyone to view all trips (they're on public profiles)
-- Users can still only create/edit/delete their own trips
DROP POLICY IF EXISTS "Public trips are viewable by everyone" ON trips;
CREATE POLICY "Anyone can view trips" ON trips FOR SELECT TO public USING (true);
