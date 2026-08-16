import { useState } from 'react';
import { Lightbulb, ChevronDown, Volume2, Hash } from 'lucide-react';
import { getNumberProTips, type ProTip } from '../data/numbersLogic';
import { getElevenLabsAudio } from '../services/audioService';

export default function NumbersProTips() {
  const tips = getNumberProTips();
  const [openTip, setOpenTip] = useState<number | null>(0);

  return (
    <div className="bg-gradient-to-br from-mint-50 to-forest-50 dark:from-transparent dark:to-transparent dark:bg-surface-card rounded-2xl border-2 border-mint-200 dark:border-line-subtle p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center shadow-md">
          <Lightbulb className="text-white" size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-ink-primary">Pro-Tips: Numbers Beyond 100</h2>
          <p className="text-sm text-gray-600 dark:text-ink-secondary">Learn the logic for hundreds, thousands, millions, and billions</p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip: ProTip, idx: number) => {
          const isOpen = openTip === idx;
          return (
            <div key={idx} className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-xl border border-mint-100 overflow-hidden transition-shadow hover:shadow-sm">
              <button
                onClick={() => setOpenTip(isOpen ? null : idx)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left"
              >
                <Hash size={18} className="text-forest-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-ink-primary">{tip.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-ink-muted mt-0.5">{tip.titleEs} · {tip.titleAr}</p>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 dark:text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-gray-600 dark:text-ink-secondary mb-3 leading-relaxed">{tip.explanation}</p>
                  <p className="text-sm text-gray-500 dark:text-ink-secondary mb-4 leading-relaxed">{tip.explanationEs}</p>

                  <div className="space-y-2">
                    {tip.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-mint-50/60 border border-mint-100"
                      >
                        <div className="w-16 text-center">
                          <span className="text-lg font-bold text-forest-700 tabular-nums">
                            {ex.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-ink-primary">{ex.en}</p>
                          <p className="text-sm text-gray-600 dark:text-ink-secondary">{ex.es}</p>
                          <p className="text-sm text-gray-700" dir="rtl">{ex.ar}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => getElevenLabsAudio(ex.en, 'en')}
                            className="w-9 h-9 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-500 flex items-center justify-center transition-all active:scale-90"
                            aria-label="Play English"
                          >
                            <Volume2 size={16} />
                          </button>
                          <button
                            onClick={() => getElevenLabsAudio(ex.es, 'es')}
                            className="w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-all active:scale-90"
                            aria-label="Play Spanish"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
