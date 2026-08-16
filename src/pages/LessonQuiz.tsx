import { useMemo, useState } from 'react';
import { Volume2, Mic, CheckCircle2, XCircle, PenLine, Ear, ArrowRight, LayoutDashboard, Trophy } from 'lucide-react';
import type { Lesson, Word } from '../data/lessons';
import { getAllLessons, getNextLesson } from '../data/lessons';
import { getElevenLabsAudio } from '../services/audioService';
import {
  isSpeechRecognitionSupported,
  listenOnce,
  isCloseEnough,
  normalizeForCompare,
} from '../services/speechService';
import { saveQuizScore } from '../services/progressService';
import { saveQuizAttempt } from '../services/quizHistoryService';
import { useAuth } from '../contexts/AuthContext';
import { recordActivityToday } from '../utils/streak';

interface LessonQuizProps {
  lesson: Lesson;
  /** Return to the dashboard's daily progress summary. */
  onReturnToDashboard: () => void;
  /** Jump straight into the next lesson without a trip back to the Learn grid. */
  onContinueNext: (nextLesson: Lesson) => void;
}

type QType = 'fill-blank' | 'listening' | 'pronunciation';

interface QuizQuestion {
  type: QType;
  word: Word;
  options?: string[];
  blanked?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function blankWord(word: string): string {
  const chars = word.split('');
  return chars
    .map((c, i) => {
      if (c === ' ' || i === 0) return c;
      return Math.random() < 0.5 ? '_' : c;
    })
    .join('');
}

function buildQuestions(lesson: Lesson): QuizQuestion[] {
  const allWords = getAllLessons().flatMap((l) => l.words);
  const pool = shuffle(lesson.words).slice(0, Math.min(6, lesson.words.length));
  const types: QType[] = ['listening', 'fill-blank', 'pronunciation'];

  return pool.map((word, i) => {
    const type = types[i % types.length];
    if (type === 'listening') {
      const distractors = shuffle(allWords.filter((w) => w.id !== word.id && w.en !== word.en))
        .slice(0, 3)
        .map((w) => w.en);
      const options = shuffle([word.en, ...distractors]);
      return { type, word, options };
    }
    if (type === 'fill-blank') {
      return { type, word, blanked: blankWord(word.es) };
    }
    return { type, word };
  });
}

export default function LessonQuiz({ lesson, onReturnToDashboard, onContinueNext }: LessonQuizProps) {
  const { user } = useAuth();
  const questions = useMemo(() => buildQuestions(lesson), [lesson]);
  const nextLesson = useMemo(() => getNextLesson(lesson.id), [lesson.id]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  const [recording, setRecording] = useState(false);
  const [pronunciationNote, setPronunciationNote] = useState('');
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const speechSupported = isSpeechRecognitionSupported();

  const advance = (correct: boolean) => {
    setWasCorrect(correct);
    setAnswered(true);
    if (correct) setScore((s) => s + 1);
  };

  const handleNextQuestion = async (finalScore: number) => {
    if (isLast) {
      setSaving(true);
      const types = Array.from(new Set(questions.map((q) => q.type)));
      await saveQuizScore(lesson.id, finalScore, lesson.words.length, user?.id ?? null);
      await saveQuizAttempt(
        {
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          score: finalScore,
          total: questions.length,
          question_types: types,
        },
        user?.id ?? null
      );
      recordActivityToday();
      setSaving(false);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(false);
    setWasCorrect(false);
    setTextAnswer('');
    setPronunciationNote('');
  };

  const handleListeningAnswer = (option: string) => {
    if (answered) return;
    const correct = option === question.word.en;
    advance(correct);
  };

  const handleFillBlankSubmit = () => {
    if (answered) return;
    const correct = normalizeForCompare(textAnswer) === normalizeForCompare(question.word.es);
    advance(correct);
  };

  const handleRecord = async () => {
    if (recording || answered) return;
    setRecording(true);
    setPronunciationNote('Listening…');
    const transcript = await listenOnce('es');
    setRecording(false);

    if (!transcript) {
      setPronunciationNote(
        speechSupported
          ? "Didn't catch that clearly."
          : 'Voice recognition isn\u2019t available in this browser.'
      );
      return;
    }
    const correct = isCloseEnough(question.word.es, transcript);
    setPronunciationNote(`You said: "${transcript}"`);
    advance(correct);
  };

  const handleSelfConfirm = () => {
    if (answered) return;
    setPronunciationNote('Marked as practiced (self-checked).');
    advance(true);
  };

  if (done) {
    // Post-lesson summary: an elegant, unhurried stop between lessons —
    // either keep the momentum going or head back to see the day's progress.
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= 70;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mint-50 via-white to-mint-50 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface px-6 py-16">
        <div className="w-full max-w-md text-center">
          <div
            className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-md ${
              passed ? 'bg-gradient-to-br from-forest-500 to-forest-700 dark:from-accent dark:to-accent-active' : 'bg-gradient-to-br from-slate-500 to-slate-700'
            }`}
          >
            <Trophy className="text-white" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-ink-primary mb-1">
            {passed ? 'Nice work!' : 'Good effort!'}
          </h2>
          <p className="text-gray-500 dark:text-ink-secondary mb-6">
            You scored {score} out of {questions.length} on "{lesson.title}"
          </p>
          <div className="text-5xl font-bold text-forest-700 mb-10">{percent}%</div>

          <div className="bg-white dark:bg-surface-card rounded-2xl border border-mint-100 dark:border-line-subtle p-5 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-ink-secondary">
              Ready for what's next?
            </p>
            {nextLesson && (
              <button
                onClick={() => onContinueNext(nextLesson)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-forest-600 to-forest-800 text-white font-semibold shadow-md hover:from-forest-700 hover:to-forest-900 dark:from-accent dark:to-accent-active dark:hover:from-accent-hover dark:hover:to-accent dark:text-surface transition-all"
              >
                Continue to next lesson <ArrowRight size={18} />
              </button>
            )}
            <button
              onClick={onReturnToDashboard}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                nextLesson
                  ? 'text-gray-600 dark:text-ink-secondary bg-mint-50 dark:bg-surface-elevated hover:bg-mint-100 dark:hover:bg-surface-strong'
                  : 'text-white bg-gradient-to-r from-forest-600 to-forest-800 hover:from-forest-700 hover:to-forest-900 shadow-md dark:from-accent dark:to-accent-active dark:hover:from-accent-hover dark:hover:to-accent dark:text-surface'
              }`}
            >
              <LayoutDashboard size={18} /> Return to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-mint-50 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface px-6 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-forest-700 bg-mint-100 dark:bg-accent/10 px-3 py-1 rounded-full">
            Mandatory Quiz
          </span>
          <span className="text-xs text-gray-400 dark:text-ink-muted">
            Question {index + 1} of {questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-mint-100 dark:bg-surface-elevated rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-forest-500 to-forest-700 dark:from-accent dark:to-accent-active rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-white dark:bg-surface-card rounded-3xl shadow-lg border border-mint-100 dark:border-line-subtle p-8">
          {/* --- Listening question --- */}
          {question.type === 'listening' && (
            <>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-500 mb-4">
                <Ear size={14} /> Listening
              </div>
              <p className="text-center text-gray-500 dark:text-ink-secondary text-sm mb-4">
                Listen and choose the correct meaning
              </p>
              <button
                onClick={() => getElevenLabsAudio(question.word.es, 'es')}
                className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-teal-50 dark:bg-accent/10 text-teal-600 hover:bg-teal-100 dark:hover:bg-accent/20 transition-all mb-6"
                aria-label="Play word"
              >
                <Volume2 size={26} />
              </button>
              <div className="space-y-2.5">
                {question.options?.map((opt) => {
                  const isSelectedCorrect = answered && opt === question.word.en;
                  const isWrongPick = answered && !wasCorrect && opt === question.word.en;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleListeningAnswer(opt)}
                      disabled={answered}
                      className={`w-full text-left px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                        answered && isSelectedCorrect
                          ? 'bg-forest-50 dark:bg-accent/10 border-forest-400 text-forest-700 dark:text-accent'
                          : isWrongPick
                          ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-400 text-rose-600'
                          : 'bg-mint-50 dark:bg-surface-elevated border-mint-100 dark:border-line-subtle text-gray-700 dark:text-ink-secondary hover:border-forest-400'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* --- Fill in the blank --- */}
          {question.type === 'fill-blank' && (
            <>
              <div className="flex items-center gap-2 text-xs font-medium text-forest-700 mb-4">
                <PenLine size={14} /> Fill in the missing letters
              </div>
              <p className="text-center text-gray-500 dark:text-ink-secondary text-sm mb-1">{question.word.en}</p>
              <p className="text-center text-gray-400 dark:text-ink-muted text-sm mb-4" dir="rtl">{question.word.ar}</p>
              <p className="text-center text-3xl font-mono tracking-widest text-gray-900 dark:text-ink-primary mb-6">
                {question.blanked}
              </p>
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                disabled={answered}
                placeholder="Type the full word in Spanish"
                className="w-full text-center px-4 py-3 rounded-xl border border-mint-200 dark:border-line-subtle bg-mint-50 dark:bg-surface-input text-gray-900 dark:text-ink-primary focus:outline-none focus:ring-2 focus:ring-forest-500 dark:focus:ring-accent transition-all mb-4"
                onKeyDown={(e) => e.key === 'Enter' && handleFillBlankSubmit()}
              />
              {answered && (
                <p className={`text-center text-sm font-medium mb-4 ${wasCorrect ? 'text-forest-700' : 'text-rose-600'}`}>
                  {wasCorrect ? 'Correct!' : `Correct answer: ${question.word.es}`}
                </p>
              )}
              {!answered && (
                <button
                  onClick={handleFillBlankSubmit}
                  className="w-full py-3 rounded-xl bg-forest-700 hover:bg-forest-800 text-white dark:bg-accent dark:hover:bg-accent-hover dark:text-surface font-semibold transition-all"
                >
                  Check
                </button>
              )}
            </>
          )}

          {/* --- Pronunciation --- */}
          {question.type === 'pronunciation' && (
            <>
              <div className="flex items-center gap-2 text-xs font-medium text-rose-500 mb-4">
                <Mic size={14} /> Pronunciation
              </div>
              <p className="text-center text-gray-500 dark:text-ink-secondary text-sm mb-2">Say this word aloud</p>
              <div className="flex items-center justify-center gap-3 mb-6">
                <p className="text-3xl font-bold text-gray-900 dark:text-ink-primary">{question.word.es}</p>
                <button
                  onClick={() => getElevenLabsAudio(question.word.es, 'es')}
                  className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-accent/10 text-teal-600 flex items-center justify-center hover:bg-teal-100 dark:hover:bg-accent/20 transition-all"
                  aria-label="Play word"
                >
                  <Volume2 size={18} />
                </button>
              </div>

              {speechSupported ? (
                <button
                  onClick={handleRecord}
                  disabled={recording || answered}
                  className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full transition-all mb-4 ${
                    recording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20'
                  }`}
                  aria-label="Record"
                >
                  <Mic size={26} />
                </button>
              ) : (
                !answered && (
                  <button
                    onClick={handleSelfConfirm}
                    className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-all mb-4"
                  >
                    I said it out loud
                  </button>
                )
              )}

              {pronunciationNote && (
                <p className="text-center text-sm text-gray-500 dark:text-ink-secondary mb-2">{pronunciationNote}</p>
              )}
              {answered && (
                <p className={`text-center text-sm font-medium flex items-center justify-center gap-1.5 ${wasCorrect ? 'text-forest-700' : 'text-slate-500'}`}>
                  {wasCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {wasCorrect ? 'Sounded good!' : 'Close — keep practicing this one.'}
                </p>
              )}
            </>
          )}

          {answered && (
            <button
              onClick={() => handleNextQuestion(score)}
              disabled={saving}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 dark:bg-accent text-white dark:text-surface font-semibold hover:opacity-90 transition-all disabled:opacity-60"
            >
              {isLast ? (saving ? 'Saving…' : 'See results') : 'Next question'}
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
