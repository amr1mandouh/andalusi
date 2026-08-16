import { useState } from 'react';
import { Star, Volume2, BookOpen, Quote, ChevronRight } from 'lucide-react';
import { useStarred } from '../contexts/StarredContext';
import { getWordWithContext } from '../data/lessons';
import { idioms, type Idiom } from '../data/idioms';
import { getElevenLabsAudio } from '../services/audioService';
import Modal from '../components/Modal';

type Tab = 'words' | 'idioms';

export default function Starred() {
  const [tab, setTab] = useState<Tab>('words');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [activeIdiomId, setActiveIdiomId] = useState<string | null>(null);
  const { starredWordIds, starredIdiomIds, toggleWordStar, toggleIdiomStar } = useStarred();

  const starredWords = starredWordIds
    .map((id) => getWordWithContext(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const starredIdioms = idioms.filter((i) => starredIdiomIds.includes(i.id));

  const activeWordEntry = starredWords.find((w) => w.word.id === activeWordId) ?? null;
  const activeIdiom: Idiom | null = starredIdioms.find((i) => i.id === activeIdiomId) ?? null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Clean header — title & description only */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 dark:from-accent dark:to-accent-active flex items-center justify-center shadow-md flex-shrink-0">
          <Star className="text-white" size={24} fill="white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">Starred</h1>
          <p className="text-gray-500 dark:text-ink-secondary mt-1">Words and expressions you've marked to review.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar filter panel */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-8 space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 dark:text-ink-muted uppercase tracking-wide mb-3">
              Show
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setTab('words')}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tab === 'words'
                    ? 'bg-emerald-700 dark:bg-accent text-white dark:text-surface shadow-md'
                    : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Words
                </span>
                <span className={`text-xs font-semibold ${tab === 'words' ? 'text-white/80' : 'text-gray-400 dark:text-ink-muted'}`}>
                  {starredWords.length}
                </span>
              </button>
              <button
                onClick={() => setTab('idioms')}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tab === 'idioms'
                    ? 'bg-emerald-700 dark:bg-accent text-white dark:text-surface shadow-md'
                    : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Quote size={16} />
                  Idioms &amp; Sayings
                </span>
                <span className={`text-xs font-semibold ${tab === 'idioms' ? 'text-white/80' : 'text-gray-400 dark:text-ink-muted'}`}>
                  {starredIdioms.length}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content — grid cards, same language as Grammar/Learn/Idioms */}
        <div className="flex-1 min-w-0">
          {tab === 'words' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {starredWords.map(({ word, lesson, category }) => (
                <button
                  key={word.id}
                  onClick={() => setActiveWordId(word.id)}
                  className="group relative flex flex-col text-left rounded-2xl border-2 border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 dark:hover:border-line"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-forest-50 dark:bg-accent/10 flex items-center justify-center text-3xl flex-shrink-0">
                      {word.emoji}
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWordStar(word.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWordStar(word.id);
                        }
                      }}
                      className="w-9 h-9 rounded-xl bg-forest-50 dark:bg-accent/10 text-forest-600 flex items-center justify-center hover:bg-forest-100 dark:hover:bg-accent/20 transition-all cursor-pointer flex-shrink-0"
                      aria-label="Unstar"
                    >
                      <Star size={16} fill="currentColor" />
                    </span>
                  </div>

                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-elevated text-gray-500 dark:text-ink-secondary inline-flex w-fit mt-4">
                    {category.name} · {lesson.title}
                  </span>

                  <div className="flex items-baseline gap-2 flex-wrap mt-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-ink-primary">{word.es}</h3>
                    <span className="text-gray-400 dark:text-ink-muted">{word.en}</span>
                  </div>
                  <span className="text-gray-600 dark:text-ink-secondary mt-0.5" dir="rtl">{word.ar}</span>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-line-subtle flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-ink-secondary group-hover:text-forest-700 dark:group-hover:text-accent transition-colors">
                      View details
                    </span>
                    <ChevronRight
                      size={20}
                      className="text-gray-400 dark:text-ink-muted transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </button>
              ))}

              {starredWords.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <Star className="mx-auto text-gray-200 dark:text-ink-disabled mb-3" size={40} />
                  <p className="text-gray-400 dark:text-ink-muted">
                    No starred words yet. Tap the star on any word in a lesson to save it here.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'idioms' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {starredIdioms.map((idiom) => (
                <button
                  key={idiom.id}
                  onClick={() => setActiveIdiomId(idiom.id)}
                  className="group relative flex flex-col text-left rounded-2xl border-2 border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 dark:hover:border-line"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-forest-50 dark:bg-accent/10 flex items-center justify-center text-3xl flex-shrink-0">
                      {idiom.emoji}
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleIdiomStar(idiom.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleIdiomStar(idiom.id);
                        }
                      }}
                      className="w-9 h-9 rounded-xl bg-forest-50 dark:bg-accent/10 text-forest-600 flex items-center justify-center hover:bg-forest-100 dark:hover:bg-accent/20 transition-all cursor-pointer flex-shrink-0"
                      aria-label="Unstar"
                    >
                      <Star size={16} fill="currentColor" />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-ink-primary mt-4">{idiom.en}</h3>
                  <p className="text-gray-600 dark:text-ink-secondary mt-0.5">{idiom.es}</p>
                  <p className="text-sm text-gray-500 dark:text-ink-secondary mt-2 leading-relaxed line-clamp-2">{idiom.meaning}</p>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-line-subtle flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-ink-secondary group-hover:text-forest-700 dark:group-hover:text-accent transition-colors">
                      View details
                    </span>
                    <ChevronRight
                      size={20}
                      className="text-gray-400 dark:text-ink-muted transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </button>
              ))}

              {starredIdioms.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <Quote className="mx-auto text-gray-200 dark:text-ink-disabled mb-3" size={40} />
                  <p className="text-gray-400 dark:text-ink-muted">
                    No starred idioms yet. Tap the star on any idiom in the Idioms Library to save it here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Word detail popup */}
      <Modal open={!!activeWordEntry} onClose={() => setActiveWordId(null)} maxWidth="max-w-lg">
        {activeWordEntry && (
          <div className="p-6 pt-14 text-center">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-elevated text-gray-500 dark:text-ink-secondary inline-flex">
              {activeWordEntry.category.name} · {activeWordEntry.lesson.title}
            </span>
            <div className="text-5xl mt-5 mb-3">{activeWordEntry.word.emoji}</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">{activeWordEntry.word.es}</h2>
            {activeWordEntry.word.pronunciation && (
              <p className="text-base text-gray-400 dark:text-ink-muted italic mt-1">{activeWordEntry.word.pronunciation}</p>
            )}
            <p className="text-xl text-gray-500 dark:text-ink-secondary mt-2">{activeWordEntry.word.en}</p>
            <p className="text-xl text-gray-600 dark:text-ink-secondary mt-1" dir="rtl">{activeWordEntry.word.ar}</p>

            {activeWordEntry.word.context && (
              <div className="mt-6 bg-white/70 dark:bg-surface-elevated/60 rounded-2xl p-4 text-left space-y-1">
                <p className="text-base font-medium text-gray-800 dark:text-ink-primary">{activeWordEntry.word.context.es}</p>
                <p className="text-sm text-gray-500 dark:text-ink-secondary">{activeWordEntry.word.context.en}</p>
                <p className="text-sm text-gray-500 dark:text-ink-secondary" dir="rtl">{activeWordEntry.word.context.ar}</p>
              </div>
            )}

            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => getElevenLabsAudio(activeWordEntry.word.es, 'es')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium text-sm transition-all active:scale-95"
              >
                <Volume2 size={16} />
                Listen Spanish
              </button>
              <button
                onClick={() => toggleWordStar(activeWordEntry.word.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-50 dark:bg-accent/10 hover:bg-forest-100 dark:hover:bg-accent/20 text-forest-700 dark:text-accent font-medium text-sm transition-all active:scale-95"
              >
                <Star size={16} fill="currentColor" />
                Unstar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Idiom detail popup */}
      <Modal open={!!activeIdiom} onClose={() => setActiveIdiomId(null)} maxWidth="max-w-lg">
        {activeIdiom && (
          <div className="p-6 pt-14">
            <div className="flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">{activeIdiom.emoji}</div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-ink-primary">{activeIdiom.en}</h2>
                <p className="text-gray-600 dark:text-ink-secondary mt-0.5">{activeIdiom.es}</p>
                <p className="text-gray-700 dark:text-ink-secondary mt-0.5" dir="rtl">{activeIdiom.ar}</p>
                <p className="text-sm text-gray-500 dark:text-ink-secondary mt-3">{activeIdiom.meaning}</p>
                <p className="text-sm text-gray-500 dark:text-ink-secondary mt-1" dir="rtl">{activeIdiom.meaningAr}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => getElevenLabsAudio(activeIdiom.es, 'es')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium text-sm transition-all active:scale-95"
              >
                <Volume2 size={16} />
                Listen
              </button>
              <button
                onClick={() => toggleIdiomStar(activeIdiom.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-50 dark:bg-accent/10 hover:bg-forest-100 dark:hover:bg-accent/20 text-forest-700 dark:text-accent font-medium text-sm transition-all active:scale-95"
              >
                <Star size={16} fill="currentColor" />
                Unstar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
