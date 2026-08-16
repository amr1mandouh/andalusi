import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Volume2, Quote, Star, SkipForward } from 'lucide-react';
import type { Lesson } from '../data/lessons';
import { initSpeech, type Language } from '../services/speechService';
import { getElevenLabsAudio } from '../services/audioService';
import { markWordLearned } from '../services/progressService';
import { useProgress } from '../contexts/ProgressContext';
import { useStarred } from '../contexts/StarredContext';
import { useAuth } from '../contexts/AuthContext';
import NumbersProTips from '../components/NumbersProTips';
import { getIdiomsForWord, dialectLabels } from '../data/idioms';

interface LessonPageProps {
  lesson: Lesson;
  onBack: () => void;
  onComplete: () => void;
}

// Full-screen, single-purpose study view — no modal chrome, no swipe. The
// only ways to move are the explicit Back / Next controls at the bottom.
export default function LessonPage({ lesson, onBack, onComplete }: LessonPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studyLang, setStudyLang] = useState<Language>('es');
  const { updateLesson } = useProgress();
  const { user } = useAuth();
  const { isWordStarred, toggleWordStar } = useStarred();
  const totalWords = lesson.words.length;
  const currentWord = lesson.words[currentIndex];
  const isLast = currentIndex === totalWords - 1;
  const isNumbersCategory = lesson.categoryId === 'numbers';
  const relatedIdioms = getIdiomsForWord(currentWord.id);

  useEffect(() => {
    initSpeech();
  }, []);

  useEffect(() => {
    const word = lesson.words[currentIndex];
    if (word) {
      markWordLearned(lesson.id, word.id, totalWords, user?.id ?? null).then((p) => updateLesson(lesson.id, p));
    }
  }, [currentIndex, lesson.id, lesson.words, totalWords, updateLesson, user?.id]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex((i) => Math.min(i + 1, totalWords - 1));
    }
  };

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const progress = ((currentIndex + 1) / totalWords) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-mint-50 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface">
      {/* Minimal focused header — just where you are and a way out, nothing else competing for attention */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-mint-50/80 dark:bg-surface/80 border-b border-mint-100 dark:border-line-subtle">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 dark:text-ink-secondary hover:text-forest-700 dark:hover:text-ink-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Lessons</span>
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-ink-primary">{lesson.title}</h1>
          <p className="text-gray-500 dark:text-ink-secondary mt-1">{lesson.description}</p>

          <div className="flex items-center gap-2 mt-5">
            <div className="flex-1 h-2 bg-mint-100 dark:bg-surface-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-forest-500 to-forest-700 dark:from-accent dark:to-accent-active rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-ink-secondary tabular-nums">
              {currentIndex + 1} / {totalWords}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setStudyLang('es')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              studyLang === 'es' ? 'bg-forest-700 dark:bg-accent text-white dark:text-surface shadow-md' : 'bg-mint-100 dark:bg-surface-elevated text-gray-600 dark:text-ink-secondary hover:bg-mint-200'
            }`}
          >
            Learn Spanish
          </button>
          <button
            onClick={() => setStudyLang('en')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              studyLang === 'en' ? 'bg-forest-700 dark:bg-accent text-white dark:text-surface shadow-md' : 'bg-mint-100 dark:bg-surface-elevated text-gray-600 dark:text-ink-secondary hover:bg-mint-200'
            }`}
          >
            Learn English
          </button>
        </div>

        <div className="bg-white dark:bg-surface-card rounded-3xl shadow-lg border border-mint-100 dark:border-line-subtle p-8 md:p-12 relative">
          <button
            onClick={() => toggleWordStar(currentWord.id)}
            className={`absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
              isWordStarred(currentWord.id)
                ? 'bg-forest-100 dark:bg-accent/20 text-forest-600'
                : 'bg-mint-50 dark:bg-surface-elevated text-gray-300 dark:text-ink-muted hover:text-forest-500'
            }`}
            aria-label={isWordStarred(currentWord.id) ? 'Unstar this word' : 'Star this word'}
          >
            <Star size={20} fill={isWordStarred(currentWord.id) ? 'currentColor' : 'none'} />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint-100 text-forest-700 text-xs font-medium mb-6">
              Word {currentIndex + 1} of {totalWords}
            </div>

            <div className="text-5xl mb-4">{currentWord.emoji}</div>

            <div className="mb-8">
              <p className="text-sm text-gray-400 dark:text-ink-muted mb-2">
                {studyLang === 'es' ? 'Spanish' : 'English'}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-ink-primary mb-3">
                {studyLang === 'es' ? currentWord.es : currentWord.en}
              </h2>
              {currentWord.pronunciation && studyLang === 'es' && (
                <p className="text-lg text-gray-400 dark:text-ink-muted italic">{currentWord.pronunciation}</p>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-8 px-4 sm:px-8">
              <button
                onClick={() => getElevenLabsAudio(currentWord.es, 'es')}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-mint-50 hover:bg-mint-100 text-forest-700 font-semibold transition-all active:scale-[0.98] shadow-sm border border-mint-200"
              >
                <Volume2 size={22} />
                <span className="text-base">Listen Spanish</span>
                <span className="text-sm text-forest-500 ml-1">{currentWord.es}</span>
              </button>

              <div className="h-px bg-mint-100 dark:bg-surface-elevated" />

              <button
                onClick={() => getElevenLabsAudio(currentWord.en, 'en')}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-semibold transition-all active:scale-[0.98] shadow-sm border border-teal-100"
              >
                <Volume2 size={22} />
                <span className="text-base">Listen English</span>
                <span className="text-sm text-teal-500 ml-1">{currentWord.en}</span>
              </button>
            </div>

            <div className="pt-6 border-t border-mint-100 dark:border-line-subtle space-y-4">
              <div>
                <p className="text-sm text-gray-400 dark:text-ink-muted mb-1">
                  {studyLang === 'es' ? 'English' : 'Spanish'}
                </p>
                <p className="text-2xl font-semibold text-gray-600 dark:text-ink-secondary">
                  {studyLang === 'es' ? currentWord.en : currentWord.es}
                </p>
              </div>
              <div className="pt-3 border-t border-mint-50">
                <p className="text-sm text-gray-400 dark:text-ink-muted mb-1">Arabic</p>
                <p className="text-2xl font-semibold text-gray-700" dir="rtl">
                  {currentWord.ar}
                </p>
              </div>
            </div>
          </div>

          {currentWord.context && (
            <div className="mt-6 pt-6 border-t border-mint-100 dark:border-line-subtle text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-mint-100 dark:bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Quote size={12} className="text-forest-600 dark:text-accent" />
                </div>
                <p className="text-xs font-semibold text-forest-700 dark:text-accent uppercase tracking-wide">
                  In context
                </p>
              </div>
              <div className="bg-mint-50 dark:bg-surface-elevated rounded-2xl p-4 space-y-1.5">
                <p className="text-base font-medium text-gray-800 dark:text-ink-primary">{currentWord.context.es}</p>
                <p className="text-sm text-gray-500 dark:text-ink-secondary">{currentWord.context.en}</p>
                <p className="text-sm text-gray-500 dark:text-ink-secondary" dir="rtl">
                  {currentWord.context.ar}
                </p>
              </div>
            </div>
          )}
        </div>

        {relatedIdioms.length > 0 && (
          <div className="mt-6 space-y-3">
            {relatedIdioms.map((idiom) => (
              <div
                key={idiom.id}
                className="bg-violet-50 dark:bg-violet-500/10 rounded-2xl border-2 border-violet-200 dark:border-violet-500/30 p-5"
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center flex-shrink-0">
                    <Quote size={16} className="text-white" />
                  </div>
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                    {idiom.kind === 'sentence' ? 'Sentence linked to this word' : 'Idiom linked to this word'}
                  </p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 dark:bg-surface-elevated text-violet-600 dark:text-violet-300">
                    {dialectLabels[idiom.dialect]}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-ink-primary">{idiom.en}</h3>
                <p className="text-gray-600 dark:text-ink-secondary mt-0.5">{idiom.es}</p>
                <p className="text-sm text-gray-500 dark:text-ink-secondary mt-2">{idiom.meaning}</p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => getElevenLabsAudio(idiom.en, 'en')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-accent/10 hover:bg-teal-100 dark:hover:bg-accent/20 text-teal-700 dark:text-accent text-sm font-medium transition-all active:scale-95"
                  >
                    <Volume2 size={14} />
                    English
                  </button>
                  <button
                    onClick={() => getElevenLabsAudio(idiom.es, 'es')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mint-50 dark:bg-accent/10 hover:bg-mint-100 dark:hover:bg-accent/20 text-forest-700 dark:text-accent text-sm font-medium transition-all active:scale-95"
                  >
                    <Volume2 size={14} />
                    Spanish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isNumbersCategory && isLast && <div className="mt-8"><NumbersProTips /></div>}

        <div className="flex items-center justify-between mt-6 pb-8">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-gray-600 dark:text-ink-secondary hover:bg-mint-100 dark:hover:bg-surface-elevated disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex items-center gap-2">
            {!isLast && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-500 dark:text-ink-secondary hover:bg-mint-100 dark:hover:bg-surface-elevated transition-all"
                title="Skip words you already know"
              >
                <SkipForward size={18} />
                <span className="text-sm font-medium">Skip</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-surface shadow-md hover:shadow-lg transition-all"
            >
              {isLast ? (
                <>
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">Finish Lesson</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold">Next</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
