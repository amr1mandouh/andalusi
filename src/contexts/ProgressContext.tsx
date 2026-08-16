import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAllProgress, type LessonProgress } from '../services/progressService';
import { getAllLessons } from '../data/lessons';

interface ProgressContextValue {
  progress: Record<string, LessonProgress>;
  loading: boolean;
  refresh: () => Promise<void>;
  updateLesson: (lessonId: string, update: Partial<LessonProgress>) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const data = await getAllProgress();
    setProgress(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const updateLesson = (lessonId: string, update: Partial<LessonProgress>) => {
    setProgress((prev) => ({
      ...prev,
      [lessonId]: { ...prev[lessonId], ...update, lesson_id: lessonId } as LessonProgress,
    }));
  };

  return (
    <ProgressContext.Provider value={{ progress, loading, refresh, updateLesson }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}

export function useLessonStats() {
  const { progress } = useProgress();
  const lessons = getAllLessons();
  const total = lessons.length;
  const completed = Object.values(progress).filter((p) => p.status === 'completed').length;
  const inProgress = Object.values(progress).filter((p) => p.status === 'in_progress').length;
  const totalWords = lessons.reduce((sum, l) => sum + l.words.length, 0);
  const learnedWords = Object.values(progress).reduce(
    (sum, p) => sum + (p.learned_word_ids?.length ?? 0),
    0
  );
  return { total, completed, inProgress, totalWords, learnedWords, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
}
