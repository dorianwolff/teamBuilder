-- Migration 006: Add trait columns to characters table
--
-- traits          : string array of identity/species/role tags, e.g. ["human","female","nen_user"]
-- trait_weaknesses: JSONB — when the OPPONENT has a listed trait, this char's total
--                   effective score is reduced by (1 - coefficient)
-- trait_strengths : JSONB — when the OPPONENT has a listed trait, this char's total
--                   effective score is boosted by coefficient

ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS traits           JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS trait_weaknesses JSONB NOT NULL DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS trait_strengths  JSONB NOT NULL DEFAULT '[]'::JSONB;
