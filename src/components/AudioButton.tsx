import { Volume2 } from 'lucide-react';
import type { Language } from '../services/speechService';
import { getElevenLabsAudio } from '../services/audioService';

interface AudioButtonProps {
  text: string;
  lang: Language;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'ghost';
}

export default function AudioButton({ text, lang, size = 'md', variant = 'solid' }: AudioButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };
  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const base = `${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-200 active:scale-90`;
  const styles =
    variant === 'solid'
      ? 'bg-emerald-500 dark:bg-accent hover:bg-emerald-600 dark:hover:bg-accent-hover text-white dark:text-surface shadow-md hover:shadow-lg'
      : 'bg-transparent hover:bg-gray-100 dark:bg-surface-elevated text-gray-600 dark:text-ink-secondary';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        getElevenLabsAudio(text, lang);
      }}
      className={`${base} ${styles}`}
      aria-label={`Play ${lang === 'en' ? 'English' : 'Spanish'} pronunciation`}
    >
      <Volume2 size={iconSizes[size]} />
    </button>
  );
}
