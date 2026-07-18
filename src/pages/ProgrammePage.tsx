import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppContext';
import type { Exercise, Programme, StrengthExerciseProfile } from '../types';
import { createId } from '../utils/id';
import { createTwelveWeekCycle } from '../utils/cycle';

interface DraftProfile {
  exerciseId: string;
  selected: boolean;
  fiveRm: string;
  threeRm: string;
  twoRm: string;
  oneRm: string;
}

export function ProgrammePage() {
  const { state, setState } = useAppState();
  const existing = state.programme;
  const [name, setName] = useState(existing?.name ?? 'My 12-Week Cycle');
  const [startDate, setStartDate] = useState(existing?.startDate ?? new Date().toISOString().slice(0, 10));
  const [increment, setIncrement] = useState(String(existing?.plateIncrement ?? 2.5));
  const [customIncrement, setCustomIncrement] = useState(String(existing?.customPlateIncrement ?? 0.25));
  const [customExerciseName, setCustomExerciseName] = useState('');
  const [saved, setSaved] = useState(false);

  const [profiles, setProfiles] = useState<DraftProfile[]>(() => state.exercises
    .filter((exercise) => exercise.category === 'strength')
    .map((exercise) => {
      const current = existing?.strengthProfiles.find((profile) => profile.exerciseId === exercise.id);
      return {
        exerciseId: exercise.id,
        selected: existing?.selectedExerciseIds.includes(exercise.id) ?? false,
        fiveRm: current?.fiveRm ? String(current.fiveRm) : '',
        threeRm: current?.threeRm ? String(current.threeRm) : '',
        twoRm: current?.twoRm ? String(current.twoRm) : '',
        oneRm: current?.oneRm ? String(current.oneRm) : '',
      };
    }));

  const exerciseMap = useMemo(() => new Map(state.exercises.map((exercise) => [exercise.id, exercise])), [state.exercises]);

  function updateProfile(exerciseId: string, patch: Partial<DraftProfile>) {
    setProfiles((current) => current.map((profile) => profile.exerciseId === exerciseId ? { ...profile, ...patch } : profile));
    setSaved(false);
  }

  function addCustomExercise() {
    const trimmed = customExerciseName.trim();
    if (!trimmed) return;
    const exercise: Exercise = { id: createId('exercise'), name: trimmed, category: 'strength', isCustom: true, createdAt: new Date().toISOString() };
    setState((current) => ({ ...current, exercises: [...current.exercises, exercise] }));
    setProfiles((current) => [...current, { exerciseId: exercise.id, selected: true, fiveRm: '', threeRm: '', twoRm: '', oneRm: '' }]);
    setCustomExerciseName('');
  }

  function saveProgramme() {
    const selected = profiles.filter((profile) => profile.selected);
    if (!name.trim() || !startDate || selected.length === 0) {
      window.alert('Add a programme name, start date and at least one primary lift.');
      return;
    }

    const invalid = selected.some((profile) => !Number(profile.fiveRm) || !Number(profile.threeRm) || !Number(profile.twoRm));
    if (invalid) {
      window.alert('Every selected lift needs valid 5RM, 3RM and 2RM values.');
      return;
    }

    const strengthProfiles: StrengthExerciseProfile[] = selected.map((profile) => ({
      id: existing?.strengthProfiles.find((item) => item.exerciseId === profile.exerciseId)?.id ?? createId('profile'),
      exerciseId: profile.exerciseId,
      fiveRm: Number(profile.fiveRm),
      threeRm: Number(profile.threeRm),
      twoRm: Number(profile.twoRm),
      oneRm: profile.oneRm ? Number(profile.oneRm) : undefined,
    }));

    const now = new Date().toISOString();
    const programme: Programme = {
      id: existing?.id ?? createId('programme'),
      name: name.trim(),
      startDate,
      plateIncrement: increment === 'custom' ? Number(customIncrement) : Number(increment),
      customPlateIncrement: increment === 'custom' ? Number(customIncrement) : undefined,
      selectedExerciseIds: selected.map((profile) => profile.exerciseId),
      strengthProfiles,
      cycle: createTwelveWeekCycle(name.trim(), startDate),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    setState((current) => ({ ...current, programme }));
    setSaved(true);
  }

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Programme builder</span><h2>Set the cycle foundation</h2><p>Choose the lifts and reference RMs that will drive the later prescription engine.</p></section>

      <section className="card form-grid">
        <label><span>Programme name</span><input value={name} onChange={(event) => { setName(event.target.value); setSaved(false); }} /></label>
        <label><span>Start date</span><input type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setSaved(false); }} /></label>
        <label><span>Available load increment</span><select value={increment} onChange={(event) => { setIncrement(event.target.value); setSaved(false); }}><option value="0.5">0.5 kg</option><option value="1">1 kg</option><option value="1.25">1.25 kg</option><option value="2.5">2.5 kg</option><option value="custom">Custom</option></select></label>
        {increment === 'custom' && <label><span>Custom increment</span><input type="number" min="0.01" step="0.01" value={customIncrement} onChange={(event) => setCustomIncrement(event.target.value)} /></label>}
      </section>

      <section className="card">
        <div className="section-heading"><div><span className="eyebrow">Primary lifts</span><h2>Reference strength</h2></div></div>
        <div className="lift-table">
          {profiles.map((profile) => {
            const exercise = exerciseMap.get(profile.exerciseId);
            if (!exercise) return null;
            return (
              <div className={`lift-row ${profile.selected ? 'selected' : ''}`} key={profile.exerciseId}>
                <label className="lift-name"><input type="checkbox" checked={profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { selected: event.target.checked })} /><strong>{exercise.name}</strong></label>
                <div className="rm-grid">
                  <label><span>5RM</span><input type="number" inputMode="decimal" value={profile.fiveRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { fiveRm: event.target.value })} /></label>
                  <label><span>3RM</span><input type="number" inputMode="decimal" value={profile.threeRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { threeRm: event.target.value })} /></label>
                  <label><span>2RM</span><input type="number" inputMode="decimal" value={profile.twoRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { twoRm: event.target.value })} /></label>
                  <label><span>1RM optional</span><input type="number" inputMode="decimal" value={profile.oneRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { oneRm: event.target.value })} /></label>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card inline-form">
        <label><span>Custom primary lift</span><input placeholder="e.g. Safety-bar squat" value={customExerciseName} onChange={(event) => setCustomExerciseName(event.target.value)} /></label>
        <button type="button" className="secondary" onClick={addCustomExercise}>Add lift</button>
      </section>

      <button className="primary-action" onClick={saveProgramme}>Save programme</button>
      {saved && <p className="success-message">Programme saved locally.</p>}
    </div>
  );
}
