import { useEffect, useState } from 'react';
import { Volume2, CheckCircle2, GraduationCap, RotateCcw } from 'lucide-react';
import { speak, initSpeech, getVoiceInfo, type Language } from '../services/speechService';
import { useTheme } from '../contexts/ThemeContext';
import { useLevel } from '../contexts/LevelContext';
import { LEVELS, levelLabels } from '../data/lessons';
import ThemeToggle from '../components/ThemeToggle';
import { APP_NAME, APP_DESCRIPTION } from '../config/brand';

interface SettingsProps {
  onRetakeTest: () => void;
}

export default function Settings({ onRetakeTest }: SettingsProps) {
  const [testText] = useState({ en: `Hello, welcome to ${APP_NAME}`, es: `Hola, bienvenido a ${APP_NAME}` });
  const { theme } = useTheme();
  const { level, setLevel } = useLevel();

  useEffect(() => {
    initSpeech();
  }, []);

  const voiceCards: { lang: Language; label: string; text: string }[] = [
    { lang: 'en', label: 'English Voice', text: testText.en },
    { lang: 'es', label: 'Spanish Voice', text: testText.es },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-ink-primary">Settings</h1>
        <p className="text-gray-500 dark:text-ink-secondary mt-2">Configure your learning experience</p>
      </div>

      <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-line-subtle p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-ink-primary mb-1">Your Level</h2>
        <p className="text-sm text-gray-500 dark:text-ink-secondary mb-6">
          Pick your Spanish level so Learn opens straight to lessons that match it, instead of always starting from the basics.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                level === l
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-accent/10'
                  : 'border-gray-100 dark:border-line-subtle hover:border-gray-200 dark:hover:border-line'
              }`}
            >
              <span className={`font-bold ${level === l ? 'text-emerald-600' : 'text-gray-700 dark:text-ink-secondary'}`}>{l}</span>
              <span className="text-[11px] text-gray-400 dark:text-ink-muted">{levelLabels[l]}</span>
            </button>
          ))}
        </div>
        {level === null && (
          <p className="text-xs text-forest-700 dark:text-accent mt-4 flex items-center gap-1.5">
            <GraduationCap size={14} />
            No level set yet — Learn will show lessons grouped by level, starting from A1.
          </p>
        )}

        <button
          onClick={onRetakeTest}
          className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-line-subtle text-sm font-semibold text-gray-500 dark:text-ink-secondary hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-accent transition-all"
        >
          <RotateCcw size={16} />
          Retake Placement Test
        </button>
      </div>

      <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-line-subtle p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-ink-primary mb-1">Appearance</h2>
        <p className="text-sm text-gray-500 dark:text-ink-secondary mb-6">
          Switch between light and dark mode. Your choice is remembered on this device.
        </p>
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-line-subtle">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-ink-primary">
              {theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-ink-secondary mt-0.5">
              {theme === 'dark' ? 'Easier on the eyes at night' : 'Bright and clear for daytime study'}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-line-subtle p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-ink-primary mb-1">Voice Settings</h2>
        <p className="text-sm text-gray-500 dark:text-ink-secondary mb-6">
          Audio uses your browser's built-in text-to-speech. Voices are pre-configured for optimal learning.
        </p>

        <div className="space-y-4">
          {voiceCards.map((card) => {
            const info = getVoiceInfo(card.lang);
            return (
              <div key={card.lang} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-line-subtle hover:border-gray-200 dark:hover:border-line transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  card.lang === 'en' ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}>
                  <Volume2 size={22} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-ink-primary">{card.label}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-ink-secondary">{info.accent} accent</span>
                    <span className="text-gray-300 dark:text-ink-muted">·</span>
                    <span className="text-sm text-gray-500 dark:text-ink-secondary">{info.gender}</span>
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                </div>
                <button
                  onClick={() => speak(card.text, card.lang)}
                  className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-surface-elevated hover:bg-gray-100 dark:hover:bg-surface-strong text-gray-700 dark:text-ink-primary text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Volume2 size={16} />
                  Test
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-line-subtle p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-ink-primary mb-1">About {APP_NAME}</h2>
        <p className="text-sm text-gray-500 dark:text-ink-secondary mb-4">{APP_DESCRIPTION}</p>
        <div className="space-y-2 text-sm text-gray-600 dark:text-ink-secondary">
          <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-line-subtle">
            <span>Supported languages</span>
            <span className="font-medium">English, Spanish</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-line-subtle">
            <span>Words per lesson</span>
            <span className="font-medium">10</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-line-subtle">
            <span>English voice</span>
            <span className="font-medium">British Male</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Spanish voice</span>
            <span className="font-medium">Native Spanish Female</span>
          </div>
        </div>
      </div>
    </div>
  );
}
