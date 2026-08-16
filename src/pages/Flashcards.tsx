import { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Volume2, ChevronLeft, ChevronRight, Shuffle, Quote, Layers } from 'lucide-react';
import { getAllLessons, type Word } from '../data/lessons';
import { initSpeech, type Language } from '../services/speechService';
import { getElevenLabsAudio } from '../services/audioService';
import { getIdiomsForWord, dialectLabels } from '../data/idioms';

export default function Flashcards() {
  const allWords = useMemo(() => getAllLessons().flatMap((l) => l.words), []);
  const [shuffled, setShuffled] = useState<Word[]>(allWords);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [frontLang, setFrontLang] = useState<Language>('es');

  useEffect(() => {
    initSpeech();
  }, []);

  const current = shuffled[index];
  const relatedIdiom = current ? getIdiomsForWord(current.id)[0] : undefined;

  const handleShuffle = () => {
    const copy = [...allWords];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
    setIndex(0);
    setFlipped(false);
  };

  const handleNext = () => {
    setFlipped(false);
    setIndex((i) => (i + 1) % shuffled.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setIndex((i) => (i - 1 + shuffled.length) % shuffled.length);
  };

  if (!current) return null;

  const frontText = frontLang === 'es' ? current.es : current.en;
  const backText = frontLang === 'es' ? current.en : current.es;
  const frontLabel = frontLang === 'es' ? 'Spanish' : 'English';
  const backLabel = frontLang === 'es' ? 'English' : 'Spanish';

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Clean header — title & description only */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-accent dark:to-accent-active flex items-center justify-center shadow-md flex-shrink-0">
          <Layers className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">Flashcards</h1>
          <p className="text-gray-500 dark:text-ink-secondary mt-1">Tap the card to flip. Practice all {allWords.length} words.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar controls */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-8 space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-400 dark:text-ink-muted uppercase tracking-wide mb-3">
              Card shows first
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setFrontLang('es')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  frontLang === 'es'
                    ? 'bg-emerald-700 dark:bg-accent text-white dark:text-surface shadow-md'
                    : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                }`}
              >
                <span>🇪🇸</span>
                Spanish First
              </button>
              <button
                onClick={() => setFrontLang('en')}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  frontLang === 'en'
                    ? 'bg-emerald-700 dark:bg-accent text-white dark:text-surface shadow-md'
                    : 'text-gray-600 dark:text-ink-secondary hover:bg-gray-100 dark:hover:bg-surface-elevated'
                }`}
              >
                <span>🇬🇧</span>
                English First
              </button>
            </div>
          </div>

          <button
            onClick={handleShuffle}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card shadow-sm py-3 px-4 text-sm font-semibold text-gray-600 dark:text-ink-secondary hover:border-gray-200 dark:hover:border-line hover:-translate-y-0.5 transition-all duration-200"
          >
            <Shuffle size={16} />
            Shuffle deck
          </button>

          <div className="rounded-2xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card p-4 shadow-sm text-center">
            <p className="text-xs font-semibold text-gray-400 dark:text-ink-muted uppercase tracking-wide mb-1">Progress</p>
            <p className="text-lg font-bold text-gray-900 dark:text-ink-primary">{index + 1} / {shuffled.length}</p>
          </div>
        </aside>

        {/* Card + navigation */}
        <div className="flex-1 min-w-0 w-full max-w-2xl mx-auto lg:mx-0">
          <div className="relative" style={{ perspective: '1000px' }}>
            <div
              onClick={() => setFlipped(!flipped)}
              className="relative w-full h-96 cursor-pointer transition-transform duration-500"
              style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-3xl shadow-xl flex flex-col items-center justify-center bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-elevated border border-gray-100 dark:border-line-subtle px-6"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <p className="text-base text-gray-400 dark:text-ink-muted mb-3">{frontLabel}</p>
                <div className="text-5xl mb-4">{current.emoji}</div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-ink-primary mb-4 text-center">{frontText}</h2>
                {current.pronunciation && frontLang === 'es' && (
                  <p className="text-lg text-gray-400 dark:text-ink-muted italic mb-2">{current.pronunciation}</p>
                )}
                <div className="pt-2">
                  <p className="text-base text-gray-400 dark:text-ink-muted mb-1">Arabic</p>
                  <p className="text-2xl font-semibold text-gray-600 dark:text-ink-secondary" dir="rtl">{current.ar}</p>
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-8">
                  <div className="flex w-full max-w-xs gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); getElevenLabsAudio(current.es, 'es'); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 font-medium text-sm transition-all active:scale-95"
                    >
                      <Volume2 size={18} />
                      Spanish
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); getElevenLabsAudio(current.en, 'en'); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-500 dark:text-sky-400 font-medium text-sm transition-all active:scale-95"
                    >
                      <Volume2 size={18} />
                      English
                    </button>
                  </div>
                </div>
                <p className="absolute top-6 right-6 text-xs text-gray-300 dark:text-ink-muted flex items-center gap-1">
                  <RotateCcw size={12} /> Tap to flip
                </p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-3xl shadow-xl flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-accent dark:to-accent-active text-white dark:text-surface px-6"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <p className="text-base text-emerald-100 mb-3">{backLabel}</p>
                <div className="text-5xl mb-4">{current.emoji}</div>
                <h2 className="text-4xl font-bold mb-4 text-center">{backText}</h2>
                <div className="pt-2">
                  <p className="text-base text-emerald-100 mb-1">Arabic</p>
                  <p className="text-2xl font-semibold" dir="rtl">{current.ar}</p>
                </div>

                {relatedIdiom && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 px-4 py-2 rounded-xl bg-white/15 border border-white/20 max-w-xs text-center"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-emerald-100 flex items-center justify-center gap-1">
                      <Quote size={11} />
                      Related idiom · {dialectLabels[relatedIdiom.dialect]}
                    </p>
                    <p className="text-sm font-semibold text-white mt-0.5">{relatedIdiom.en}</p>
                  </div>
                )}

                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 px-8">
                  <div className="flex w-full max-w-xs gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); getElevenLabsAudio(current.es, 'es'); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all active:scale-95"
                    >
                      <Volume2 size={18} />
                      Spanish
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); getElevenLabsAudio(current.en, 'en'); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-all active:scale-95"
                    >
                      <Volume2 size={18} />
                      English
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white dark:bg-surface-elevated border border-gray-200 dark:border-line hover:shadow-md dark:hover:bg-surface-strong text-gray-600 dark:text-ink-secondary flex items-center justify-center transition-all"
            >
              <ChevronLeft size={22} />
            </button>
            <span className="text-sm font-medium text-gray-500 dark:text-ink-secondary lg:hidden">
              {index + 1} / {shuffled.length}
            </span>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white dark:bg-surface-elevated border border-gray-200 dark:border-line hover:shadow-md dark:hover:bg-surface-strong text-gray-600 dark:text-ink-secondary flex items-center justify-center transition-all"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
