import {
  useMemo,
  useState,
  type FormEvent,
} from 'react';

import { useAppState } from '../state/AppContext';

import type {
  Equipment,
  Exercise,
  ExerciseCategory,
  ExerciseType,
  MovementPattern,
  MuscleGroup,
} from '../types';

type ExerciseDraft = Omit<
  Exercise,
  'id' | 'createdAt' | 'isCustom'
>;

type EditorMode =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'edit'; exerciseId: string }
  | { type: 'view'; exerciseId: string };

const exerciseCategories: ExerciseCategory[] = [
  'strength',
  'accessory',
  'bodyweight',
  'conditioning',
  'mobility',
  'skill',
];

const movementPatterns: MovementPattern[] = [
  'squat',
  'hinge',
  'horizontal-push',
  'vertical-push',
  'horizontal-pull',
  'vertical-pull',
  'carry',
  'jump',
  'rotation',
  'anti-rotation',
  'core',
  'conditioning',
  'isolation',
];

const equipmentOptions: Equipment[] = [
  'barbell',
  'dumbbell',
  'kettlebell',
  'cable',
  'machine',
  'bodyweight',
  'band',
  'sandbag',
  'sled',
  'cardio',
  'other',
];

const muscleGroups: MuscleGroup[] = [
  'quads',
  'hamstrings',
  'glutes',
  'calves',
  'chest',
  'lats',
  'upper-back',
  'delts',
  'triceps',
  'biceps',
  'forearms',
  'core',
];

const exerciseTypes: ExerciseType[] = [
  'compound',
  'isolation',
  'power',
  'conditioning',
  'mobility',
  'skill',
];

const emptyDraft: ExerciseDraft = {
  name: '',
  description: '',
  category: 'strength',
  movementPattern: 'squat',
  primaryMuscles: [],
  secondaryMuscles: [],
  equipment: 'barbell',
  exerciseType: 'compound',
  unilateral: false,
  loadable: true,
  bodyweight: false,
  strengthEligible: true,
  chipperEligible: true,
  emomEligible: true,
  notes: '',
  archived: false,
};

function formatLabel(value: string): string {
  return value
    .split('-')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
}

function exerciseToDraft(
  exercise: Exercise,
): ExerciseDraft {
  const {
    id: _id,
    createdAt: _createdAt,
    isCustom: _isCustom,
    ...draft
  } = exercise;

  return {
    ...draft,
    primaryMuscles: [...draft.primaryMuscles],
    secondaryMuscles: [...draft.secondaryMuscles],
  };
}

