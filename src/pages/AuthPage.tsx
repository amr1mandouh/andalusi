import { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import AndalusiLogo from '../components/AndalusiLogo';
import TravelBackground from '../components/TravelBackground';
import { useAuth } from '../contexts/AuthContext';
import { APP_NAME, APP_TAGLINE } from '../config/brand';

interface AuthPageProps {
  onContinueAsGuest: () => void;
}

type Mode = 'sign-in' | 'sign-up';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 7 29.5 5 24 5c-7.7 0-14.3 4.4-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 43c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 34.4 26.7 35 24 35c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 38.5 16.2 43 24 43z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C40.9 36.5 43 30.8 43 24c0-1.4-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.1 12.7h-2v7.2h-3v-7.2H8.5V10h1.6V8.4c0-1.6.9-3.1 3.4-3.1h2.1v2.6h-1.5c-.3 0-.7.2-.7.9V10h2.2l-.5 2.7z"
      />
    </svg>
  );
}

export default function AuthPage({ onContinueAsGuest }: AuthPageProps) {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'facebook' | null>(null);
  const { signIn, signUp, signInWithOAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const result = mode === 'sign-in' ? await signIn(email, password) : await signUp(email, password);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === 'sign-up') {
      setInfo('Account created! Check your email to confirm, or just sign in if confirmation is disabled.');
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    setError(null);
    setOauthLoading(provider);
    const result = await signInWithOAuth(provider);
    // On success the browser is redirected away, so we only ever reach
    // this line on failure — reset the loading state and show the error.
    if (result.error) {
      setError(result.error);
      setOauthLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 transition-colors duration-300">
      <TravelBackground />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AndalusiLogo size={64} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-ink-primary">{APP_NAME}</h1>
          <p className="text-sm text-slate-600 dark:text-ink-secondary mt-1">{APP_TAGLINE}</p>
        </div>

        <div className="bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/40 dark:from-transparent dark:via-transparent dark:to-transparent backdrop-blur-sm dark:bg-surface-card/90 rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/30 border border-slate-100 dark:border-line-subtle p-8">
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={oauthLoading !== null}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-line-subtle bg-white dark:bg-surface-elevated text-sm font-medium text-slate-700 dark:text-ink-primary hover:bg-slate-50 dark:hover:bg-surface-strong transition-all disabled:opacity-60"
            >
              <GoogleIcon />
              {oauthLoading === 'google' ? '…' : 'Google'}
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('facebook')}
              disabled={oauthLoading !== null}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-line-subtle bg-white dark:bg-surface-elevated text-sm font-medium text-slate-700 dark:text-ink-primary hover:bg-slate-50 dark:hover:bg-surface-strong transition-all disabled:opacity-60"
            >
              <FacebookIcon />
              {oauthLoading === 'facebook' ? '…' : 'Facebook'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-slate-200 dark:bg-surface-strong" />
            <span className="text-xs text-slate-400 dark:text-ink-muted">or continue with email</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-surface-strong" />
          </div>

          <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-surface-elevated rounded-xl p-1">
            <button
              onClick={() => { setMode('sign-in'); setError(null); setInfo(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'sign-in' ? 'bg-white dark:bg-surface-strong text-emerald-700 dark:text-accent shadow-sm' : 'text-slate-600 dark:text-ink-secondary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('sign-up'); setError(null); setInfo(null); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'sign-up' ? 'bg-white dark:bg-surface-strong text-emerald-700 dark:text-accent shadow-sm' : 'text-slate-600 dark:text-ink-secondary'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-ink-secondary mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-line-subtle bg-slate-50 dark:bg-surface-input text-slate-800 dark:text-ink-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-accent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-ink-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-line-subtle bg-slate-50 dark:bg-surface-input text-slate-800 dark:text-ink-primary text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-accent transition-all"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-lg px-3 py-2">{error}</p>
            )}
            {info && (
              <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-accent/10 rounded-lg px-3 py-2">{info}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 to-green-800 hover:from-emerald-800 hover:to-green-900 text-white font-semibold shadow-md transition-all disabled:opacity-60 dark:from-accent dark:to-accent-active dark:hover:from-accent-hover dark:hover:to-accent dark:text-surface"
            >
              {mode === 'sign-in' ? <LogIn size={18} /> : <UserPlus size={18} />}
              {submitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <button
            onClick={onContinueAsGuest}
            className="w-full mt-4 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-ink-secondary hover:text-slate-800 dark:hover:text-ink-primary transition-all"
          >
            Continue as guest <ArrowRight size={15} />
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-ink-muted mt-6">
          Signing in saves your progress, streak, and starred words to your account across devices.
        </p>
      </div>
    </div>
  );
}
