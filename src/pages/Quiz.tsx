import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, XCircle, Volume2, RotateCcw, Trophy, History } from 'lucide-react';
import { getAllLessons, type Word } from '../data/lessons';
import { initSpeech } from '../services/speechService';
import { getElevenLabsAudio } from '../services/audioService';
import { saveQuizScore } from '../services/progressService';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { getQuizHistory, type QuizAttempt } from '../services/quizHistoryService';

interface QuizQuestion {
  word: Word;
  promptLang: 'en' | 'es';
  options: string[];
  answer: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuiz(allWords: Word[], count: number): QuizQuestion[] {
  const selected = shuffle(allWords).slice(0, count);
  return selected.map((word) => {
    const promptLang: 'en' | 'es' = Math.random() > 0.5 ? 'en' : 'es';
    const answer = promptLang === 'en' ? word.es : word.en;
    const distractorPool = allWords.filter((w) => w.id !== word.id);
    const distractors = shuffle(distractorPool)
      .slice(0, 3)
      .map((w) => (promptLang === 'en' ? w.es : w.en));
    const options = shuffle([answer, ...distractors]);
    return { word, promptLang, options, answer };
  });
}

export default function Quiz() {
  const allWords = useMemo(() => getAllLessons().flatMap((l) => l.words), []);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { refresh } = useProgress();
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    initSpeech();
    setQuestions(buildQuiz(allWords, 10));
  }, [allWords]);

  useEffect(() => {
    getQuizHistory(user?.id ?? null).then(setHistory);
  }, [user?.id]);

  const current = questions[currentIdx];

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === current.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
      const lessonIds = new Set(questions.map((q) => {
        const lesson = getAllLessons().find((l) => l.words.some((w) => w.id === q.word.id));
        return lesson?.id ?? '';
      }));
      lessonIds.forEach((id) => id && saveQuizScore(id, score, 10, user?.id ?? null));
      refresh();
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setQuestions(buildQuiz(allWords, 10));
    setCurrentIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  if (questions.length === 0) {
    return <div className="max-w-2xl mx-auto px-6 py-8 text-center text-gray-500 dark:text-ink-secondary">Loading quiz...</div>;
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-3xl shadow-lg border border-gray-100 dark:border-line-subtle p-10 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            percent >= 70 ? 'bg-emerald-50 dark:bg-accent/10' : 'bg-slate-100 dark:bg-surface-elevated'
          }`}>
            <Trophy size={40} className={percent >= 70 ? 'text-emerald-500' : 'text-slate-500'} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-ink-primary mb-2">Quiz Complete!</h2>
          <p className="text-gray-500 dark:text-ink-secondary mb-6">
            You scored {score} out of {questions.length} ({percent}%)
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <div className="px-6 py-4 rounded-2xl bg-emerald-50 dark:bg-accent/10">
              <p className="text-3xl font-bold text-emerald-600 dark:text-accent">{score}</p>
              <p className="text-sm text-emerald-600 dark:text-accent mt-1">Correct</p>
            </div>
            <div className="px-6 py-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10">
              <p className="text-3xl font-bold text-rose-500 dark:text-rose-400">{questions.length - score}</p>
              <p className="text-sm text-rose-500 dark:text-rose-400 mt-1">Wrong</p>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 dark:bg-accent hover:bg-emerald-800 dark:hover:bg-accent-hover text-white dark:text-surface font-semibold shadow-md transition-all"
          >
            <RotateCcw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const promptText = current.promptLang === 'en' ? current.word.en : current.word.es;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {history.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <History size={16} className="text-emerald-600" />
            <h2 className="text-base font-bold text-gray-900 dark:text-ink-primary">Recent Lesson Quizzes</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {history.slice(0, 6).map((h) => {
              const pct = Math.round((h.score / h.total) * 100);
              return (
                <div
                  key={h.id}
                  className="rounded-2xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card px-4 py-3 flex items-center justify-between gap-3"
                >
                  <span className="text-base text-gray-600 dark:text-ink-secondary truncate">{h.lesson_title || h.lesson_id}</span>
                  <span className={`text-base font-semibold flex-shrink-0 ${pct >= 70 ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {h.score}/{h.total} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">Quiz</h1>
        <p className="text-gray-500 dark:text-ink-secondary mt-2">Choose the correct translation</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-ink-secondary">
          {currentIdx + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-3xl shadow-lg border border-gray-100 dark:border-line-subtle p-8 mb-6">
        <div className="text-center mb-6">
          <p className="text-base text-gray-400 dark:text-ink-muted mb-2">
            What is the {current.promptLang === 'en' ? 'Spanish' : 'English'} for?
          </p>
          <div className="text-4xl mb-3">{current.word.emoji}</div>
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">{promptText}</h2>
            <button
              onClick={() => getElevenLabsAudio(promptText, current.promptLang)}
              className="w-10 h-10 rounded-full bg-gray-50 dark:bg-surface-elevated hover:bg-gray-100 dark:hover:bg-surface-strong text-gray-500 dark:text-ink-secondary flex items-center justify-center transition-all active:scale-90"
            >
              <Volume2 size={18} />
            </button>
          </div>
          <p className="text-lg text-gray-500 dark:text-ink-secondary mt-3" dir="rtl">{current.word.ar}</p>
        </div>

        <div className="grid gap-3">
          {current.options.map((option) => {
            const isCorrect = option === current.answer;
            const isSelected = option === selected;
            let style = 'border-gray-200 dark:border-line hover:border-emerald-300 dark:hover:border-accent/50 hover:bg-emerald-50 dark:hover:bg-accent/10';
            if (answered && isCorrect) {
              style = 'border-emerald-500 bg-emerald-50 dark:bg-accent/10';
            } else if (answered && isSelected && !isCorrect) {
              style = 'border-rose-500 bg-rose-50 dark:bg-rose-500/10';
            } else if (answered) {
              style = 'border-gray-200 dark:border-line opacity-50';
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={answered}
                className={`flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 ${style}`}
              >
                <span className="text-lg font-semibold text-gray-800 dark:text-ink-primary">{option}</span>
                {answered && isCorrect && <CheckCircle2 className="text-emerald-500" size={22} />}
                {answered && isSelected && !isCorrect && <XCircle className="text-rose-500" size={22} />}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-emerald-700 dark:bg-accent hover:bg-emerald-800 dark:hover:bg-accent-hover text-white dark:text-surface font-semibold shadow-md transition-all"
          >
            {currentIdx + 1 >= questions.length ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}
