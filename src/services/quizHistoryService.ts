import { supabase } from './supabaseClient';

export interface QuizAttempt {
  id: string;
  lesson_id: string;
  lesson_title: string;
  score: number;
  total: number;
  question_types: string[];
  created_at: string;
}

const GUEST_KEY = 'andalusi_quiz_history';

function readGuestHistory(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as QuizAttempt[]) : [];
  } catch {
    return [];
  }
}

function writeGuestHistory(attempts: QuizAttempt[]): void {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(attempts));
  } catch {
    // ignore storage failures
  }
}

export async function saveQuizAttempt(
  attempt: Omit<QuizAttempt, 'id' | 'created_at'>,
  userId: string | null
): Promise<void> {
  if (userId) {
    const { error } = await supabase.from('quiz_attempts').insert({
      user_id: userId,
      lesson_id: attempt.lesson_id,
      lesson_title: attempt.lesson_title,
      score: attempt.score,
      total: attempt.total,
      question_types: attempt.question_types,
    });
    if (error) console.error('Failed to save quiz attempt:', error.message);
    return;
  }

  const current = readGuestHistory();
  current.unshift({
    ...attempt,
    id: `guest-${Date.now()}`,
    created_at: new Date().toISOString(),
  });
  writeGuestHistory(current.slice(0, 100));
}

export async function getQuizHistory(userId: string | null): Promise<QuizAttempt[]> {
  if (userId) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) {
      console.error('Failed to load quiz history:', error.message);
      return [];
    }
    return (data as QuizAttempt[]) ?? [];
  }
  return readGuestHistory();
}
