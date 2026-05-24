-- ─── 005 Rooms Remaster ──────────────────────────────────────────────────────
-- • game_rooms: add name + is_public columns
-- • Fix UPDATE RLS so a second player can join a waiting room
-- • New room_join_requests table (for private-room approval flow)
-- • matchmaking_queue: add room_id column, widen UNIQUE constraint
-- • ranked_find_match() RPC — race-safe via FOR UPDATE SKIP LOCKED

-- ── game_rooms: new columns ───────────────────────────────────────────────────
ALTER TABLE game_rooms
  ADD COLUMN IF NOT EXISTS name      TEXT,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT TRUE;

-- ── Fix UPDATE RLS ─────────────────────────────────────────────────────────────
-- Old policy only allowed a player already listed in the room to update it,
-- which prevented the joiner (player_b) from setting their own id.
DROP POLICY IF EXISTS "Players can update their own rooms" ON game_rooms;

CREATE POLICY "Players can update their own rooms"
  ON game_rooms FOR UPDATE
  USING (
    auth.uid() = player_a_id
    OR auth.uid() = player_b_id
    OR (status = 'waiting' AND player_b_id IS NULL AND auth.uid() IS NOT NULL)
  );

-- ── room_join_requests ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS room_join_requests (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id    UUID        NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  username   TEXT        NOT NULL,
  status     TEXT        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (room_id, user_id)
);

ALTER TABLE room_join_requests ENABLE ROW LEVEL SECURITY;

-- Requester: full access to their own requests
CREATE POLICY "Requester can manage own request"
  ON room_join_requests FOR ALL
  USING (auth.uid() = user_id);

-- Room creator: read all requests for their room
CREATE POLICY "Room creator can read requests"
  ON room_join_requests FOR SELECT
  USING (
    auth.uid() = (SELECT player_a_id FROM game_rooms WHERE id = room_id LIMIT 1)
  );

-- Room creator: approve / reject (UPDATE)
CREATE POLICY "Room creator can update requests"
  ON room_join_requests FOR UPDATE
  USING (
    auth.uid() = (SELECT player_a_id FROM game_rooms WHERE id = room_id LIMIT 1)
  );

ALTER PUBLICATION supabase_realtime ADD TABLE room_join_requests;

CREATE INDEX IF NOT EXISTS idx_room_join_requests_room ON room_join_requests(room_id);
CREATE INDEX IF NOT EXISTS idx_room_join_requests_user ON room_join_requests(user_id);

-- ── matchmaking_queue: add room_id column ─────────────────────────────────────
-- room_id is set by ranked_find_match() so the matched player knows where to go.
ALTER TABLE matchmaking_queue
  ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES game_rooms(id);

-- ── ranked_find_match() ───────────────────────────────────────────────────────
-- Called by the searching player every few seconds.
-- Atomically claims one opponent (closest ELO, oldest first), creates a
-- game room, and marks both queue entries as matched.
-- Returns the new room UUID, or NULL when no opponent is available yet.
CREATE OR REPLACE FUNCTION ranked_find_match(
  p_user_id UUID,
  p_elo     INTEGER,
  p_verse   TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_opponent_id UUID;
  v_room_id     UUID;
  v_code        TEXT;
BEGIN
  -- Claim an available opponent; SKIP LOCKED prevents two concurrent calls
  -- from both claiming the same opponent row.
  SELECT user_id INTO v_opponent_id
  FROM   matchmaking_queue
  WHERE  status  = 'waiting'
    AND  user_id != p_user_id
  ORDER  BY ABS(elo - p_elo), joined_at
  LIMIT  1
  FOR UPDATE SKIP LOCKED;

  IF v_opponent_id IS NULL THEN
    RETURN NULL;
  END IF;

  -- Generate a short room code (6 hex-ish chars)
  v_code := UPPER(LEFT(MD5(p_user_id::TEXT || CLOCK_TIMESTAMP()::TEXT), 6));

  -- Create the game room (draft_state will be written by the client after receiving the id)
  INSERT INTO game_rooms (code, mode, verse, status, player_a_id, player_b_id, started_at)
  VALUES (v_code, 'ranked', p_verse, 'drafting', p_user_id, v_opponent_id, NOW())
  RETURNING id INTO v_room_id;

  -- Mark both players as matched and attach the room id
  UPDATE matchmaking_queue
  SET    status  = 'matched',
         room_id = v_room_id
  WHERE  user_id = ANY(ARRAY[p_user_id, v_opponent_id])
    AND  status  = 'waiting';

  RETURN v_room_id;
END;
$$;