function toggleArrayValue<T extends string>(
  values: T[],
  value: T,
): T[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function ExerciseLibraryPage() {
  const {
    state,
    createExercise,
    updateExercise,
    duplicateExercise,
    archiveExercise,
    restoreExercise,
    deleteExercise,
  } = useAppState();

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] =
    useState<ExerciseCategory | 'all'>('all');
  const [movementFilter, setMovementFilter] =
    useState<MovementPattern | 'all'>('all');
  const [equipmentFilter, setEquipmentFilter] =
    useState<Equipment | 'all'>('all');
  const [showArchived, setShowArchived] =
    useState(false);

  const [editorMode, setEditorMode] =
    useState<EditorMode>({ type: 'closed' });

  const [draft, setDraft] =
    useState<ExerciseDraft>(emptyDraft);

  const selectedExercise = useMemo(() => {
    if (
      editorMode.type !== 'edit' &&
      editorMode.type !== 'view'
    ) {
      return null;
    }

    return (
      state.exercises.find(
        (exercise) =>
          exercise.id === editorMode.exerciseId,
      ) ?? null
    );
  }, [editorMode, state.exercises]);

  const filteredExercises = useMemo(() => {
    const normalisedQuery = query
      .trim()
      .toLowerCase();

    return state.exercises
      .filter((exercise) => {
        if (
          showArchived
            ? !exercise.archived
            : exercise.archived
        ) {
          return false;
        }

        if (
          categoryFilter !== 'all' &&
          exercise.category !== categoryFilter
        ) {
          return false;
        }

        if (
          movementFilter !== 'all' &&
          exercise.movementPattern !== movementFilter
        ) {
          return false;
        }

        if (
          equipmentFilter !== 'all' &&
          exercise.equipment !== equipmentFilter
        ) {
          return false;
        }

        if (!normalisedQuery) {
          return true;
        }

        const searchableText = [
          exercise.name,
          exercise.description,
          exercise.category,
          exercise.movementPattern,
          exercise.equipment,
          exercise.exerciseType,
          ...exercise.primaryMuscles,
          ...exercise.secondaryMuscles,
          exercise.notes,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalisedQuery);
      })
      .sort((first, second) =>
        first.name.localeCompare(second.name),
      );
  }, [
    state.exercises,
    query,
    categoryFilter,
    movementFilter,
    equipmentFilter,
    showArchived,
  ]);

  const activeExerciseCount = state.exercises.filter(
    (exercise) => !exercise.archived,
  ).length;

  const archivedExerciseCount =
    state.exercises.length - activeExerciseCount;

  function openCreateEditor() {
    setDraft({
      ...emptyDraft,
      primaryMuscles: [],
      secondaryMuscles: [],
    });

    setEditorMode({ type: 'create' });
  }

  function openEditEditor(exercise: Exercise) {
    setDraft(exerciseToDraft(exercise));

    setEditorMode({
      type: 'edit',
      exerciseId: exercise.id,
    });
  }

  function openExerciseDetail(exerciseId: string) {
    setEditorMode({
      type: 'view',
      exerciseId,
    });
  }

  function closeEditor() {
    setEditorMode({ type: 'closed' });

    setDraft({
      ...emptyDraft,
      primaryMuscles: [],
      secondaryMuscles: [],
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedName = draft.name.trim();

    if (!trimmedName) {
      window.alert('Exercise name is required.');
      return;
    }

    const normalisedDraft: ExerciseDraft = {
      ...draft,
      name: trimmedName,
      description: draft.description.trim(),
      notes: draft.notes.trim(),
    };

    if (editorMode.type === 'create') {
      const createdExercise = createExercise(
        normalisedDraft,
      );

      setEditorMode({
        type: 'view',
        exerciseId: createdExercise.id,
      });

      return;
    }

    if (editorMode.type === 'edit') {
      updateExercise(
        editorMode.exerciseId,
        normalisedDraft,
      );

      setEditorMode({
        type: 'view',
        exerciseId: editorMode.exerciseId,
      });
    }
  }

  function handleDuplicate(exerciseId: string) {
    const duplicatedExercise =
      duplicateExercise(exerciseId);

    if (!duplicatedExercise) {
      return;
    }

    setDraft(exerciseToDraft(duplicatedExercise));

    setEditorMode({
      type: 'edit',
      exerciseId: duplicatedExercise.id,
    });
  }

  function handleDelete(exercise: Exercise) {
    if (!exercise.isCustom) {
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete "${exercise.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteExercise(exercise.id);
    closeEditor();
  }

  function clearFilters() {
    setQuery('');
    setCategoryFilter('all');
    setMovementFilter('all');
    setEquipmentFilter('all');
  }

  const filtersAreActive =
    query.trim().length > 0 ||
    categoryFilter !== 'all' ||
    movementFilter !== 'all' ||
    equipmentFilter !== 'all';

  return (
    <div className="page-stack">
      <section className="page-header library-page-header">
        <div>
          <span className="eyebrow">
            Exercise library
          </span>

          <h2>Movements</h2>

          <p>
            The single source of truth for exercises
            used throughout your programme.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateEditor}
        >
          Add exercise
        </button>
      </section>

      <section className="metric-grid library-metrics">
        <article className="card metric-card">
          <span>Active exercises</span>
          <strong>{activeExerciseCount}</strong>
        </article>

        <article className="card metric-card">
          <span>Custom exercises</span>
          <strong>
            {
              state.exercises.filter(
                (exercise) =>
                  exercise.isCustom &&
                  !exercise.archived,
              ).length
            }
          </strong>
        </article>

        <article className="card metric-card">
          <span>Built in</span>
          <strong>
            {
              state.exercises.filter(
                (exercise) =>
                  !exercise.isCustom &&
                  !exercise.archived,
              ).length
            }
          </strong>
        </article>

        <article className="card metric-card">
          <span>Archived</span>
          <strong>{archivedExerciseCount}</strong>
        </article>
      </section>

      <section className="card exercise-filter-panel">
        <div className="form-grid">
          <label className="full-width">
            <span>Search</span>

            <input
              type="search"
              placeholder="Search exercises, muscles or equipment"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
            />
          </label>

          <label>
            <span>Category</span>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as
                    | ExerciseCategory
                    | 'all',
                )
              }
            >
              <option value="all">
                All categories
              </option>

              {exerciseCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {formatLabel(category)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Movement pattern</span>

            <select
              value={movementFilter}
              onChange={(event) =>
                setMovementFilter(
                  event.target.value as
                    | MovementPattern
                    | 'all',
                )
              }
            >
              <option value="all">
                All movement patterns
              </option>

              {movementPatterns.map((movement) => (
                <option
                  key={movement}
                  value={movement}
                >
                  {formatLabel(movement)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Equipment</span>

            <select
              value={equipmentFilter}
              onChange={(event) =>
                setEquipmentFilter(
                  event.target.value as
                    | Equipment
                    | 'all',
                )
              }
            >
              <option value="all">
                All equipment
              </option>

              {equipmentOptions.map((equipment) => (
                <option
                  key={equipment}
                  value={equipment}
                >
                  {formatLabel(equipment)}
                </option>
              ))}
            </select>
          </label>

          <label className="toggle-field">
            <span>Library view</span>

            <button
              type="button"
              className={
                showArchived
                  ? 'secondary toggle-button active'
                  : 'secondary toggle-button'
              }
              onClick={() =>
                setShowArchived((current) => !current)
              }
            >
              {showArchived
                ? 'Showing archived'
                : 'Showing active'}
            </button>
          </label>
        </div>

        <div className="filter-summary">
          <span>
            {filteredExercises.length}{' '}
            {filteredExercises.length === 1
              ? 'exercise'
              : 'exercises'}
          </span>

          {filtersAreActive && (
            <button
              type="button"
              className="danger-link"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {editorMode.type !== 'closed' && (
        <section className="card exercise-editor-card">
          {editorMode.type === 'view' &&
            selectedExercise && (
              <>
                <div className="exercise-detail-header">
                  <div>
                    <span className="eyebrow">
                      {selectedExercise.isCustom
                        ? 'Custom exercise'
                        : 'Built-in exercise'}
                    </span>

                    <h3>{selectedExercise.name}</h3>

                    <p>
                      {selectedExercise.description ||
                        'No description has been added.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="secondary"
                    onClick={closeEditor}
                  >
                    Close
                  </button>
                </div>

                <div className="exercise-detail-grid">
                  <div>
                    <span>Category</span>
                    <strong>
                      {formatLabel(
                        selectedExercise.category,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Movement</span>
                    <strong>
                      {formatLabel(
                        selectedExercise.movementPattern,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Equipment</span>
                    <strong>
                      {formatLabel(
                        selectedExercise.equipment,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Type</span>
                    <strong>
                      {formatLabel(
                        selectedExercise.exerciseType,
                      )}
                    </strong>
                  </div>
                </div>

                <div className="exercise-detail-section">
                  <span>Primary muscles</span>

                  <div className="tag-row">
                    {selectedExercise.primaryMuscles
                      .length > 0 ? (
                      selectedExercise.primaryMuscles.map(
                        (muscle) => (
                          <span
                            className="exercise-tag"
                            key={muscle}
                          >
                            {formatLabel(muscle)}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="muted">
                        None selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="exercise-detail-section">
                  <span>Secondary muscles</span>

                  <div className="tag-row">
                    {selectedExercise.secondaryMuscles
                      .length > 0 ? (
                      selectedExercise.secondaryMuscles.map(
                        (muscle) => (
                          <span
                            className="exercise-tag secondary-tag"
                            key={muscle}
                          >
                            {formatLabel(muscle)}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="muted">
                        None selected
                      </span>
                    )}
                  </div>
                </div>

                <div className="exercise-property-grid">
                  <span>
                    {selectedExercise.unilateral
                      ? 'Unilateral'
                      : 'Bilateral'}
                  </span>

                  <span>
                    {selectedExercise.loadable
                      ? 'Loadable'
                      : 'Not loadable'}
                  </span>

                  <span>
                    {selectedExercise.bodyweight
                      ? 'Bodyweight included'
                      : 'External load'}
                  </span>

                  <span>
                    {selectedExercise.strengthEligible
                      ? 'Strength eligible'
                      : 'Not strength eligible'}
                  </span>

                  <span>
                    {selectedExercise.chipperEligible
                      ? 'Chipper eligible'
                      : 'Not chipper eligible'}
                  </span>

                  <span>
                    {selectedExercise.emomEligible
                      ? 'EMOM eligible'
                      : 'Not EMOM eligible'}
                  </span>
                </div>

                {selectedExercise.notes && (
                  <div className="exercise-detail-section">
                    <span>Notes</span>
                    <p>{selectedExercise.notes}</p>
                  </div>
                )}

                <div className="button-row">
                  <button
                    type="button"
                    onClick={() =>
                      openEditEditor(selectedExercise)
                    }
                  >
                    Edit exercise
                  </button>

                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      handleDuplicate(
                        selectedExercise.id,
                      )
                    }
                  >
                    Duplicate
                  </button>

                  {selectedExercise.archived ? (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        restoreExercise(
                          selectedExercise.id,
                        );
                        closeEditor();
                      }}
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        archiveExercise(
                          selectedExercise.id,
                        );
                        closeEditor();
                      }}
                    >
                      Archive
                    </button>
                  )}

                  {selectedExercise.isCustom && (
                    <button
                      type="button"
                      className="danger"
                      onClick={() =>
                        handleDelete(selectedExercise)
                      }
                    >
                      Delete permanently
                    </button>
                  )}
                </div>
              </>
            )}

          {(editorMode.type === 'create' ||
            editorMode.type === 'edit') && (
            <form
              className="exercise-editor-form"
              onSubmit={handleSubmit}
            >
              <div className="exercise-detail-header">
                <div>
                  <span className="eyebrow">
                    {editorMode.type === 'create'
                      ? 'New exercise'
                      : 'Edit exercise'}
                  </span>

                  <h3>
                    {editorMode.type === 'create'
                      ? 'Create movement'
                      : draft.name || 'Exercise'}
                  </h3>
                </div>

                <button
                  type="button"
                  className="secondary"
                  onClick={closeEditor}
                >
                  Cancel
                </button>
              </div>

              <div className="form-grid">
                <label>
                  <span>Name</span>

                  <input
                    required
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span>Category</span>

                  <select
                    value={draft.category}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        category:
                          event.target
                            .value as ExerciseCategory,
                      }))
                    }
                  >
                    {exerciseCategories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {formatLabel(category)}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span>Movement pattern</span>

                  <select
                    value={draft.movementPattern}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        movementPattern:
                          event.target
                            .value as MovementPattern,
                      }))
                    }
                  >
                    {movementPatterns.map(
                      (movement) => (
                        <option
                          key={movement}
                          value={movement}
                        >
                          {formatLabel(movement)}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span>Equipment</span>

                  <select
                    value={draft.equipment}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        equipment:
                          event.target
                            .value as Equipment,
                      }))
                    }
                  >
                    {equipmentOptions.map(
                      (equipment) => (
                        <option
                          key={equipment}
                          value={equipment}
                        >
                          {formatLabel(equipment)}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span>Exercise type</span>

                  <select
                    value={draft.exerciseType}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        exerciseType:
                          event.target
                            .value as ExerciseType,
                      }))
                    }
                  >
                    {exerciseTypes.map(
                      (exerciseType) => (
                        <option
                          key={exerciseType}
                          value={exerciseType}
                        >
                          {formatLabel(exerciseType)}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="full-width">
                  <span>Description</span>

                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        description:
                          event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <fieldset className="exercise-fieldset">
                <legend>Primary muscles</legend>

                <div className="choice-grid">
                  {muscleGroups.map((muscle) => (
                    <label
                      className="choice-chip"
                      key={muscle}
                    >
                      <input
                        type="checkbox"
                        checked={draft.primaryMuscles.includes(
                          muscle,
                        )}
                        onChange={() =>
                          setDraft((current) => ({
                            ...current,
                            primaryMuscles:
                              toggleArrayValue(
                                current.primaryMuscles,
                                muscle,
                              ),
                            secondaryMuscles:
                              current.secondaryMuscles.filter(
                                (item) =>
                                  item !== muscle,
                              ),
                          }))
                        }
                      />

                      <span>{formatLabel(muscle)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="exercise-fieldset">
                <legend>Secondary muscles</legend>

                <div className="choice-grid">
                  {muscleGroups.map((muscle) => (
                    <label
                      className="choice-chip"
                      key={muscle}
                    >
                      <input
                        type="checkbox"
                        checked={draft.secondaryMuscles.includes(
                          muscle,
                        )}
                        disabled={draft.primaryMuscles.includes(
                          muscle,
                        )}
                        onChange={() =>
                          setDraft((current) => ({
                            ...current,
                            secondaryMuscles:
                              toggleArrayValue(
                                current.secondaryMuscles,
                                muscle,
                              ),
                          }))
                        }
                      />

                      <span>{formatLabel(muscle)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="exercise-fieldset">
                <legend>Exercise properties</legend>

                <div className="choice-grid boolean-grid">
                  {[
                    {
                      key: 'unilateral',
                      label: 'Unilateral',
                    },
                    {
                      key: 'loadable',
                      label: 'Loadable',
                    },
                    {
                      key: 'bodyweight',
                      label: 'Uses bodyweight',
                    },
                    {
                      key: 'strengthEligible',
                      label: 'Strength eligible',
                    },
                    {
                      key: 'chipperEligible',
                      label: 'Chipper eligible',
                    },
                    {
                      key: 'emomEligible',
                      label: 'EMOM eligible',
                    },
                  ].map((property) => {
                    const key =
                      property.key as keyof Pick<
                        ExerciseDraft,
                        | 'unilateral'
                        | 'loadable'
                        | 'bodyweight'
                        | 'strengthEligible'
                        | 'chipperEligible'
                        | 'emomEligible'
                      >;

                    return (
                      <label
                        className="choice-chip"
                        key={property.key}
                      >
                        <input
                          type="checkbox"
                          checked={draft[key]}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              [key]:
                                event.target.checked,
                            }))
                          }
                        />

                        <span>{property.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <label>
                <span>Notes</span>

                <textarea
                  rows={3}
                  value={draft.notes}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="button-row">
                <button type="submit">
                  {editorMode.type === 'create'
                    ? 'Create exercise'
                    : 'Save changes'}
                </button>

                <button
                  type="button"
                  className="secondary"
                  onClick={closeEditor}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="exercise-card-grid">
        {filteredExercises.map((exercise) => (
          <article
            className={
              exercise.archived
                ? 'card exercise-library-card archived'
                : 'card exercise-library-card'
            }
            key={exercise.id}
          >
            <button
              type="button"
              className="exercise-card-main"
              onClick={() =>
                openExerciseDetail(exercise.id)
              }
            >
              <div className="exercise-card-header">
                <div>
                  <span className="exercise-source">
                    {exercise.isCustom
                      ? 'Custom'
                      : 'Built in'}
                  </span>

                  <h3>{exercise.name}</h3>
                </div>

                <span className="exercise-chevron">
                  ›
                </span>
              </div>

              <p>
                {exercise.description ||
                  'No description added.'}
              </p>

              <div className="tag-row">
                <span className="exercise-tag">
                  {formatLabel(exercise.category)}
                </span>

                <span className="exercise-tag secondary-tag">
                  {formatLabel(
                    exercise.movementPattern,
                  )}
                </span>

                <span className="exercise-tag secondary-tag">
                  {formatLabel(exercise.equipment)}
                </span>
              </div>
            </button>

            <div className="exercise-card-actions">
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  openEditEditor(exercise)
                }
              >
                Edit
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() =>
                  handleDuplicate(exercise.id)
                }
              >
                Duplicate
              </button>

              {exercise.archived ? (
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    restoreExercise(exercise.id)
                  }
                >
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    archiveExercise(exercise.id)
                  }
                >
                  Archive
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {filteredExercises.length === 0 && (
        <section className="card empty-state">
          <h3>No exercises found</h3>

          <p>
            Adjust the filters or create a new custom
            exercise.
          </p>

          <button
            type="button"
            onClick={openCreateEditor}
          >
            Add exercise
          </button>
        </section>
      )}
    </div>
  );
}
