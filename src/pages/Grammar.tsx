import { useState } from 'react';
import { Clock, History, TrendingUp, MapPin, Tag, Repeat, Layers3, Lightbulb, Volume2, ChevronRight, type LucideIcon } from 'lucide-react';
import { grammarLessons, type GrammarLesson } from '../data/grammar';
import { getElevenLabsAudio } from '../services/audioService';
import Modal from '../components/Modal';

const topicMeta: Record<string, { icon: LucideIcon; gradient: string; ring: string }> = {
  'present-simple': { icon: Clock, gradient: 'from-emerald-500 to-teal-600', ring: 'border-emerald-300 dark:border-accent/60' },
  'past-simple': { icon: History, gradient: 'from-sky-500 to-blue-600', ring: 'border-sky-300 dark:border-sky-500/60' },
  'future-simple': { icon: TrendingUp, gradient: 'from-cyan-500 to-forest-600', ring: 'border-cyan-300 dark:border-cyan-500/60' },
  prepositions: { icon: MapPin, gradient: 'from-violet-500 to-purple-600', ring: 'border-violet-300 dark:border-violet-500/60' },
  articles: { icon: Tag, gradient: 'from-rose-500 to-pink-600', ring: 'border-rose-300 dark:border-rose-500/60' },
  'irregular-verbs': { icon: Repeat, gradient: 'from-teal-500 to-cyan-600', ring: 'border-teal-300 dark:border-accent/60' },
};
const fallbackMeta = { icon: Layers3, gradient: 'from-indigo-500 to-violet-600', ring: 'border-indigo-300 dark:border-indigo-500/60' };

function summaryPreview(lesson: GrammarLesson): string {
  return lesson.summary.length > 88 ? `${lesson.summary.slice(0, 88).trimEnd()}…` : lesson.summary;
}

export default function Grammar() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = grammarLessons.find((g) => g.id === activeId) ?? null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
          <Layers3 className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">Grammar</h1>
          <p className="text-gray-500 dark:text-ink-secondary mt-1">Spanish verb tenses, prepositions, articles &amp; more — explained simply.</p>
        </div>
      </div>

      {/* Topic grid — the reference card language used across the app */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {grammarLessons.map((lesson) => {
          const meta = topicMeta[lesson.id] ?? fallbackMeta;
          const Icon = meta.icon;

          return (
            <button
              key={lesson.id}
              onClick={() => setActiveId(lesson.id)}
              className="group relative flex flex-col text-left rounded-2xl border-2 border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 dark:hover:border-line"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                <Icon className="text-white" size={24} />
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-ink-primary mt-4">{lesson.title}</h2>
              <p className="text-base text-gray-400 dark:text-ink-muted mt-0.5">{lesson.titleEs}</p>
              <p className="text-base text-gray-500 dark:text-ink-secondary mt-2 leading-relaxed">{summaryPreview(lesson)}</p>

              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-line-subtle flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-ink-secondary group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  View lesson
                </span>
                <ChevronRight
                  size={20}
                  className="text-gray-400 dark:text-ink-muted transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail popup for the selected topic */}
      <Modal open={!!active} onClose={() => setActiveId(null)} maxWidth="max-w-3xl">
        {active && (
          <div className="space-y-6 p-6 pt-14">
          {/* Summary card */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-ink-primary mb-1">{active.titleEs}</h2>
            <p className="text-base text-gray-400 dark:text-ink-muted mb-4">{active.title}</p>
            <p className="text-lg text-gray-600 dark:text-ink-secondary leading-relaxed mb-3">{active.summary}</p>
            <p className="text-lg text-gray-700 dark:text-ink-secondary leading-relaxed" dir="rtl">{active.summaryAr}</p>
          </div>

          {/* Conjugation table(s) — single verb, multiple irregular verbs, or a plain reference list */}
          {(active.sampleVerb || active.irregularVerbs) && (
            <div className="bg-white/70 dark:bg-surface-elevated/60 rounded-2xl border border-gray-100 dark:border-line-subtle p-6 space-y-6">
              <div>
                <p className="text-base text-gray-500 dark:text-ink-secondary mb-1">{active.formationNote}</p>
                <p className="text-base text-gray-600 dark:text-ink-secondary" dir="rtl">{active.formationNoteAr}</p>
              </div>

              {(active.irregularVerbs ?? (active.sampleVerb ? [active.sampleVerb] : [])).map((verb) => (
                <div key={verb.infinitive}>
                  <div className="flex items-center gap-2 mb-3">
                    <ChevronRight size={16} className="text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-ink-primary">
                      {verb.infinitive} <span className="text-gray-400 dark:text-ink-muted font-normal">— {verb.meaning}</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {verb.conjugations.map((row) => (
                      <div
                        key={row.pronoun}
                        className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-surface-elevated rounded-xl px-4 py-3"
                      >
                        <div>
                          <p className="text-sm text-gray-400 dark:text-ink-muted">{row.pronoun}</p>
                          <p className="text-sm text-gray-400 dark:text-ink-muted" dir="rtl">{row.pronounAr}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900 dark:text-ink-primary">{row.form}</span>
                          <button
                            onClick={() => getElevenLabsAudio(row.form, 'es')}
                            className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
                            aria-label="Listen"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {active.referenceRows && (
            <div className="bg-white/70 dark:bg-surface-elevated/60 rounded-2xl border border-gray-100 dark:border-line-subtle p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-ink-primary mb-1">{active.referenceTitle}</h3>
              <p className="text-base text-gray-500 dark:text-ink-secondary mb-4" dir="rtl">{active.referenceTitleAr}</p>
              <div className="space-y-2">
                {active.referenceRows.map((row) => (
                  <div key={row.item} className="bg-gray-50 dark:bg-surface-elevated rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                      <span className="text-lg font-semibold text-gray-900 dark:text-ink-primary">{row.item}</span>
                      <span className="text-base text-gray-500 dark:text-ink-secondary" dir="rtl">{row.itemAr}</span>
                    </div>
                    <p className="text-base text-gray-600 dark:text-ink-secondary">{row.usage}</p>
                    <p className="text-base text-gray-500 dark:text-ink-secondary mt-0.5" dir="rtl">{row.usageAr}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="bg-white/70 dark:bg-surface-elevated/60 rounded-2xl border border-gray-100 dark:border-line-subtle p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-ink-primary mb-4">Examples</h3>
            <div className="space-y-4">
              {active.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-50 dark:border-line-subtle last:border-0 last:pb-0">
                  <button
                    onClick={() => getElevenLabsAudio(ex.es, 'es')}
                    className="w-9 h-9 flex-shrink-0 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                    aria-label="Listen"
                  >
                    <Volume2 size={15} />
                  </button>
                  <div className="min-w-0">
                    <p className="text-lg font-medium text-gray-900 dark:text-ink-primary">{ex.es}</p>
                    <p className="text-base text-gray-500 dark:text-ink-secondary">{ex.en}</p>
                    <p className="text-base text-gray-600 dark:text-ink-secondary" dir="rtl">{ex.ar}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-indigo-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-ink-primary">Good to know</h3>
            </div>
            <ul className="space-y-2">
              {active.tips.map((tip, i) => (
                <li key={i} className="text-base text-gray-600 dark:text-ink-secondary flex gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 mt-3" dir="rtl">
              {active.tipsAr.map((tip, i) => (
                <li key={i} className="text-base text-gray-700 dark:text-ink-secondary flex gap-2 justify-end text-right">
                  <span>{tip}</span>
                  <span className="text-indigo-400">•</span>
                </li>
              ))}
            </ul>
          </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
