import { supabase } from './supabaseClient';

export interface LessonProgress {
  id?: string;
  lesson_id: string;
  user_id?: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  learned_word_ids: string[];
  score: number;
  last_studied_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getAllProgress(): Promise<Record<string, LessonProgress>> {
  const { data, error } = await supabase.from('lesson_progress').select('*');
  if (error) {
    console.error('Failed to load progress:', error.message);
    return {};
  }
  const map: Record<string, LessonProgress> = {};
  for (const row of data ?? []) {
    map[row.lesson_id] = row as LessonProgress;
  }
  return map;
}

export async function getProgress(lessonId: string): Promise<LessonProgress | null> {
  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('lesson_id', lessonId)
    .maybeSingle();
  if (error) {
    console.error('Failed to load progress for lesson:', error.message);
    return null;
  }
  return (data as LessonProgress) ?? null;
}

export async function upsertProgress(progress: LessonProgress, userId?: string | null): Promise<void> {
  const { error } = await supabase.from('lesson_progress').upsert(
    {
      lesson_id: progress.lesson_id,
      user_id: userId ?? null,
      status: progress.status,
      learned_word_ids: progress.learned_word_ids,
      score: progress.score,
      last_studied_at: progress.last_studied_at,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' }
  );
  if (error) console.error('Failed to save progress:', error.message);
}

export async function markWordLearned(
  lessonId: string,
  wordId: string,
  totalWords: number,
  userId?: string | null
): Promise<LessonProgress> {
  const existing = await getProgress(lessonId);
  const learned = existing?.learned_word_ids ?? [];
  if (!learned.includes(wordId)) {
    learned.push(wordId);
  }
  const status: LessonProgress['status'] =
    learned.length >= totalWords ? 'completed' : 'in_progress';
  const progress: LessonProgress = {
    lesson_id: lessonId,
    status,
    learned_word_ids: learned,
    score: existing?.score ?? 0,
    last_studied_at: new Date().toISOString(),
  };
  await upsertProgress(progress, userId);
  return progress;
}

export async function saveQuizScore(
  lessonId: string,
  score: number,
  totalWords: number,
  userId?: string | null
): Promise<void> {
  const existing = await getProgress(lessonId);
  const bestScore = Math.max(existing?.score ?? 0, score);
  const learned = existing?.learned_word_ids ?? [];
  const status: LessonProgress['status'] =
    learned.length >= totalWords && bestScore >= totalWords * 0.7 ? 'completed' : (existing?.status ?? 'in_progress');
  await upsertProgress(
    {
      lesson_id: lessonId,
      status,
      learned_word_ids: learned,
      score: bestScore,
      last_studied_at: new Date().toISOString(),
    },
    userId
  );
}
