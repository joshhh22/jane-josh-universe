-- ============================================================
-- Jane × Josh Universe — Database Schema (Bulletproof Version)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 0. DROP PREVIOUS TRIGGERS & TABLES CLEANLY ───────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

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

-- ─── 1. PROFILES ──────────────────────────────────────────────
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT 'visitor',
  display_name TEXT NOT NULL DEFAULT 'Visitor',
  avatar_emoji TEXT NOT NULL DEFAULT '👤',
  bio TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. LETTERS ───────────────────────────────────────────────
CREATE TABLE public.letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT NOT NULL,
  mood TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 3. SONGS ─────────────────────────────────────────────────
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  url TEXT,
  album_cover TEXT,
  recipient TEXT DEFAULT 'jane',
  added_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 4. MEMORIES ──────────────────────────────────────────────
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  memory_date DATE,
  creator UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 5. DAILY QUESTIONS ───────────────────────────────────────
CREATE TABLE public.daily_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  question_date DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 6. DAILY ANSWERS ─────────────────────────────────────────
CREATE TABLE public.daily_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.daily_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

-- ─── 7. MOODS ─────────────────────────────────────────────────
CREATE TABLE public.moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 8. PET ───────────────────────────────────────────────────
CREATE TABLE public.pet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Biscuit',
  hunger INTEGER NOT NULL DEFAULT 75,
  happiness INTEGER NOT NULL DEFAULT 85,
  last_fed_by UUID REFERENCES public.profiles(id),
  last_played_by UUID REFERENCES public.profiles(id),
  last_fed_at TIMESTAMPTZ,
  last_played_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 9. PET ACTIONS ───────────────────────────────────────────
CREATE TABLE public.pet_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 10. SURPRISES ────────────────────────────────────────────
CREATE TABLE public.surprises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  to_user UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  title TEXT,
  is_opened BOOLEAN NOT NULL DEFAULT false,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 11. JANE LORE ────────────────────────────────────────────
CREATE TABLE public.jane_lore (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '???',
  emoji TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category, key)
);

-- ─── 12. QUIZ QUESTIONS ───────────────────────────────────────
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  hint TEXT,
  creator TEXT NOT NULL DEFAULT 'josh',
  target TEXT NOT NULL DEFAULT 'jane',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 13. REACTIONS ────────────────────────────────────────────
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- ─── SEED DATA ────────────────────────────────────────────────

-- Virtual pet (JJ)
INSERT INTO public.pet (name, hunger, happiness) VALUES ('JJ', 100, 100);

-- Jane Lore seed (Favorit: Ayam Geprek!)
INSERT INTO public.jane_lore (category, key, value, emoji) VALUES
  ('stats', 'cute', '95', '🌸'),
  ('stats', 'chaos', '40', '⚡'),
  ('stats', 'sleepiness', '85', '😴'),
  ('stats', 'loveliness', '9999', '💗'),
  ('favorites', 'food', 'Ayam Geprek 🍗🌶️', '🍗'),
  ('favorites', 'song', 'Late night acoustic tracks', '🎵'),
  ('favorites', 'movie', 'Studio Ghibli & Comfort films', '🎬'),
  ('favorites', 'place', 'Any cozy couch under a blanket', '📍'),
  ('habits', 'morning', 'Snoozing the alarm 5 times minimum', '☀️'),
  ('facts', 'signature_phrase', '''Terserah... tapi kamu yang pilih''', '✨'),
  ('facts', 'weakness', 'Cute plushies & cold drinks', '🌟')
ON CONFLICT (category, key) DO UPDATE SET value = EXCLUDED.value;

-- Quiz questions
INSERT INTO public.quiz_questions (question, options, correct_index, hint) VALUES
  ('What would Jane most likely be doing on a quiet Sunday morning?', '["Sleeping in cozy under the blanket 😴", "Going for an early run 🏃", "Cleaning the house 🧹", "Studying spreadsheets 📊"]', 0, 'she loves cozy rest'),
  ('Jane''s reaction when a dinner plan gets cancelled last minute?', '["Super sad & crying 😭", "Secretly very relieved to stay home in pajamas 😌", "Instantly plans 3 new parties 🎉", "Gets mad at everyone 😤"]', 1, 'introvert comfort vibes'),
  ('What is Jane''s official most-used phrase in any decision?', '["''Terserah... tapi kamu yang pilih''", "''Aku yang putusin semuanya''", "''Gak mau tahu''", "''Gas pol''"]', 0, 'classic Jane trademark'),
  ('If Jane could eat one comfort meal forever, it would be...', '["Ayam Geprek pedas 🍗🌶️", "Dry salad without dressing 🥗", "Plain crackers 🍪", "Black coffee only ☕"]', 0, 'pedas dan gurih'),
  ('How loved is Jane Bernadine in this universe?', '["A little bit", "Normal amount", "Infinitely without limit 💗", "Can''t measure"]', 2, 'easiest question in the world')
