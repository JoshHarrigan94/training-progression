import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppContext';
import type { Exercise, ExerciseCategory } from '../types';
import { createId } from '../utils/id';

export function ExerciseLibraryPage() {
  const { state, setState } = useAppState();
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('general');
  const filtered = useMemo(() => state.exercises.filter((exercise) => exercise.name.toLowerCase().includes(query.toLowerCase())), [state.exercises, query]);

  function addExercise() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exercise: Exercise = { id: createId('exercise'), name: trimmed, category, isCustom: true, createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, exercises: [...current.exercises, exercise] }));
    setName('');
  }

  function removeExercise(id: string) {
    if (!window.confirm('Remove this custom exercise?')) return;
    setState((current) => ({ ...current, exercises: current.exercises.filter((exercise) => exercise.id !== id) }));
  }

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Exercise library</span><h2>Movements</h2><p>Default and custom exercises used throughout the programme.</p></section>
      <section className="card"><label><span>Search</span><input placeholder="Search exercises" value={query} onChange={(event) => setQuery(event.target.value)} /></label></section>
      <section className="card inline-form wrap">
        <label><span>New exercise</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value as ExerciseCategory)}><option value="strength">Strength</option><option value="chipper">Chipper</option><option value="emom">EMOM</option><option value="general">General</option></select></label>
        <button className="secondary" onClick={addExercise}>Add exercise</button>
      </section>
      <section className="card exercise-list">
        {filtered.map((exercise) => (
          <div className="list-row" key={exercise.id}><div><strong>{exercise.name}</strong><span>{exercise.category} · {exercise.isCustom ? 'custom' : 'built in'}</span></div>{exercise.isCustom && <button className="danger-link" onClick={() => removeExercise(exercise.id)}>Remove</button>}</div>
        ))}
      </section>
    </div>
  );
}
