-- ─── Game rooms ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_rooms (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,                    -- 6-char casual invite code
  mode          TEXT NOT NULL CHECK (mode IN ('ranked', 'casual')),
  verse         TEXT NOT NULL,                           -- verse slug or 'all'
  status        TEXT NOT NULL DEFAULT 'waiting'
                  CHECK (status IN ('waiting','drafting','battling','finished','abandoned')),
  player_a_id   UUID NOT NULL REFERENCES profiles(id),
  player_b_id   UUID REFERENCES profiles(id),
  draft_state   JSONB,
  battle_state  JSONB,
  winner_id     UUID REFERENCES profiles(id),
  elo_delta_a   INTEGER,
  elo_delta_b   INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ
);

ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players can view their own rooms"
  ON game_rooms FOR SELECT
  USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);

CREATE POLICY "Players can update their own rooms"
  ON game_rooms FOR UPDATE
  USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);

CREATE POLICY "Authenticated users can create rooms"
  ON game_rooms FOR INSERT
  WITH CHECK (auth.uid() = player_a_id);

CREATE INDEX idx_game_rooms_status ON game_rooms (status);
CREATE INDEX idx_game_rooms_player_a ON game_rooms (player_a_id);
CREATE INDEX idx_game_rooms_player_b ON game_rooms (player_b_id);
CREATE INDEX idx_game_rooms_code    ON game_rooms (code);

-- Enable realtime for game_rooms
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;

-- ─── Matchmaking queue ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  elo        INTEGER NOT NULL,
  verse      TEXT NOT NULL,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status     TEXT NOT NULL DEFAULT 'waiting'
               CHECK (status IN ('waiting', 'matched', 'cancelled')),
  UNIQUE (user_id, status)  -- only one active entry per user
);

ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own queue entry"
  ON matchmaking_queue FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can read queue"
  ON matchmaking_queue FOR SELECT USING (auth.role() = 'authenticated');

ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;

-- ─── Encyclopedia entries (discovered characters per user) ───────────────────
-- Stored in profiles.discovered_characters[] array for simplicity.
-- This view makes it easier to query the encyclopedia.
CREATE OR REPLACE VIEW user_encyclopedia AS
SELECT
  p.id AS user_id,
  p.username,
  c.*
FROM profiles p
CROSS JOIN characters c
WHERE c.slug = ANY(p.discovered_characters);