ON CONFLICT DO NOTHING;

-- Daily questions
INSERT INTO public.daily_questions (question, question_date) VALUES
  ('What made you smile today?', CURRENT_DATE),
  ('What are you grateful for right now?', CURRENT_DATE + 1),
  ('If today were a color, what would it be?', CURRENT_DATE + 2),
  ('What''s one small thing that made your day better?', CURRENT_DATE + 3),
  ('What song is stuck in your head?', CURRENT_DATE + 4),
  ('What do you want to do together next?', CURRENT_DATE + 5),
  ('Describe your day in three emojis.', CURRENT_DATE + 6)
ON CONFLICT (question_date) DO NOTHING;

-- ─── ROW LEVEL SECURITY (RLS) ─────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jane_lore ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- ─── POLICIES ─────────────────────────────────────────────────

-- Profiles
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Letters
CREATE POLICY "letters_read" ON public.letters FOR SELECT TO authenticated USING (true);
CREATE POLICY "letters_insert" ON public.letters FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender);
CREATE POLICY "letters_update" ON public.letters FOR UPDATE TO authenticated USING (auth.uid() = recipient);

-- Songs
CREATE POLICY "songs_read" ON public.songs FOR SELECT USING (true);
CREATE POLICY "songs_insert" ON public.songs FOR INSERT TO authenticated WITH CHECK (auth.uid() = added_by);
CREATE POLICY "songs_delete" ON public.songs FOR DELETE USING (true);

-- Memories
CREATE POLICY "memories_read" ON public.memories FOR SELECT USING (true);
CREATE POLICY "memories_insert" ON public.memories FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator);

-- Daily Questions
CREATE POLICY "dq_read" ON public.daily_questions FOR SELECT USING (true);

-- Daily Answers
CREATE POLICY "da_read" ON public.daily_answers FOR SELECT USING (true);
CREATE POLICY "da_insert" ON public.daily_answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "da_update" ON public.daily_answers FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Moods
CREATE POLICY "moods_read" ON public.moods FOR SELECT USING (true);
CREATE POLICY "moods_insert" ON public.moods FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Pet
CREATE POLICY "pet_read" ON public.pet FOR SELECT USING (true);
CREATE POLICY "pet_update" ON public.pet FOR UPDATE TO authenticated USING (true);

-- Pet Actions
CREATE POLICY "pa_read" ON public.pet_actions FOR SELECT USING (true);
CREATE POLICY "pa_insert" ON public.pet_actions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Surprises
CREATE POLICY "surprises_read" ON public.surprises FOR SELECT TO authenticated
  USING (auth.uid() = to_user OR auth.uid() = from_user);
CREATE POLICY "surprises_insert" ON public.surprises FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = from_user);
CREATE POLICY "surprises_update" ON public.surprises FOR UPDATE TO authenticated
  USING (auth.uid() = to_user);

-- Jane Lore
CREATE POLICY "jl_read" ON public.jane_lore FOR SELECT USING (true);
CREATE POLICY "jl_update" ON public.jane_lore FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND username = 'jane'));
CREATE POLICY "jl_insert" ON public.jane_lore FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND username = 'jane'));

-- Quiz
CREATE POLICY "quiz_read" ON public.quiz_questions FOR SELECT USING (true);

-- Reactions
CREATE POLICY "reactions_read" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "reactions_insert" ON public.reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete" ON public.reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ─── TRIGGER: AUTO CREATE PROFILE (BULLETPROOF) ───────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_emoji)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'visitor'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(COALESCE(NEW.email, 'user'), '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '👤')
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block user creation even if profile insertion encounters an unexpected issue
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
