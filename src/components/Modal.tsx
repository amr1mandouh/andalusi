import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Tailwind max-width class for the modal panel, e.g. 'max-w-lg', 'max-w-3xl'. */
  maxWidth?: string;
  /** Hide the (X) button and disable outside-click/Escape — for flows the user must complete. */
  dismissible?: boolean;
}

/**
 * Shared popup/modal shell used across the app (Grammar, Learn, Idioms,
 * Starred, lessons & quizzes, etc). Renders a dimmed overlay behind a
 * centered, scrollable panel with a close button. Closes on:
 *  - clicking the overlay (outside the panel)
 *  - the close (X) button
 *  - pressing Escape
 */
export default function Modal({ open, onClose, children, maxWidth = 'max-w-xl', dismissible = true }: ModalProps) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, dismissible, onClose]);

  useEffect(() => {
    if (!open || dismissible) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open, dismissible]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm px-3 py-6 sm:p-6 overflow-y-auto animate-[fadeIn_0.15s_ease-out]"
      role="dialog"
      aria-modal="true"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className={`relative w-full ${maxWidth} my-auto rounded-3xl border border-gray-100 dark:border-line-subtle bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent dark:bg-surface-card shadow-2xl animate-[fadeIn_0.2s_ease-out]`}
        onClick={(e) => e.stopPropagation()}
      >
        {dismissible && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-white/80 dark:bg-surface-elevated/80 border border-gray-100 dark:border-line-subtle text-gray-500 dark:text-ink-secondary flex items-center justify-center hover:bg-gray-100 dark:hover:bg-surface-strong hover:text-gray-800 dark:hover:text-ink-primary shadow-sm transition-all active:scale-95"
          >
            <X size={18} />
          </button>
        )}
        <div className="max-h-[85vh] overflow-y-auto rounded-3xl p-6">{children}</div>
      </div>
    </div>
  );
}