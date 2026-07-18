import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { AppState, NavigationPage } from '../types';
import { defaultExercises } from '../data/defaultExercises';
import { loadState, saveState } from './storage';

const initialState: AppState = {
  version: 1,
  programme: null,
  exercises: defaultExercises,
  plannedSessions: [],
  completedSessions: [],
  chipperWorkouts: [],
  emomWorkouts: [],
  personalRecords: [],
  activePage: 'dashboard',
};

interface AppContextValue {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setActivePage: (page: NavigationPage) => void;
  replaceState: (nextState: AppState) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState() ?? initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      setState,
      setActivePage: (page) => setState((current) => ({ ...current, activePage: page })),
      replaceState: (nextState) => setState(nextState),
      resetState: () => setState(initialState),
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}
