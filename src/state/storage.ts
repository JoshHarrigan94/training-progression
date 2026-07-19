import { defaultExercises } from '../data/defaultExercises';

import type {
  AppState,
  Exercise,
  NavigationPage,
  StrengthSettings,
} from '../types';

export const APP_SCHEMA_VERSION = 4;

const STORAGE_KEY = 'training-cycle-app-state-v1';

export const defaultStrengthSettings: StrengthSettings = {
  monthlyIncrease: 0.025,
  defaultTargetSets: 3,
  deload: {
    percentage: 0.6,
    targetSets: 3,
    guidance:
      'Keep effort low and avoid grinding.',
  },
  e1rmFormula: 'average',
  weightedLoadMode: 'external-only',
  currentBodyweight: undefined,
};

function migrateExercise(
  exercise: Partial<Exercise>,
): Exercise {
  return {
    id:
      exercise.id ??
      crypto.randomUUID(),

    name:
      exercise.name ??
      'Unnamed Exercise',

    description:
      exercise.description ?? '',

    category:
      exercise.category ?? 'strength',

    movementPattern:
      exercise.movementPattern ??
      'conditioning',

    primaryMuscles:
      exercise.primaryMuscles ?? [],

    secondaryMuscles:
      exercise.secondaryMuscles ?? [],

    equipment:
      exercise.equipment ?? 'other',

    exerciseType:
      exercise.exerciseType ?? 'compound',

    unilateral:
      exercise.unilateral ?? false,

    loadable:
      exercise.loadable ?? true,

    bodyweight:
      exercise.bodyweight ?? false,

    strengthEligible:
      exercise.strengthEligible ?? true,

    chipperEligible:
      exercise.chipperEligible ?? true,

    emomEligible:
      exercise.emomEligible ?? true,

    notes:
      exercise.notes ?? '',

    archived:
      exercise.archived ?? false,

    isCustom:
      exercise.isCustom ?? false,

    createdAt:
      exercise.createdAt ??
      new Date().toISOString(),
  };
}

function mergeExerciseLibrary(
  savedExercises: unknown,
): Exercise[] {
  const migratedDefaults =
    defaultExercises.map(migrateExercise);

  if (!Array.isArray(savedExercises)) {
    return migratedDefaults;
  }

  const migratedSavedExercises =
    savedExercises
      .filter(
        (
          exercise,
        ): exercise is Partial<Exercise> =>
          Boolean(
            exercise &&
              typeof exercise === 'object',
          ),
      )
      .map(migrateExercise);

  const savedById = new Map(
    migratedSavedExercises.map(
      (exercise) => [
        exercise.id,
        exercise,
      ],
    ),
  );

  const mergedBuiltInExercises =
    migratedDefaults.map(
      (defaultExercise) => {
        const savedExercise =
          savedById.get(
            defaultExercise.id,
          );

        if (!savedExercise) {
          return defaultExercise;
        }

        savedById.delete(
          defaultExercise.id,
        );

        return {
          ...defaultExercise,

          // Preserve user-controlled state.
          archived:
            savedExercise.archived,

          notes:
            savedExercise.notes,

          // Keep the authoritative built-in
          // identity and metadata.
          id:
            defaultExercise.id,

          isCustom:
            false,

          createdAt:
            defaultExercise.createdAt,
        };
      },
    );

  const remainingExercises =
    Array.from(savedById.values());

  const preservedCustomExercises =
    remainingExercises.filter(
      (exercise) =>
        exercise.isCustom,
    );

  return [
    ...mergedBuiltInExercises,
    ...preservedCustomExercises,
  ];
}

function migrateActivePage(
  activePage: unknown,
): NavigationPage {
  if (activePage === 'library') {
    return 'exercise-library';
  }

  switch (activePage) {
    case 'dashboard':
    case 'programme':
    case 'session':
    case 'progress':
    case 'exercise-library':
    case 'settings':
      return activePage;

    default:
      return 'dashboard';
  }
}

export function createInitialState(): AppState {
  return {
    version: APP_SCHEMA_VERSION,

    programme: null,

    exercises:
      defaultExercises.map(
        migrateExercise,
      ),

    plannedSessions: [],

    completedSessions: [],

    chipperWorkouts: [],

    emomWorkouts: [],

    personalRecords: [],

    strengthSettings:
      defaultStrengthSettings,

    activePage: 'dashboard',
  };
}

export function migrateState(
  input: unknown,
): AppState {
  if (
    !input ||
    typeof input !== 'object'
  ) {
    throw new Error(
      'Backup must contain an application object.',
    );
  }

  const candidate =
    input as Partial<AppState>;

  const initial =
    createInitialState();

  return {
    ...initial,
    ...candidate,

    version:
      APP_SCHEMA_VERSION,

    programme:
      candidate.programme ?? null,

    exercises:
      mergeExerciseLibrary(
        candidate.exercises,
      ),

    plannedSessions:
      Array.isArray(
        candidate.plannedSessions,
      )
        ? candidate.plannedSessions
        : [],

    completedSessions:
      Array.isArray(
        candidate.completedSessions,
      )
        ? candidate.completedSessions.map(
            (session) => ({
              ...session,

              strengthSets:
                Array.isArray(
                  session.strengthSets,
                )
                  ? session.strengthSets.map(
                      (
                        set,
                        index,
                      ) => ({
                        ...set,

                        setNumber:
                          set.setNumber ??
                          index + 1,

                        status:
                          set.status ??
                          (set.completed
                            ? 'completed'
                            : 'planned'),
                      }),
                    )
                  : [],
            }),
          )
        : [],

    chipperWorkouts:
      Array.isArray(
        candidate.chipperWorkouts,
      )
        ? candidate.chipperWorkouts
        : [],

    emomWorkouts:
      Array.isArray(
        candidate.emomWorkouts,
      )
        ? candidate.emomWorkouts
        : [],

    personalRecords:
      Array.isArray(
        candidate.personalRecords,
      )
        ? candidate.personalRecords
        : [],

    strengthSettings: {
      ...defaultStrengthSettings,
      ...(candidate.strengthSettings ??
        {}),

      deload: {
        ...defaultStrengthSettings.deload,
        ...(candidate
          .strengthSettings
          ?.deload ?? {}),
      },
    },

    activePage:
      migrateActivePage(
        candidate.activePage,
      ),
  };
}

export function loadState():
  | AppState
  | null {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return null;
    }

    return migrateState(
      JSON.parse(raw),
    );
  } catch (error) {
    console.error(
      'Unable to restore local training data.',
      error,
    );

    return null;
  }
}

export function saveState(
  state: AppState,
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      version:
        APP_SCHEMA_VERSION,
    }),
  );
}

export function clearState(): void {
  localStorage.removeItem(
    STORAGE_KEY,
  );
}

export function exportState(
  state: AppState,
): void {
  const blob = new Blob(
    [
      JSON.stringify(
        {
          ...state,
          version:
            APP_SCHEMA_VERSION,
        },
        null,
        2,
      ),
    ],
    {
      type: 'application/json',
    },
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;

  link.download =
    `training-cycle-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}
