-- Enable UUID extension
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

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ─── Power tags ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS power_tags (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT 'default',
  description TEXT NOT NULL DEFAULT ''
);

ALTER TABLE power_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Power tags readable by all" ON power_tags FOR SELECT USING (true);

-- ─── Characters ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS characters (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  verse               TEXT NOT NULL CHECK (verse IN ('one_piece', 'naruto', 'dbz', 'hxh')),
  arc_version         TEXT NOT NULL,
  power_level         DOUBLE PRECISION NOT NULL,
  martial_ratio       DOUBLE PRECISION NOT NULL DEFAULT 0.5 CHECK (martial_ratio BETWEEN 0 AND 1),
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
CREATE POLICY "Characters readable by all" ON characters FOR SELECT USING (true);

CREATE INDEX idx_characters_verse      ON characters (verse);
CREATE INDEX idx_characters_power_level ON characters (power_level DESC);
