-- Run this FIRST if you're having signup issues.
-- It creates everything in one shot with explicit grants.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username              TEXT UNIQUE NOT NULL,
  avatar_url            TEXT,
  elo                   INTEGER NOT NULL DEFAULT 1000,
  games_played          INTEGER NOT NULL DEFAULT 0,
  games_won             INTEGER NOT NULL DEFAULT 0,
  games_lost            INTEGER NOT NULL DEFAULT 0,
  win_streak            INTEGER NOT NULL DEFAULT 0,
  best_win_streak       INTEGER NOT NULL DEFAULT 0,
  unlocked_verses       TEXT[]  NOT NULL DEFAULT ARRAY['one_piece', 'naruto'],
  discovered_characters TEXT[]  NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Explicit grants so the trigger can write
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop and recreate the trigger cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─── Power tags ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS power_tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT 'default',
  description TEXT NOT NULL DEFAULT ''
);

ALTER TABLE power_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Power tags readable by all" ON power_tags;
CREATE POLICY "Power tags readable by all" ON power_tags FOR SELECT USING (true);

-- ─── Characters ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS characters (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  verse               TEXT NOT NULL CHECK (verse IN ('one_piece', 'naruto', 'dbz', 'hxh')),
  arc_version         TEXT NOT NULL,
  power_level         DOUBLE PRECISION NOT NULL,
  martial_ratio       DOUBLE PRECISION NOT NULL DEFAULT 0.5
                        CHECK (martial_ratio BETWEEN 0 AND 1),
  power_tags          TEXT[]  NOT NULL DEFAULT ARRAY[]::TEXT[],
  strengths           JSONB   NOT NULL DEFAULT '[]'::JSONB,
  weaknesses          JSONB   NOT NULL DEFAULT '[]'::JSONB,
  cannot_win_against  TEXT[]  NOT NULL DEFAULT ARRAY[]::TEXT[],
  draw_conditions     JSONB   NOT NULL DEFAULT '[]'::JSONB,
  image_path          TEXT    NOT NULL,
  short_description   TEXT    NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Characters readable by all" ON characters;
CREATE POLICY "Characters readable by all" ON characters FOR SELECT USING (true);
-- Allow service role to upsert (needed for seeding)
DROP POLICY IF EXISTS "Service role can manage characters" ON characters;
CREATE POLICY "Service role can manage characters"
  ON characters FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_characters_verse       ON characters (verse);
CREATE INDEX IF NOT EXISTS idx_characters_power_level ON characters (power_level DESC);

-- ─── Game rooms ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_rooms (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code          TEXT UNIQUE NOT NULL,
  mode          TEXT NOT NULL CHECK (mode IN ('ranked', 'casual')),
  verse         TEXT NOT NULL,
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

DROP POLICY IF EXISTS "Players can view their own rooms" ON game_rooms;
CREATE POLICY "Players can view their own rooms"
  ON game_rooms FOR SELECT
  USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);

DROP POLICY IF EXISTS "Players can update their own rooms" ON game_rooms;
CREATE POLICY "Players can update their own rooms"
  ON game_rooms FOR UPDATE
  USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);

DROP POLICY IF EXISTS "Authenticated users can create rooms" ON game_rooms;
CREATE POLICY "Authenticated users can create rooms"
  ON game_rooms FOR INSERT
  WITH CHECK (auth.uid() = player_a_id);

CREATE INDEX IF NOT EXISTS idx_game_rooms_status   ON game_rooms (status);
CREATE INDEX IF NOT EXISTS idx_game_rooms_player_a ON game_rooms (player_a_id);
CREATE INDEX IF NOT EXISTS idx_game_rooms_player_b ON game_rooms (player_b_id);
CREATE INDEX IF NOT EXISTS idx_game_rooms_code     ON game_rooms (code);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE game_rooms;

-- ─── Matchmaking queue ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matchmaking_queue (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  elo        INTEGER NOT NULL,
  verse      TEXT NOT NULL,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status     TEXT NOT NULL DEFAULT 'waiting'
               CHECK (status IN ('waiting', 'matched', 'cancelled'))
);

ALTER TABLE matchmaking_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own queue entry" ON matchmaking_queue;
CREATE POLICY "Users can manage their own queue entry"
  ON matchmaking_queue FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can read queue" ON matchmaking_queue;
CREATE POLICY "Authenticated users can read queue"
  ON matchmaking_queue FOR SELECT USING (auth.role() = 'authenticated');

ALTER PUBLICATION supabase_realtime ADD TABLE matchmaking_queue;
