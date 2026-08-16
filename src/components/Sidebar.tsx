import { useState } from 'react';
import { BookOpen, LayoutDashboard, Layers, Brain, Settings, Quote, Star, Layers3, LogOut, User, UserCog, LogIn, AlertTriangle, Menu, X } from 'lucide-react';
import AndalusiLogo from './AndalusiLogo';
import ThemeToggle from './ThemeToggle';
import { APP_NAME, APP_TAGLINE_SHORT } from '../config/brand';
import { useAuth } from '../contexts/AuthContext';

export type Page = 'dashboard' | 'learn' | 'idioms' | 'flashcards' | 'quiz' | 'starred' | 'grammar' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSwitchAccount: () => void;
}

const navItems: { id: Page; label: string; icon: typeof BookOpen }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'grammar', label: 'Grammar', icon: Layers3 },
  { id: 'idioms', label: 'Idioms Library', icon: Quote },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'quiz', label: 'Quiz', icon: Brain },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentPage, onNavigate, onSwitchAccount }: SidebarProps) {
  const { user, signOut } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    await signOut();
    setLoggingOut(false);
    setShowLogoutConfirm(false);
  };

  const handleNavigate = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar — hamburger + logo, visible below the lg breakpoint only */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-stone-100/95 dark:bg-surface-card/95 backdrop-blur-sm border-b border-stone-200 dark:border-line-subtle">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 dark:text-ink-primary hover:bg-stone-200 dark:hover:bg-surface-elevated transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <AndalusiLogo size={28} />
          <span className="text-sm font-bold text-slate-800 dark:text-ink-primary">{APP_NAME}</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Overlay behind the mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: an off-canvas drawer on mobile, a static sticky column on lg+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out
          lg:sticky lg:top-0 lg:z-30 lg:w-64 lg:h-screen lg:translate-x-0
          bg-stone-100 dark:bg-surface-card border-r border-stone-200 dark:border-line-subtle flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-6 py-6 border-b border-stone-200/80 dark:border-line-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AndalusiLogo size={40} />
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-ink-primary leading-tight">{APP_NAME}</h1>
              <p className="text-xs text-slate-600 dark:text-ink-secondary">{APP_TAGLINE_SHORT}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-stone-200 dark:hover:bg-surface-elevated dark:text-ink-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-out ${
                  active
                    ? 'bg-gradient-to-r from-forest-700 to-forest-900 text-white shadow-md shadow-forest-800/25 scale-[1.02] dark:from-accent dark:to-accent-active dark:text-surface dark:shadow-accent/25'
                    : 'text-slate-700 dark:text-ink-secondary hover:bg-slate-900 hover:text-white dark:hover:bg-accent dark:hover:text-surface hover:scale-[1.02]'
                }`}
              >
                <Icon
                  size={20}
                  className={
                    active
                      ? 'text-white'
                      : 'text-slate-400 dark:text-ink-muted group-hover:text-white dark:group-hover:text-surface transition-colors'
                  }
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-stone-200/80 dark:border-line-subtle space-y-4">
          <div className="hidden lg:flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-ink-secondary">Appearance</span>
            <ThemeToggle />
          </div>

          {user ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-mint-100 dark:bg-accent/20 text-forest-700 dark:text-accent flex items-center justify-center flex-shrink-0">
                  <User size={14} />
                </div>
                <span className="text-xs text-slate-600 dark:text-ink-secondary truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={onSwitchAccount}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-ink-muted hover:text-forest-700 hover:bg-mint-50 dark:hover:bg-accent/10 transition-colors"
                  aria-label="Switch account"
                  title="Switch account"
                >
                  <UserCog size={15} />
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-ink-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onSwitchAccount}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-forest-700 to-forest-900 text-white text-xs font-semibold shadow-md shadow-forest-800/25 hover:from-forest-800 hover:to-forest-950 dark:from-accent dark:to-accent-active dark:text-surface dark:shadow-accent/25 dark:hover:from-accent-hover dark:hover:to-accent transition-all"
            >
              <LogIn size={14} />
              Switch Account · Sign In
            </button>
          )}
        </div>

        {showLogoutConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            onClick={() => !loggingOut && setShowLogoutConfirm(false)}
          >
            <div
              className="w-full max-w-sm bg-white dark:bg-surface-card rounded-2xl shadow-xl border border-slate-100 dark:border-line-subtle p-6 animate-[fadeIn_0.15s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-11 h-11 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                <AlertTriangle size={20} />
              </div>
              <h2 id="logout-confirm-title" className="text-base font-bold text-slate-800 dark:text-ink-primary">
                Sign out of {APP_NAME}?
              </h2>
              <p className="text-sm text-slate-500 dark:text-ink-secondary mt-1.5">
                Are you sure you want to sign out? You'll need to sign back in to sync your progress.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-ink-secondary bg-slate-100 dark:bg-surface-elevated hover:bg-slate-200 dark:hover:bg-surface-strong transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/20 transition-colors disabled:opacity-60"
                >
                  {loggingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
