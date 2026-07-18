import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { useAppState } from '../state/AppContext';
import type { CompletedSession, SetStatus, StrengthSet } from '../types';
import { createId } from '../utils/id';
import { getCurrentWeek } from '../utils/cycle';
import { generateWeeklyPrescription } from '../utils/strengthEngine';
import { calculateE1Rm, resolveCalculationLoad } from '../utils/e1rm';

interface DraftSet {
  id: string;
  setNumber: number;
  actualLoad: string;
  actualReps: string;
  rpe: string;
  rir: string;
  bodyweight: string;
  status: SetStatus;
  notes: string;
}

function createDraftSet(setNumber: number, load: number, reps: number, bodyweight?: number): DraftSet {
  return {
    id: createId('set'),
    setNumber,
    actualLoad: String(load),
    actualReps: String(reps),
    rpe: '',
    rir: '',
    bodyweight: bodyweight ? String(bodyweight) : '',
    status: 'planned',
    notes: '',
  };
}

export function SessionPage() {
  const { state, setState, setActivePage } = useAppState();
  const programme = state.programme;
  const [selectedExerciseId, setSelectedExerciseId] = useState(programme?.selectedExerciseIds[0] ?? '');
  const [duration, setDuration] = useState('');
  const [sessionRpe, setSessionRpe] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const currentWeek = programme ? getCurrentWeek(programme.startDate) : 1;
  const profile = programme?.strengthProfiles.find((item) => item.exerciseId === selectedExerciseId);
  const exercise = state.exercises.find((item) => item.id === selectedExerciseId);
  const prescription = useMemo(() => programme && profile
    ? generateWeeklyPrescription(profile, currentWeek, programme.plateIncrement, state.strengthSettings)
    : null, [currentWeek, profile, programme, state.strengthSettings]);
  const [sets, setSets] = useState<DraftSet[]>([]);

  if (!programme) {
    return <EmptyState title="Create a programme first" body="A programme is required before sessions can be prescribed and logged." action={<button onClick={() => setActivePage('programme')}>Open programme</button>} />;
  }

  function initialiseSets() {
    if (!prescription) return;
    setSets(Array.from({ length: prescription.targetSets }, (_, index) => createDraftSet(index + 1, prescription.roundedPrescribedLoad, prescription.targetRepetitions, state.strengthSettings.currentBodyweight)));
  }

  function updateSet(id: string, patch: Partial<DraftSet>) {
    setSets((current) => current.map((set) => set.id === id ? { ...set, ...patch } : set));
  }

  function addSet() {
    if (!prescription) return;
    setSets((current) => [...current, createDraftSet(current.length + 1, prescription.roundedPrescribedLoad, prescription.targetRepetitions, state.strengthSettings.currentBodyweight)]);
  }

  function removeSet(id: string) {
    setSets((current) => current.filter((set) => set.id !== id).map((set, index) => ({ ...set, setNumber: index + 1 })));
  }

  function copyPrevious(index: number) {
    if (index < 1) return;
    const previous = sets[index - 1];
    updateSet(sets[index].id, { ...previous, id: sets[index].id, setNumber: sets[index].setNumber });
  }

  function completeSession() {
    if (!prescription || !exercise) return;
    const now = new Date().toISOString();
    const strengthSets: StrengthSet[] = sets.map((set) => {
      const actualLoad = Number(set.actualLoad) || 0;
      const actualReps = Number(set.actualReps) || 0;
      const bodyweight = set.bodyweight ? Number(set.bodyweight) : undefined;
      const calculationLoad = resolveCalculationLoad(exercise.name, actualLoad, bodyweight, state.strengthSettings.weightedLoadMode);
      const e1rm = calculateE1Rm(calculationLoad, actualReps, state.strengthSettings.e1rmFormula);
      return {
        id: set.id,
        exerciseId: exercise.id,
        weekNumber: currentWeek,
        setNumber: set.setNumber,
        prescribedLoad: prescription.roundedPrescribedLoad,
        actualLoad,
        targetReps: prescription.targetRepetitions,
        actualReps,
        rpe: set.rpe ? Number(set.rpe) : undefined,
        rir: set.rir ? Number(set.rir) : undefined,
        bodyweight,
        status: set.status,
        notes: set.notes.trim() || undefined,
        e1rm: e1rm ?? undefined,
        completed: set.status === 'completed' || set.status === 'modified',
      };
    });

    const session: CompletedSession = {
      id: createId('session'),
      name: `${exercise.name} · Week ${currentWeek}`,
      scheduledDate: now.slice(0, 10),
      completedAt: now,
      durationMinutes: duration ? Number(duration) : undefined,
      sessionRpe: sessionRpe ? Number(sessionRpe) : undefined,
      notes: sessionNotes.trim() || undefined,
      strengthSets,
    };
    setState((current) => ({ ...current, completedSessions: [session, ...current.completedSessions] }));
    setSets([]);
    setDuration('');
    setSessionRpe('');
    setSessionNotes('');
    window.alert('Strength session saved locally.');
  }

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Session execution</span><h2>Week {currentWeek} strength prescription</h2><p>Prescribed and actual work remain separate, so modifications are preserved honestly.</p></section>

      <section className="card form-grid">
        <label><span>Primary lift</span><select value={selectedExerciseId} onChange={(event) => { setSelectedExerciseId(event.target.value); setSets([]); }}>{programme.selectedExerciseIds.map((id) => <option key={id} value={id}>{state.exercises.find((item) => item.id === id)?.name}</option>)}</select></label>
        <label><span>Current programme week</span><input value={currentWeek} disabled /></label>
      </section>

      {prescription && <section className={`card prescription-summary ${prescription.isDeload ? 'deload' : ''}`}>
        <span className="eyebrow">{exercise?.name}</span><h2>{prescription.targetSets} × {prescription.targetRepetitions} @ {prescription.roundedPrescribedLoad} kg</h2>
        <div className="metric-grid compact"><article><span>Phase</span><strong>{prescription.phase}</strong></article><article><span>Percentage</span><strong>{Math.round(prescription.weeklyPercentage * 100)}%</strong></article><article><span>Working max</span><strong>{prescription.updatedWorkingMax.toFixed(1)} kg</strong></article><article><span>Status</span><strong>{prescription.isDeload ? 'Deload' : 'Build'}</strong></article></div>
        <p className="muted">{prescription.explanation}</p>
        {!sets.length && <button onClick={initialiseSets}>Load prescribed sets</button>}
      </section>}

      {sets.map((set, index) => <section className="card set-card" key={set.id}>
        <div className="section-heading"><div><span className="eyebrow">Set {set.setNumber}</span><h3>Prescribed {prescription?.roundedPrescribedLoad} kg × {prescription?.targetRepetitions}</h3></div><button className="danger-link" onClick={() => removeSet(set.id)}>Remove</button></div>
        <div className="form-grid">
          <label><span>Actual load</span><input type="number" inputMode="decimal" value={set.actualLoad} onChange={(event) => updateSet(set.id, { actualLoad: event.target.value })} /></label>
          <label><span>Actual reps</span><input type="number" inputMode="numeric" value={set.actualReps} onChange={(event) => updateSet(set.id, { actualReps: event.target.value })} /></label>
          <label><span>RPE</span><input type="number" min="1" max="10" step="0.5" value={set.rpe} onChange={(event) => updateSet(set.id, { rpe: event.target.value })} /></label>
          <label><span>RIR</span><input type="number" min="0" max="10" value={set.rir} onChange={(event) => updateSet(set.id, { rir: event.target.value })} /></label>
          <label><span>Bodyweight</span><input type="number" inputMode="decimal" value={set.bodyweight} onChange={(event) => updateSet(set.id, { bodyweight: event.target.value })} /></label>
          <label><span>Status</span><select value={set.status} onChange={(event) => updateSet(set.id, { status: event.target.value as SetStatus })}><option value="planned">Planned</option><option value="completed">Completed</option><option value="modified">Modified</option><option value="skipped">Skipped</option></select></label>
          <label className="full-width"><span>Set notes</span><textarea rows={2} value={set.notes} onChange={(event) => updateSet(set.id, { notes: event.target.value })} /></label>
        </div>
        <div className="button-row"><button className="secondary" onClick={() => prescription && updateSet(set.id, { actualLoad: String(prescription.roundedPrescribedLoad) })}>Use prescribed load</button>{index > 0 && <button className="secondary" onClick={() => copyPrevious(index)}>Copy previous set</button>}<button onClick={() => updateSet(set.id, { status: 'completed' })}>Mark complete</button></div>
      </section>)}

      {sets.length > 0 && <>
        <button className="secondary" onClick={addSet}>Add set</button>
        <section className="card form-grid"><label><span>Duration in minutes</span><input type="number" value={duration} onChange={(event) => setDuration(event.target.value)} /></label><label><span>Session RPE</span><input type="number" min="1" max="10" step="0.5" value={sessionRpe} onChange={(event) => setSessionRpe(event.target.value)} /></label><label className="full-width"><span>Session notes</span><textarea rows={4} value={sessionNotes} onChange={(event) => setSessionNotes(event.target.value)} /></label></section>
        <button className="primary-action" onClick={completeSession}>Complete and save session</button>
      </>}
    </div>
  );
}
