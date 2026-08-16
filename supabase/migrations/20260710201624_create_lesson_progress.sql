/*
# Create lesson progress table (single-tenant, no auth)

1. New Tables
- `lesson_progress`
  - `id` (uuid, primary key)
  - `lesson_id` (text, not null) — references lesson IDs in the frontend data model
  - `status` (text, not null, default 'not_started') — one of: not_started, in_progress, completed
  - `learned_word_ids` (text array, default '{}') — word IDs the user has learned
  - `score` (int, default 0) — quiz score for this lesson
  - `last_studied_at` (timestamptz) — last time the user studied this lesson
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `lesson_progress`.
- Allow anon + authenticated full CRUD — single-tenant app with no sign-in, data is intentionally shared.

3. Notes
- No user_id column — single-tenant app, no auth flow.
- Unique constraint on lesson_id to prevent duplicate progress rows.
- Index on lesson_id for fast lookups.
*/

CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  status text NOT NULL DEFAULT 'not_started',
  learned_word_ids text[] NOT NULL DEFAULT '{}',
  score int NOT NULL DEFAULT 0,
  last_studied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS lesson_progress_lesson_id_idx ON lesson_progress(lesson_id);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_progress" ON lesson_progress;
CREATE POLICY "anon_select_progress" ON lesson_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_progress" ON lesson_progress;
CREATE POLICY "anon_insert_progress" ON lesson_progress FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_progress" ON lesson_progress;
CREATE POLICY "anon_update_progress" ON lesson_progress FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_progress" ON lesson_progress;
CREATE POLICY "anon_delete_progress" ON lesson_progress FOR DELETE
  TO anon, authenticated USING (true);
