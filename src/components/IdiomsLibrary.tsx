import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Volume2, Quote, Link2, Globe2, Star, Tags, X, ChevronRight } from 'lucide-react';
import { idioms, dialectLabels, type Idiom, type Dialect } from '../data/idioms';
import { categories, getAllLessons } from '../data/lessons';
import { getElevenLabsAudio } from '../services/audioService';
import { useStarred } from '../contexts/StarredContext';
import Modal from './Modal';

const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', gradient: 'from-emerald-500 to-teal-600' },
  sky: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', gradient: 'from-sky-500 to-blue-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', gradient: 'from-rose-500 to-pink-600' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', gradient: 'from-cyan-500 to-teal-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', gradient: 'from-indigo-500 to-violet-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', gradient: 'from-teal-500 to-cyan-600' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', gradient: 'from-pink-500 to-rose-600' },
};

const dialectFlags: Record<Dialect, string> = {
  uk: '🇬🇧',
  mle: '🎧',
  us: '🇺🇸',
  eg: '🇪🇬',
};

const allWords = getAllLessons().flatMap((l) => l.words);

function relatedWordLabels(idiom: Idiom): string {
  return idiom.relatedWordIds
    .map((id) => allWords.find((w) => w.id === id)?.en)
    .filter(Boolean)
    .join(', ');
}

