import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getStarredIds, toggleStarred } from '../services/starredService';
import { useAuth } from './AuthContext';

interface StarredContextValue {
  starredWordIds: string[];
  starredIdiomIds: string[];
  isWordStarred: (wordId: string) => boolean;
  isIdiomStarred: (idiomId: string) => boolean;
  toggleWordStar: (wordId: string) => void;
  toggleIdiomStar: (idiomId: string) => void;
}

const StarredContext = createContext<StarredContextValue | undefined>(undefined);

export function StarredProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [starredWordIds, setStarredWordIds] = useState<string[]>([]);
  const [starredIdiomIds, setStarredIdiomIds] = useState<string[]>([]);

  useEffect(() => {
    getStarredIds('word', userId).then(setStarredWordIds);
    getStarredIds('idiom', userId).then(setStarredIdiomIds);
  }, [userId]);

  const toggleWordStar = (wordId: string) => {
    toggleStarred('word', wordId, userId).then(setStarredWordIds);
  };

  const toggleIdiomStar = (idiomId: string) => {
    toggleStarred('idiom', idiomId, userId).then(setStarredIdiomIds);
  };

  return (
    <StarredContext.Provider
      value={{
        starredWordIds,
        starredIdiomIds,
        isWordStarred: (wordId) => starredWordIds.includes(wordId),
        isIdiomStarred: (idiomId) => starredIdiomIds.includes(idiomId),
        toggleWordStar,
        toggleIdiomStar,
      }}
    >
      {children}
    </StarredContext.Provider>
  );
}

export function useStarred() {
  const ctx = useContext(StarredContext);
  if (!ctx) throw new Error('useStarred must be used within StarredProvider');
  return ctx;
}
