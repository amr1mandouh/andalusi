import { useMemo, useState } from 'react';
import { GraduationCap, ArrowRight, CheckCircle2, SkipForward, BookOpen, Layers, FileText } from 'lucide-react';
import { placementQuestions, scorePlacement, sectionLabels, type PlacementSection, type PlacementResult } from '../data/placementQuestions';
import { useLevel } from '../contexts/LevelContext';
import { useAuth } from '../contexts/AuthContext';
import { upsertProfile } from '../services/profileService';
import { levelLabels } from '../data/lessons';

interface PlacementTestProps {
  onFinish: () => void;
}

const sectionIcons: Record<PlacementSection, typeof BookOpen> = {
  grammar: Layers,
  vocabulary: BookOpen,
  reading: FileText,
};

export default function PlacementTest({ onFinish }: PlacementTestProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const { setLevel } = useLevel();
  const { user } = useAuth();

  const question = placementQuestions[index];
  const isLast = index === placementQuestions.length - 1;
  const prevQuestion = index > 0 ? placementQuestions[index - 1] : null;
  const isNewSection = !prevQuestion || prevQuestion.section !== question.section;
  const SectionIcon = sectionIcons[question.section];

  const sectionProgress = useMemo(() => {
    const total = placementQuestions.filter((q) => q.section === question.section).length;
    const startIndex = placementQuestions.findIndex((q) => q.section === question.section);
    const posInSection = index - startIndex + 1;
    return { total, posInSection };
  }, [index, question.section]);

  const finish = async (finalAnswers: Record<string, number>) => {
    const scored = scorePlacement(finalAnswers);
    setResult(scored);
    setLevel(scored.overallLevel);
    if (user) {
      await upsertProfile(user.id, { level: scored.overallLevel, placement_completed: true });
    }
  };

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const nextAnswers = { ...answers, [question.id]: optionIndex };
    setAnswers(nextAnswers);

    setTimeout(() => {
      if (isLast) {
        finish(nextAnswers);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 400);
  };

  const handleSkipTest = async () => {
    setLevel('A1');
    if (user) await upsertProfile(user.id, { level: 'A1', placement_completed: true });
    onFinish();
  };

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-surface dark:via-surface-card dark:to-surface">
        <div className="max-w-md w-full bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-3xl shadow-lg border border-gray-100 dark:border-line-subtle p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
            <CheckCircle2 className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-ink-primary mb-1">You're placed at</h2>
          <p className="text-4xl font-bold text-emerald-700 mb-2">{result.overallLevel}</p>
          <p className="text-gray-500 dark:text-ink-secondary mb-6">{levelLabels[result.overallLevel]}</p>

          <div className="space-y-2.5 text-left mb-6">
            {result.sections.map((s) => {
              const Icon = sectionIcons[s.section];
              return (
                <div
                  key={s.section}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-surface-elevated border border-gray-100 dark:border-line-subtle"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-ink-secondary truncate">
                      {sectionLabels[s.section].en}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-400 dark:text-ink-muted">{s.correct}/{s.total}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-accent/20 text-emerald-700 dark:text-accent">
                      {s.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onFinish}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-green-800 text-white font-semibold shadow-md hover:from-emerald-800 hover:to-green-900 dark:from-accent dark:to-accent-active dark:hover:from-accent-hover dark:hover:to-accent dark:text-surface transition-all"
          >
            Start Learning <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-surface dark:via-surface-card dark:to-surface">
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-700 to-green-800 dark:from-accent dark:to-accent-active flex items-center justify-center shadow-md">
            <GraduationCap className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-ink-primary">Placement Test</h1>
            <p className="text-xs text-gray-500 dark:text-ink-secondary">
              Question {index + 1} of {placementQuestions.length} · CEFR A1–C2
            </p>
          </div>
        </div>

        <div className="h-1.5 bg-gray-200 dark:bg-surface-elevated rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / placementQuestions.length) * 100}%` }}
          />
        </div>

        {isNewSection && (
          <div className="flex items-center gap-2.5 mb-4 px-4 py-2.5 rounded-xl bg-emerald-100/60 dark:bg-accent/10 border border-emerald-200 dark:border-accent/20 animate-[fadeIn_0.3s_ease-out]">
            <SectionIcon size={16} className="text-emerald-700 dark:text-accent flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-accent">
              {sectionLabels[question.section].en} — {sectionLabels[question.section].ar}
            </p>
          </div>
        )}

        <p className="text-xs font-medium text-gray-400 dark:text-ink-muted mb-2 uppercase tracking-wide">
          {sectionLabels[question.section].en} · {sectionProgress.posInSection}/{sectionProgress.total} · Level {question.level}
        </p>

        <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-3xl shadow-lg border border-gray-100 dark:border-line-subtle p-8">
          {question.passage && (
            <div className="mb-5 p-4 rounded-xl bg-gray-50 dark:bg-surface-elevated border border-gray-100 dark:border-line-subtle">
              <p className="text-base text-gray-700 dark:text-ink-primary leading-relaxed">{question.passage}</p>
              <p className="text-sm text-gray-400 dark:text-ink-muted mt-2 leading-relaxed" dir="rtl">
                {question.passageAr}
              </p>
            </div>
          )}

          <p className="text-lg font-semibold text-gray-900 dark:text-ink-primary mb-1">{question.prompt}</p>
          <p className="text-sm text-gray-500 dark:text-ink-secondary mb-6" dir="rtl">{question.promptAr}</p>

          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectAnswer = i === question.correctIndex;
              const showState = selected !== null;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                    showState && isCorrectAnswer
                      ? 'bg-emerald-50 dark:bg-accent/10 border-emerald-400 text-emerald-700 dark:text-accent'
                      : showState && isSelected
                      ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-400 text-rose-600 dark:text-rose-400'
                      : 'bg-gray-50 dark:bg-surface-elevated border-gray-100 dark:border-line-subtle text-gray-700 dark:text-ink-secondary hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-accent/10'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSkipTest}
          className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-gray-400 dark:text-ink-muted hover:text-gray-600 dark:hover:text-ink-secondary transition-all"
        >
          Skip test, start from A1 <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
}
