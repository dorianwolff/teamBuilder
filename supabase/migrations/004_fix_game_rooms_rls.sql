-- Allow any authenticated user to SELECT waiting rooms so they can join them.
-- The previous policy only allowed players already IN a room to see it,
-- which made joinCasualRoom return 0 rows (and .single() → 406).

DROP POLICY IF EXISTS "Players can view their own rooms" ON game_rooms;

CREATE POLICY "Players can view their rooms or any waiting room"
  ON game_rooms FOR SELECT
  USING (
    auth.uid() = player_a_id
    OR auth.uid() = player_b_id
    OR (status = 'waiting' AND auth.uid() IS NOT NULL)
  );
