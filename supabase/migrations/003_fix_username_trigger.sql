-- Fix handle_new_user to generate a unique username fallback for OAuth users.
-- OAuth users have no 'username' in raw_user_meta_data, so we use:
--   email_prefix + first 5 chars of their UUID
-- This makes collisions virtually impossible while keeping the name readable.
--
-- Run this in Supabase SQL editor: Dashboard → SQL Editor → New query → Paste → Run

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
      NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
      split_part(NEW.email, '@', 1) || '_' || substr(replace(NEW.id::text, '-', ''), 1, 5)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
