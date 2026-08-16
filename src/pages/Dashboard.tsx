import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, TrendingUp, ArrowRight, GraduationCap, Star, Flame } from 'lucide-react';
import { useLessonStats, useProgress } from '../contexts/ProgressContext';
import { useStarred } from '../contexts/StarredContext';
import { getRecommendedCategories } from '../data/lessons';
import { useLevel } from '../contexts/LevelContext';
import { levelLabels } from '../data/lessons';
import type { Page } from '../components/Sidebar';
import AndalusiLogo from '../components/AndalusiLogo';
import { APP_NAME } from '../config/brand';
import { getCurrentStreak } from '../utils/streak';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const stats = useLessonStats();
  const { progress } = useProgress();
  const { level } = useLevel();
  const { starredWordIds } = useStarred();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getCurrentStreak());
  }, []);

  const quickStats = [
    { label: 'Words learned', value: stats.learnedWords, icon: BookOpen },
    { label: 'Lessons done', value: stats.completed, icon: CheckCircle2 },
    { label: 'Day streak', value: streak, icon: Flame },
    { label: 'Starred', value: starredWordIds.length, icon: Star },
  ];

  const topCategories = getRecommendedCategories(level).slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 dark:from-surface-elevated dark:via-surface-elevated dark:to-surface-card p-8 mb-8 text-white dark:text-ink-primary shadow-lg dark:shadow-none dark:border dark:border-line-subtle">
        <div className="absolute inset-0 andalusi-pattern opacity-40" />
        <div className="absolute -right-8 -top-8 opacity-20">
          <AndalusiLogo size={180} />
        </div>
        <div className="relative">
          <p className="text-sm font-medium text-white/80 dark:text-ink-secondary mb-1">Welcome back to</p>
          <h1 className="text-3xl font-bold mb-4">{APP_NAME}</h1>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
              <Flame size={16} />
              <span className="text-sm font-medium">
                {stats.percent}% of your journey complete
              </span>
            </div>
            {level && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
                <GraduationCap size={16} />
                <span className="text-sm font-medium">{level} · {levelLabels[level]}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate(level === null ? 'settings' : 'learn')}
            className="mt-6 inline-flex items-center gap-2 bg-white dark:bg-accent text-forest-700 dark:text-surface font-semibold px-5 py-3 rounded-xl hover:bg-mint-50 dark:hover:bg-accent-hover transition-all shadow-md"
          >
            {level === null ? 'Set your level' : 'Continue learning'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {quickStats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-gradient-to-br from-white via-mint-50/70 to-mint-100/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-elevated/40 rounded-2xl border border-gray-100 dark:border-line-subtle/40 p-5 flex items-center gap-4 shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-mint-100 dark:bg-surface-elevated/60 text-forest-700 dark:text-accent flex items-center justify-center flex-shrink-0">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-gray-900 dark:text-ink-primary leading-none">{card.value}</p>
                <p className="text-xs text-gray-500 dark:text-accent/80 mt-1 truncate">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="bg-gradient-to-br from-white via-mint-50/70 to-mint-100/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-elevated/40 rounded-2xl border border-gray-100 dark:border-line-subtle/40 p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-forest-600 dark:text-accent" />
            <h2 className="text-base font-bold text-gray-900 dark:text-ink-primary">Overall Progress</h2>
          </div>
          <span className="text-sm font-semibold text-forest-700 dark:text-accent">{stats.completed}/{stats.total} lessons</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-forest-500 to-forest-700 dark:from-accent dark:to-accent-active rounded-full transition-all duration-700"
            style={{ width: `${stats.percent}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-ink-primary">Jump back in</h2>
          {level && (
            <p className="text-xs text-gray-400 dark:text-accent/70 mt-0.5">
              Matched to your {level} level
            </p>
          )}
        </div>
        <button
          onClick={() => onNavigate('learn')}
          className="flex items-center gap-1 text-sm font-medium text-forest-700 dark:text-accent hover:text-forest-800 transition-colors"
        >
          View all <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {topCategories.map((cat) => {
          const totalLessons = cat.lessons.length;
          const completed = cat.lessons.filter((l) => progress[l.id]?.status === 'completed').length;
          return (
            <button
              key={cat.id}
              onClick={() => onNavigate('learn')}
              className="text-left bg-gradient-to-br from-white via-mint-50/70 to-mint-100/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-elevated/40 rounded-2xl border border-gray-100 dark:border-line-subtle/40 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-ink-primary text-sm">{cat.name}</h3>
                <span className="text-xs text-gray-400 dark:text-accent/70">{completed}/{totalLessons}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-600 dark:bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${totalLessons > 0 ? (completed / totalLessons) * 100 : 0}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-surface-elevated dark:to-surface-elevated rounded-2xl p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md border border-forest-800/30">
        <div>
          <h2 className="text-xl font-bold mb-1">Ready to practice?</h2>
          <p className="text-slate-300 dark:text-accent/80 text-sm">Test your knowledge with a quiz or review with flashcards.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => onNavigate('flashcards')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
          >
            Flashcards
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className="px-5 py-2.5 rounded-xl bg-forest-700 dark:bg-accent hover:bg-forest-600 dark:hover:bg-accent-hover text-white dark:text-surface font-medium transition-all shadow-sm"
          >
            Take a Quiz
          </button>
        </div>
      </div>
    </div>
  );
}