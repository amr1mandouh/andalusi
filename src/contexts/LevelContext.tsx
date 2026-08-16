import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Level } from '../data/lessons';

interface LevelContextValue {
  /** null means the user hasn't picked a level yet. */
  level: Level | null;
  setLevel: (level: Level) => void;
}

const LevelContext = createContext<LevelContextValue | undefined>(undefined);

const STORAGE_KEY = 'lingual-sensei-level';

function getInitialLevel(): Level | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'A1' || stored === 'A2' || stored === 'B1' || stored === 'B2' || stored === 'C1' || stored === 'C2') {
    return stored;
  }
  return null;
}

export function LevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevelState] = useState<Level | null>(getInitialLevel);

  const setLevel = (next: Level) => {
    setLevelState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  return <LevelContext.Provider value={{ level, setLevel }}>{children}</LevelContext.Provider>;
}

export function useLevel(): LevelContextValue {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('useLevel must be used within a LevelProvider');
  return ctx;
}
