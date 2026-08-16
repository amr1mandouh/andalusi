import { useState, useEffect } from 'react';
import Sidebar, { type Page } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import LessonPage from './pages/LessonPage';
import LessonQuiz from './pages/LessonQuiz';
import IdiomsLibrary from './components/IdiomsLibrary';
import Starred from './pages/Starred';
import Grammar from './pages/Grammar';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';
import PlacementTest from './pages/PlacementTest';
import { ProgressProvider } from './contexts/ProgressContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LevelProvider, useLevel } from './contexts/LevelContext';
import { StarredProvider } from './contexts/StarredContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getProfile } from './services/profileService';
import { initSpeech } from './services/speechService';
import AndalusiLogo from './components/AndalusiLogo';
import TravelBackground from './components/TravelBackground';
import type { Lesson } from './data/lessons';

const GUEST_KEY = 'andalusi_guest';

function LoadingScreen() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <TravelBackground />
      <div className="animate-pulse">
        <AndalusiLogo size={56} />
      </div>
    </div>
  );
}

function AppShell() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { level, setLevel } = useLevel();

  const [page, setPage] = useState<Page>('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [quizLesson, setQuizLesson] = useState<Lesson | null>(null);
  const [guestMode, setGuestMode] = useState(() => localStorage.getItem(GUEST_KEY) === '1');
  const [profileChecked, setProfileChecked] = useState(false);
  const [retakingTest, setRetakingTest] = useState(false);

  useEffect(() => {
    initSpeech();
  }, []);

  // When a user signs in, pull their saved level from their profile so it
  // follows them across devices. Guests keep using the local level only.
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      getProfile(user.id).then((profile) => {
        if (profile?.level) setLevel(profile.level);
        setProfileChecked(true);
      });
    } else {
      setProfileChecked(true);
    }
  }, [user, authLoading]);

  if (authLoading || !profileChecked) {
    return <LoadingScreen />;
  }

  if (!user && !guestMode) {
    return (
      <AuthPage
        onContinueAsGuest={() => {
          localStorage.setItem(GUEST_KEY, '1');
          setGuestMode(true);
        }}
      />
    );
  }

  if (level === null || retakingTest) {
    const wasRetake = retakingTest;
    return (
      <PlacementTest
        onFinish={() => {
          setRetakingTest(false);
          setPage(wasRetake ? 'settings' : 'dashboard');
        }}
      />
    );
  }

  const handleOpenLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleBackToLearn = () => {
    setActiveLesson(null);
    setPage('learn');
  };

  // Lesson finished → mandatory quiz, not straight back to the dashboard.
  const handleLessonComplete = () => {
    setQuizLesson(activeLesson);
    setActiveLesson(null);
  };

  // Post-lesson summary, "Return to dashboard" choice.
  const handleReturnToDashboard = () => {
    setQuizLesson(null);
    setPage('dashboard');
  };

  // Post-lesson summary, "Continue to next lesson" choice — skips the Learn
  // grid entirely and drops straight back into the focused study view.
  const handleContinueNext = (nextLesson: Lesson) => {
    setQuizLesson(null);
    setActiveLesson(nextLesson);
  };

  const handleNavigate = (p: Page) => {
    setActiveLesson(null);
    setQuizLesson(null);
    setPage(p);
  };

  // Lets a guest jump to Sign In / Sign Up, or a signed-in user hop to a
  // different account, without losing the guest flag until they choose.
  const handleSwitchAccount = async () => {
    if (user) {
      await signOut();
    }
    localStorage.removeItem(GUEST_KEY);
    setGuestMode(false);
  };

  // Studying is a full-screen, single-purpose flow — the lesson itself and
  // its mandatory quiz replace the whole app shell (no sidebar, no modal
  // chrome) so nothing competes for the learner's attention.
  if (activeLesson) {
    return <LessonPage lesson={activeLesson} onBack={handleBackToLearn} onComplete={handleLessonComplete} />;
  }
  if (quizLesson) {
    return (
      <LessonQuiz
        lesson={quizLesson}
        onReturnToDashboard={handleReturnToDashboard}
        onContinueNext={handleContinueNext}
      />
    );
  }

  return (
    <div className="relative flex min-h-screen transition-colors duration-300 overflow-hidden">
      <TravelBackground />

      <div className="relative z-10 flex flex-col lg:flex-row w-full">
        <Sidebar currentPage={page} onNavigate={handleNavigate} onSwitchAccount={handleSwitchAccount} />
        <main className="flex-1 min-w-0">
          <div key={page} className="animate-[fadeIn_0.25s_ease-out]">
            {page === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
            {page === 'learn' && <Learn onOpenLesson={handleOpenLesson} />}
            {page === 'grammar' && <Grammar />}
            {page === 'idioms' && <IdiomsLibrary />}
            {page === 'starred' && <Starred />}
            {page === 'flashcards' && <Flashcards />}
            {page === 'quiz' && <Quiz />}
            {page === 'settings' && <Settings onRetakeTest={() => setRetakingTest(true)} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LevelProvider>
          <ProgressProvider>
            <StarredProvider>
              <AppShell />
            </StarredProvider>
          </ProgressProvider>
        </LevelProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
