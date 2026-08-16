/*
# Add authentication support + user-scoped data (Andalusí)

1. Changes to existing tables
- `lesson_progress`: add nullable `user_id` (references auth.users). Existing
  guest rows (user_id IS NULL) keep working exactly as before — nothing is
  deleted or broken for current users. Unique index now covers (user_id, lesson_id)
  so each signed-in user has independent progress per lesson.

2. New tables
- `profiles` — one row per authenticated user: chosen level, whether they've
  completed the placement test.
- `starred_items` — starred words/idioms per authenticated user.
- `quiz_attempts` — history of mandatory post-lesson quiz results per user
  (or per guest session when user_id is null), used by the Quizzes page.

3. Security
- RLS enabled on every table.
- Signed-in users can only read/write their own rows (auth.uid() = user_id).
- Guest (anon) rows are allowed only where user_id IS NULL, preserving the
  original single-tenant guest behavior for people who don't sign in.
*/

-- 1. lesson_progress: add user scoping -------------------------------------
ALTER TABLE lesson_progress ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DROP INDEX IF EXISTS lesson_progress_lesson_id_idx;
CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_user_lesson_idx
  ON lesson_progress (COALESCE(user_id::text, 'guest'), lesson_id);

DROP POLICY IF EXISTS "anon_select_progress" ON lesson_progress;
DROP POLICY IF EXISTS "anon_insert_progress" ON lesson_progress;
DROP POLICY IF EXISTS "anon_update_progress" ON lesson_progress;
DROP POLICY IF EXISTS "anon_delete_progress" ON lesson_progress;

CREATE POLICY "select_own_or_guest_progress" ON lesson_progress FOR SELECT
  TO anon, authenticated USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "insert_own_or_guest_progress" ON lesson_progress FOR INSERT
  TO anon, authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "update_own_or_guest_progress" ON lesson_progress FOR UPDATE
  TO anon, authenticated USING (user_id IS NULL OR user_id = auth.uid())
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "delete_own_or_guest_progress" ON lesson_progress FOR DELETE
  TO anon, authenticated USING (user_id IS NULL OR user_id = auth.uid());

-- 2. profiles ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  level text,
  placement_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_profile_select" ON profiles;
DROP POLICY IF EXISTS "own_profile_insert" ON profiles;
DROP POLICY IF EXISTS "own_profile_update" ON profiles;

CREATE POLICY "own_profile_select" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
CREATE POLICY "own_profile_insert" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own_profile_update" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 3. starred_items -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS starred_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('word', 'idiom')),
  item_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS starred_items_user_item_idx
  ON starred_items(user_id, item_type, item_id);

ALTER TABLE starred_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_starred_select" ON starred_items;
DROP POLICY IF EXISTS "own_starred_insert" ON starred_items;
DROP POLICY IF EXISTS "own_starred_delete" ON starred_items;

CREATE POLICY "own_starred_select" ON starred_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own_starred_insert" ON starred_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_starred_delete" ON starred_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 4. quiz_attempts ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  lesson_title text NOT NULL DEFAULT '',
  score int NOT NULL,
  total int NOT NULL,
  question_types text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_or_guest_qa" ON quiz_attempts;
DROP POLICY IF EXISTS "insert_own_or_guest_qa" ON quiz_attempts;

CREATE POLICY "select_own_or_guest_qa" ON quiz_attempts FOR SELECT
  TO anon, authenticated USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "insert_own_or_guest_qa" ON quiz_attempts FOR INSERT
  TO anon, authenticated WITH CHECK (user_id IS NULL OR user_id = auth.uid());
