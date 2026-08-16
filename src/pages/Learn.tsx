import { useState } from 'react';
import * as Icons from 'lucide-react';
import { getLessonsGroupedByLevel, getCategoryById, LEVELS, levelLabels, type Lesson, type Level } from '../data/lessons';
import { useProgress } from '../contexts/ProgressContext';
import { useLevel } from '../contexts/LevelContext';
import { CheckCircle2, Circle, Clock, ChevronRight, GraduationCap } from 'lucide-react';

interface LearnProps {
  onOpenLesson: (lesson: Lesson) => void;
}

// Category accent colors — kept distinct from each other, but no orange or
// yellow anywhere in the identity.
const categoryColorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-accent/20', text: 'text-emerald-700 dark:text-accent', border: 'border-emerald-200 dark:border-accent/30', gradient: 'from-emerald-500 to-forest-600' },
  sky: { bg: 'bg-sky-50 dark:bg-sky-500/20', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-500/30', gradient: 'from-sky-500 to-blue-600' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-500/30', gradient: 'from-rose-500 to-pink-600' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-500/20', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-500/30', gradient: 'from-cyan-500 to-teal-600' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-500/30', gradient: 'from-indigo-500 to-violet-600' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-500/20', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-200 dark:border-violet-500/30', gradient: 'from-violet-500 to-purple-600' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-500/20', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-500/30', gradient: 'from-pink-500 to-rose-600' },
  teal: { bg: 'bg-teal-50 dark:bg-accent/20', text: 'text-teal-700 dark:text-accent', border: 'border-teal-200 dark:border-accent/30', gradient: 'from-teal-500 to-cyan-600' },
};

// A calm, single-family progression from soft mint (A1) to deep forest (C2) —
// the level itself visually communicates how deep into the forest you are.
const levelGradient: Record<Level, string> = {
  A1: 'from-mint-400 to-emerald-500',
  A2: 'from-emerald-500 to-teal-600',
  B1: 'from-teal-600 to-forest-600',
  B2: 'from-forest-600 to-forest-700',
  C1: 'from-forest-700 to-forest-800',
  C2: 'from-slate-700 to-forest-900',
};

export default function Learn({ onOpenLesson }: LearnProps) {
  const { progress } = useProgress();
  const { level: userLevel } = useLevel();
  const grouped = getLessonsGroupedByLevel();

  // Focused Learning Flow: a level is (almost) always selected — Learn opens
  // straight into the learner's own level instead of an empty picker.
  const [focusedLevel, setFocusedLevel] = useState<Level>(userLevel ?? 'A1');

  const focusedLessons = grouped[focusedLevel];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">Learn</h1>
        <p className="text-gray-500 dark:text-ink-secondary mt-2">
          Lessons are grouped by level (A1–C2). Each lesson has 10 words with audio.
        </p>
        {userLevel === null && (
          <div className="mt-3 flex items-center gap-2 text-sm text-forest-700 dark:text-accent">
            <GraduationCap size={16} />
            You haven't set your level yet — set it in Settings so Learn opens straight to it.
          </div>
        )}
      </div>

      <div className="flex gap-6 items-start">
        {/* Level rail — every other level collapses to a compact icon here so
            the chosen level's lessons get the full, uncluttered stage. */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-1 md:pb-0 flex-shrink-0">
          {LEVELS.map((level) => {
            const lessons = grouped[level];
            const isFocused = focusedLevel === level;
            const isUserLevel = userLevel === level;
            const lessonCount = lessons.length;
            const completedCount = lessons.filter((l) => progress[l.id]?.status === 'completed').length;
            const pct = lessonCount ? (completedCount / lessonCount) * 100 : 0;

            return (
              <button
                key={level}
                onClick={() => setFocusedLevel(level)}
                title={`${levelLabels[level]} — ${completedCount}/${lessonCount} lessons`}
                className={`group relative flex-shrink-0 flex items-center gap-3 rounded-2xl border-2 transition-all duration-300 ${
                  isFocused
                    ? 'border-forest-400 dark:border-accent/60 bg-mint-50 dark:bg-surface-elevated/60 shadow-md shadow-forest-600/10 px-4 py-3 md:w-56'
                    : 'border-transparent bg-white/60 dark:bg-surface-card/60 hover:border-mint-200 dark:hover:border-line-subtle px-3 py-3 md:w-14 md:justify-center'
                }`}
              >
                <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${levelGradient[level]} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{level}</span>
                  {isUserLevel && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-forest-600 dark:bg-accent border-2 border-white dark:border-surface flex items-center justify-center">
                      <GraduationCap size={9} className="text-white" />
                    </span>
                  )}
                </div>

                {isFocused && (
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-ink-primary truncate">{levelLabels[level]}</p>
                    <p className="text-xs text-gray-500 dark:text-ink-secondary">{completedCount}/{lessonCount} done</p>
                    <div className="mt-1.5 h-1.5 w-full bg-gray-100 dark:bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${levelGradient[level]} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Full, comfortable stage for the focused level's lessons. */}
        <div className="flex-1 min-w-0 rounded-2xl border-2 border-mint-100 dark:border-line-subtle bg-white/70 dark:bg-surface-elevated/40 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-ink-primary">{levelLabels[focusedLevel]}</h2>
              <p className="text-xs text-gray-500 dark:text-ink-secondary mt-0.5">{focusedLevel} · lessons</p>
            </div>
          </div>

          <div className="space-y-2">
            {focusedLessons.length === 0 && (
              <p className="text-sm text-gray-400 dark:text-ink-secondary py-10 text-center">
                No {focusedLevel} lessons yet — coming soon.
              </p>
            )}
            {focusedLessons.map((lesson) => {
              const p = progress[lesson.id];
              const status = p?.status ?? 'not_started';
              const learnedCount = p?.learned_word_ids?.length ?? 0;
              const totalWords = lesson.words.length;
              const category = getCategoryById(lesson.categoryId);
              const catColors = categoryColorMap[category?.color ?? 'emerald'] ?? categoryColorMap.emerald;
              const CatIcon = (Icons as unknown as Record<string, typeof Icons.Smile>)[category?.icon ?? 'Smile'] ?? Icons.Smile;

              return (
                <button
                  key={lesson.id}
                  onClick={() => onOpenLesson(lesson)}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-gradient-to-br from-white via-mint-50/70 to-mint-100/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card border border-mint-100 dark:border-line-subtle hover:border-forest-300 dark:hover:border-line hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex-shrink-0">
                    {status === 'completed' ? (
                      <CheckCircle2 className="text-forest-600 dark:text-accent" size={24} />
                    ) : status === 'in_progress' ? (
                      <Clock className="text-teal-600 dark:text-accent" size={24} />
                    ) : (
                      <Circle className="text-gray-300 dark:text-ink-muted" size={24} />
                    )}
                  </div>
                  <div className="flex-shrink-0 text-2xl">{lesson.words[0]?.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-ink-primary group-hover:text-forest-700 dark:group-hover:text-accent transition-colors">
                        {lesson.title}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${catColors.bg} ${catColors.text} inline-flex items-center gap-1`}>
                        <CatIcon size={11} />
                        {category?.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-ink-secondary mt-0.5">{lesson.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 max-w-[200px] h-2 bg-gray-100 dark:bg-surface-elevated rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest-600 dark:bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${(learnedCount / totalWords) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 dark:text-ink-secondary font-medium">
                        {learnedCount}/{totalWords} words
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 dark:text-ink-muted group-hover:text-forest-600 dark:group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}