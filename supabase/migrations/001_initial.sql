-- ============================================================
-- Jane × Josh Universe — Database Schema v2
-- RESET + REBUILD: Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── DROP & RECREATE to ensure clean state ────────────────────
DROP TABLE IF EXISTS reactions CASCADE;
DROP TABLE IF EXISTS pet_actions CASCADE;
DROP TABLE IF EXISTS pet CASCADE;
DROP TABLE IF EXISTS surprises CASCADE;
DROP TABLE IF EXISTS jane_lore CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS daily_answers CASCADE;
DROP TABLE IF EXISTS daily_questions CASCADE;
DROP TABLE IF EXISTS moods CASCADE;
DROP TABLE IF EXISTS memories CASCADE;
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS letters CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- ─── PROFILES ─────────────────────────────────────────────────
-- username can be any text (admin will set 'jane' or 'josh' manually)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT 'visitor',
  display_name TEXT NOT NULL DEFAULT 'visitor',
  avatar_emoji TEXT NOT NULL DEFAULT '👤',
  bio TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── LETTERS ──────────────────────────────────────────────────
CREATE TABLE letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT NOT NULL,
  mood TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SONGS ────────────────────────────────────────────────────
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT,
  added_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── MEMORIES ─────────────────────────────────────────────────
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  memory_date DATE,
  creator UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DAILY QUESTIONS ──────────────────────────────────────────
CREATE TABLE daily_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  question_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DAILY ANSWERS ────────────────────────────────────────────
CREATE TABLE daily_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

-- ─── MOODS ────────────────────────────────────────────────────
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PET ──────────────────────────────────────────────────────
CREATE TABLE pet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Biscuit',
  hunger INTEGER NOT NULL DEFAULT 70,
  happiness INTEGER NOT NULL DEFAULT 80,
  last_fed_by UUID REFERENCES profiles(id),
  last_played_by UUID REFERENCES profiles(id),
  last_fed_at TIMESTAMPTZ,
  last_played_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── PET ACTIONS ──────────────────────────────────────────────
CREATE TABLE pet_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SURPRISES ────────────────────────────────────────────────
CREATE TABLE surprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  to_user UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  title TEXT,
  is_opened BOOLEAN NOT NULL DEFAULT false,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── JANE LORE ────────────────────────────────────────────────
CREATE TABLE jane_lore (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '???',
  emoji TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category, key)
);

-- ─── QUIZ QUESTIONS ───────────────────────────────────────────
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  hint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REACTIONS ────────────────────────────────────────────────
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- ─── SEED DATA ────────────────────────────────────────────────

-- Seed virtual pet
INSERT INTO pet (name, hunger, happiness) VALUES ('Biscuit', 70, 80);

-- Seed Jane Lore placeholders
INSERT INTO jane_lore (category, key, value, emoji) VALUES
  ('stats', 'cute', '95', '🌸'),
  ('stats', 'chaos', '40', '⚡'),
  ('stats', 'sleepiness', '85', '😴'),
  ('stats', 'loveliness', '9999', '💗'),
  ('favorites', 'food', '???', '🍜'),
  ('favorites', 'song', '???', '🎵'),
  ('favorites', 'movie', '???', '🎬'),
  ('favorites', 'place', '???', '📍'),
  ('habits', 'morning', '???', '☀️'),
  ('facts', 'fun_fact_1', '???', '✨'),
  ('facts', 'fun_fact_2', '???', '🌟')
ON CONFLICT (category, key) DO NOTHING;

-- Seed quiz questions
INSERT INTO quiz_questions (question, options, correct_index, hint) VALUES
  ('What would Jane most likely be doing on a Sunday morning?', '["Sleeping in 😴", "Going for a run 🏃", "Making coffee ☕", "Reading a book 📖"]', 0, 'she loves her rest'),
  ('If Jane could eat one thing forever, it would be...', '["Pizza 🍕", "Ramen 🍜", "Ice cream 🍦", "Sushi 🍣"]', 2, 'sweet tooth alert'),
  ('Jane''s vibe when a plan gets cancelled?', '["Devastated 😭", "Secretly relieved 😌", "Already making new plans 📝", "Doesn''t care either way 🤷"]', 1, 'introvert hours'),
  ('What does Jane say most often?', '["terserah", "nanti dulu", "aduh", "yaelah"]', 0, 'classic'),
  ('Jane''s ideal Saturday night?', '["Party 🎉", "Movie marathon at home 🎬", "Dinner out 🍽️", "Gaming session 🎮"]', 1, 'cozy vibes only')