export default function IdiomsLibrary() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDialect, setActiveDialect] = useState<Dialect | null>(null);
  const [activeIdiomId, setActiveIdiomId] = useState<string | null>(null);
  const { isIdiomStarred, toggleIdiomStar } = useStarred();

  const idiomCategories = categories.filter((c) => idioms.some((i) => i.categoryId === c.id));
  const visibleIdioms = idioms.filter(
    (i) => (activeCategory ? i.categoryId === activeCategory : true) && (activeDialect ? i.dialect === activeDialect : true)
  );
  const hasActiveFilters = activeCategory !== null || activeDialect !== null;
  const activeIdiom = idioms.find((i) => i.id === activeIdiomId) ?? null;
  const activeIdiomCategory = activeIdiom ? categories.find((c) => c.id === activeIdiom.categoryId) : undefined;
  const activeColors = colorMap[activeIdiomCategory?.color ?? 'emerald'] ?? colorMap.emerald;
  const ActiveIcon = (Icons as unknown as Record<string, typeof Icons.Smile>)[activeIdiomCategory?.icon ?? 'Smile'] ?? Icons.Smile;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Clean header — title & description only */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
          <Quote className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">Idioms Library</h1>
          <p className="text-gray-500 dark:text-ink-secondary mt-1">Idioms and longer expressions, linked to the words you're learning.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar filter panel — plain static lists, no popups, nothing absolutely positioned */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-8 space-y-4">
          {/* Dialect — instant filtering */}
          <div className="rounded-2xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Globe2 size={14} className="text-gray-400 dark:text-ink-muted" />
              <span className="text-xs font-semibold text-gray-400 dark:text-ink-muted uppercase tracking-wide">Dialect</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveDialect(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeDialect === null
                    ? 'bg-gray-900 dark:bg-accent text-white dark:text-surface shadow-sm'
                    : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                }`}
              >
                All dialects
              </button>
              {(Object.keys(dialectLabels) as Dialect[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDialect(d)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeDialect === d
                      ? 'bg-gray-900 dark:bg-accent text-white dark:text-surface shadow-sm'
                      : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                  }`}
                >
                  {dialectFlags[d]} {dialectLabels[d]}
                </button>
              ))}
            </div>
          </div>

          {/* Category — plain static list, same shape as Dialect above */}
          <div className="rounded-2xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tags size={14} className="text-gray-400 dark:text-ink-muted" />
              <span className="text-xs font-semibold text-gray-400 dark:text-ink-muted uppercase tracking-wide">Category</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? 'bg-violet-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                }`}
              >
                All categories
              </button>
              {idiomCategories.map((category) => {
                const colors = colorMap[category.color] ?? colorMap.emerald;
                const IconComp = (Icons as unknown as Record<string, typeof Icons.Smile>)[category.icon] ?? Icons.Smile;
                const active = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? `${colors.bg} ${colors.text}` : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                    }`}
                  >
                    <IconComp size={14} className="flex-shrink-0" />
                    <span className="truncate">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => {
                setActiveCategory(null);
                setActiveDialect(null);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 dark:text-ink-secondary hover:text-gray-700 dark:hover:text-ink-primary hover:bg-gray-100 dark:hover:bg-surface-elevated transition-colors"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </aside>

        {/* Idiom grid — same card language as Grammar/Learn */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {visibleIdioms.map((idiom) => {
              const category = categories.find((c) => c.id === idiom.categoryId);
              const colors = colorMap[category?.color ?? 'emerald'] ?? colorMap.emerald;
              const IconComp = (Icons as unknown as Record<string, typeof Icons.Smile>)[category?.icon ?? 'Smile'] ?? Icons.Smile;

              return (
                <button
                  key={idiom.id}
                  onClick={() => setActiveIdiomId(idiom.id)}
                  className="group relative flex flex-col text-left rounded-2xl border-2 border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gray-200 dark:hover:border-line"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md flex-shrink-0 text-2xl`}>
                      <span>{idiom.emoji}</span>
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
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0 cursor-pointer ${
                        isIdiomStarred(idiom.id)
                          ? 'bg-forest-100 dark:bg-accent/20 text-forest-600'
                          : 'bg-gray-50 dark:bg-surface-elevated text-gray-300 dark:text-ink-muted hover:text-forest-500'
                      }`}
                      aria-label={isIdiomStarred(idiom.id) ? 'Unstar this idiom' : 'Star this idiom'}
                    >
                      <Star size={16} fill={isIdiomStarred(idiom.id) ? 'currentColor' : 'none'} />
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mt-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} inline-flex items-center gap-1`}>
                      <IconComp size={11} />
                      {category?.name}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-elevated text-gray-500 dark:text-ink-secondary inline-flex items-center gap-1">
                      {dialectFlags[idiom.dialect]} {dialectLabels[idiom.dialect]}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-ink-primary mt-3">{idiom.en}</h2>
                  <p className="text-base text-gray-500 dark:text-ink-secondary mt-0.5">{idiom.es}</p>
                  <p className="text-base text-gray-500 dark:text-ink-secondary mt-2 leading-relaxed line-clamp-2">{idiom.meaning}</p>

                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-line-subtle flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-ink-secondary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      View details
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

          {visibleIdioms.length === 0 && (
            <p className="text-center text-gray-400 dark:text-ink-muted py-12">No idioms match these filters yet.</p>
          )}
        </div>
      </div>

      {/* Idiom detail popup */}
      <Modal open={!!activeIdiom} onClose={() => setActiveIdiomId(null)} maxWidth="max-w-2xl">
        {activeIdiom && (
          <div className="p-6 pt-14">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeColors.gradient} flex items-center justify-center shadow-md flex-shrink-0 text-2xl`}>
                <span>{activeIdiom.emoji}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${activeColors.bg} ${activeColors.text} inline-flex items-center gap-1`}>
                    <ActiveIcon size={12} />
                    {activeIdiomCategory?.name}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-elevated text-gray-500 dark:text-ink-secondary inline-flex items-center gap-1">
                    {dialectFlags[activeIdiom.dialect]} {dialectLabels[activeIdiom.dialect]}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-elevated text-gray-500 dark:text-ink-secondary capitalize">
                    {activeIdiom.kind}
                  </span>
                  {relatedWordLabels(activeIdiom) && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-surface-elevated text-gray-500 dark:text-ink-secondary inline-flex items-center gap-1">
                      <Link2 size={12} />
                      Linked to: {relatedWordLabels(activeIdiom)}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-ink-primary mt-3">{activeIdiom.en}</h2>
                <p className="text-lg text-gray-600 dark:text-ink-secondary mt-1">{activeIdiom.es}</p>
                <p className="text-lg text-gray-700 dark:text-ink-secondary mt-1" dir="rtl">{activeIdiom.ar}</p>
              </div>

              <button
                onClick={() => toggleIdiomStar(activeIdiom.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 flex-shrink-0 ${
                  isIdiomStarred(activeIdiom.id)
                    ? 'bg-forest-100 dark:bg-accent/20 text-forest-600'
                    : 'bg-gray-50 dark:bg-surface-elevated text-gray-300 dark:text-ink-muted hover:text-forest-500'
                }`}
                aria-label={isIdiomStarred(activeIdiom.id) ? 'Unstar this idiom' : 'Star this idiom'}
              >
                <Star size={18} fill={isIdiomStarred(activeIdiom.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="mt-5 space-y-1.5 border-t border-gray-100 dark:border-line-subtle pt-4">
              <p className="text-sm text-gray-500 dark:text-ink-secondary">
                <span className="font-semibold text-gray-600 dark:text-ink-secondary">Literally:</span> {activeIdiom.literalEn}
              </p>
              <p className="text-sm text-gray-500 dark:text-ink-secondary">
                <span className="font-semibold text-gray-600 dark:text-ink-secondary">Meaning:</span> {activeIdiom.meaning}
              </p>
              <p className="text-sm text-gray-500 dark:text-ink-secondary" dir="rtl">
                <span className="font-semibold text-gray-600 dark:text-ink-secondary">المعنى:</span> {activeIdiom.meaningAr}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => getElevenLabsAudio(activeIdiom.en, 'en')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-medium text-sm transition-all active:scale-95"
              >
                <Volume2 size={16} />
                Listen English
              </button>
              <button
                onClick={() => getElevenLabsAudio(activeIdiom.es, 'es')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium text-sm transition-all active:scale-95"
              >
                <Volume2 size={16} />
                Listen Spanish
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
