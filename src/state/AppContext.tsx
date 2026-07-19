import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type {
  AppState,
  Exercise,
  NavigationPage,
} from '../types';

import {
  createInitialState,
  loadState,
  migrateState,
  saveState,
} from './storage';

interface AppContextValue {
  state: AppState;

  setState: React.Dispatch<React.SetStateAction<AppState>>;

  setActivePage: (page: NavigationPage) => void;

  replaceState: (nextState: unknown) => void;

  resetState: () => void;

  createExercise: (
    exercise: Omit<Exercise, 'id' | 'createdAt' | 'isCustom'>,
  ) => Exercise;

  updateExercise: (
    id: string,
    updates: Partial<Exercise>,
  ) => void;

  duplicateExercise: (
    id: string,
  ) => Exercise | null;

  archiveExercise: (
    id: string,
  ) => void;

  restoreExercise: (
    id: string,
  ) => void;

  deleteExercise: (
    id: string,
  ) => void;
}

const AppContext = createContext<AppContextValue | undefined>(
  undefined,
);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AppState>(
    () => loadState() ?? createInitialState(),
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<AppContextValue>(() => {
    function createExercise(
      exercise: Omit<
        Exercise,
        'id' | 'createdAt' | 'isCustom'
      >,
    ): Exercise {
      const created: Exercise = {
        ...exercise,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        isCustom: true,
      };

      setState((current) => ({
        ...current,
        exercises: [...current.exercises, created],
      }));

      return created;
    }

    function updateExercise(
      id: string,
      updates: Partial<Exercise>,
    ) {
      setState((current) => ({
        ...current,
        exercises: current.exercises.map((exercise) =>
          exercise.id === id
            ? {
                ...exercise,
                ...updates,
                id: exercise.id,
                createdAt: exercise.createdAt,
                isCustom: exercise.isCustom,
              }
            : exercise,
        ),
      }));
    }

    function duplicateExercise(id: string) {
      const original = state.exercises.find(
        (exercise) => exercise.id === id,
      );

      if (!original) {
        return null;
      }

      const copy: Exercise = {
        ...original,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        isCustom: true,
        archived: false,
        name: `${original.name} (Copy)`,
      };

      setState((current) => ({
        ...current,
        exercises: [...current.exercises, copy],
      }));

      return copy;
    }

    function archiveExercise(id: string) {
      setState((current) => ({
        ...current,
        exercises: current.exercises.map((exercise) =>
          exercise.id === id
            ? {
                ...exercise,
                archived: true,
              }
            : exercise,
        ),
      }));
    }

    function restoreExercise(id: string) {
      setState((current) => ({
        ...current,
        exercises: current.exercises.map((exercise) =>
          exercise.id === id
            ? {
                ...exercise,
                archived: false,
              }
            : exercise,
        ),
      }));
    }

    function deleteExercise(id: string) {
      setState((current) => ({
        ...current,
        exercises: current.exercises.filter((exercise) => {
          if (exercise.id !== id) {
            return true;
          }

          // Built-in exercises cannot be deleted.
          if (!exercise.isCustom) {
            return true;
          }

          return false;
        }),
      }));
    }

    return {
      state,

      setState,

      setActivePage: (page) =>
        setState((current) => ({
          ...current,
          activePage: page,
        })),

      replaceState: (nextState) =>
        setState(migrateState(nextState)),

      resetState: () =>
        setState(createInitialState()),

      createExercise,

      updateExercise,

      duplicateExercise,

      archiveExercise,

      restoreExercise,

      deleteExercise,
    };
  }, [state]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useAppState must be used within AppProvider',
    );
  }

  return context;
}