ON CONFLICT DO NOTHING;

-- Seed daily questions
INSERT INTO daily_questions (question, question_date) VALUES
  ('What made you smile today?', CURRENT_DATE),
  ('What are you grateful for right now?', CURRENT_DATE + 1),
  ('If today were a color, what would it be?', CURRENT_DATE + 2),
  ('What''s one small thing that made your day better?', CURRENT_DATE + 3),
  ('What song is stuck in your head?', CURRENT_DATE + 4),
  ('What do you want to do together next?', CURRENT_DATE + 5),
  ('Describe your day in three emojis.', CURRENT_DATE + 6)
ON CONFLICT (question_date) DO NOTHING;

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE surprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE jane_lore ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- ─── POLICIES ─────────────────────────────────────────────────

-- Profiles: public read, authenticated own-write
CREATE POLICY "profiles_select_anon" ON profiles FOR SELECT TO anon USING (true);
CREATE POLICY "profiles_select_auth" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Letters: authenticated only
CREATE POLICY "letters_select" ON letters FOR SELECT TO authenticated USING (true);
CREATE POLICY "letters_insert" ON letters FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender);
CREATE POLICY "letters_update" ON letters FOR UPDATE TO authenticated USING (auth.uid() = recipient);

-- Songs: public read, authenticated insert
CREATE POLICY "songs_select" ON songs FOR SELECT TO anon USING (true);
CREATE POLICY "songs_select_auth" ON songs FOR SELECT TO authenticated USING (true);
CREATE POLICY "songs_insert" ON songs FOR INSERT TO authenticated WITH CHECK (auth.uid() = added_by);

-- Memories: public read, authenticated insert
CREATE POLICY "memories_select" ON memories FOR SELECT TO anon USING (true);
CREATE POLICY "memories_select_auth" ON memories FOR SELECT TO authenticated USING (true);
CREATE POLICY "memories_insert" ON memories FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator);

-- Daily questions: public read
CREATE POLICY "dq_select_anon" ON daily_questions FOR SELECT TO anon USING (true);
CREATE POLICY "dq_select" ON daily_questions FOR SELECT TO authenticated USING (true);

-- Daily answers: authenticated
CREATE POLICY "da_select" ON daily_answers FOR SELECT TO authenticated USING (true);
CREATE POLICY "da_insert" ON daily_answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "da_update" ON daily_answers FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Moods: authenticated
CREATE POLICY "moods_select" ON moods FOR SELECT TO authenticated USING (true);
CREATE POLICY "moods_insert" ON moods FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Pet: public read, authenticated update
CREATE POLICY "pet_select" ON pet FOR SELECT TO anon USING (true);
CREATE POLICY "pet_select_auth" ON pet FOR SELECT TO authenticated USING (true);
CREATE POLICY "pet_update" ON pet FOR UPDATE TO authenticated USING (true);

-- Pet actions: authenticated
CREATE POLICY "pa_select" ON pet_actions FOR SELECT TO authenticated USING (true);
CREATE POLICY "pa_insert" ON pet_actions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Surprises: own only
CREATE POLICY "surprises_select" ON surprises FOR SELECT TO authenticated
  USING (auth.uid() = to_user OR auth.uid() = from_user);
CREATE POLICY "surprises_insert" ON surprises FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user);
CREATE POLICY "surprises_update" ON surprises FOR UPDATE TO authenticated
  USING (auth.uid() = to_user);

-- Jane lore: public read, jane-only write
CREATE POLICY "jl_select_anon" ON jane_lore FOR SELECT TO anon USING (true);
CREATE POLICY "jl_select_auth" ON jane_lore FOR SELECT TO authenticated USING (true);
CREATE POLICY "jl_update" ON jane_lore FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND username = 'jane'));
CREATE POLICY "jl_insert" ON jane_lore FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND username = 'jane'));

-- Quiz: public read
CREATE POLICY "quiz_select_anon" ON quiz_questions FOR SELECT TO anon USING (true);
CREATE POLICY "quiz_select_auth" ON quiz_questions FOR SELECT TO authenticated USING (true);

-- Reactions: authenticated
CREATE POLICY "reactions_select" ON reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "reactions_insert" ON reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete" ON reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─── TRIGGER: auto-create profile on signup ───────────────────
-- This creates a basic profile; you then UPDATE it via SQL to set username/emoji
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_emoji)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'visitor'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '👤')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
