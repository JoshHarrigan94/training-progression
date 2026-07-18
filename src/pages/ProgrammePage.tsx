import { useMemo, useState } from 'react';
import { useAppState } from '../state/AppContext';
import type { Exercise, Programme, StrengthExerciseProfile } from '../types';
import { createId } from '../utils/id';
import { createTwelveWeekCycle } from '../utils/cycle';
import { generateTwelveWeekPrescriptions, validateRmInputs } from '../utils/strengthEngine';

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
  const [selectedPreviewId, setSelectedPreviewId] = useState(existing?.selectedExerciseIds[0] ?? '');

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
  const loadIncrement = increment === 'custom' ? Number(customIncrement) : Number(increment);
  const previewProfile = profiles.find((profile) => profile.exerciseId === selectedPreviewId && profile.selected);
  const previewData = useMemo(() => {
    if (!previewProfile || !Number(previewProfile.fiveRm) || !Number(previewProfile.threeRm) || !Number(previewProfile.twoRm) || !loadIncrement) return [];
    return generateTwelveWeekPrescriptions({
      id: 'preview',
      exerciseId: previewProfile.exerciseId,
      fiveRm: Number(previewProfile.fiveRm),
      threeRm: Number(previewProfile.threeRm),
      twoRm: Number(previewProfile.twoRm),
      oneRm: previewProfile.oneRm ? Number(previewProfile.oneRm) : undefined,
    }, loadIncrement, state.strengthSettings);
  }, [loadIncrement, previewProfile, state.strengthSettings]);

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
    setSelectedPreviewId(exercise.id);
    setCustomExerciseName('');
  }

  function saveProgramme() {
    const selected = profiles.filter((profile) => profile.selected);
    if (!name.trim() || !startDate || selected.length === 0 || !Number.isFinite(loadIncrement) || loadIncrement <= 0) {
      window.alert('Add a programme name, start date, valid increment and at least one primary lift.');
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
    const errors = strengthProfiles.flatMap((profile) => validateRmInputs(profile).errors);
    if (errors.length) {
      window.alert(errors[0]);
      return;
    }

    const now = new Date().toISOString();
    const programme: Programme = {
      id: existing?.id ?? createId('programme'),
      name: name.trim(),
      startDate,
      plateIncrement: loadIncrement,
      customPlateIncrement: increment === 'custom' ? loadIncrement : undefined,
      selectedExerciseIds: selected.map((profile) => profile.exerciseId),
      strengthProfiles,
      cycle: createTwelveWeekCycle(name.trim(), startDate),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    setState((current) => ({ ...current, programme }));
    if (!selectedPreviewId) setSelectedPreviewId(programme.selectedExerciseIds[0]);
    setSaved(true);
  }

  const selectableProfiles = profiles.filter((profile) => profile.selected);

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Programme builder</span><h2>Set the cycle foundation</h2><p>Edit your reference RMs and the 12-week prescription recalculates immediately.</p></section>

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
            return <div className={`lift-row ${profile.selected ? 'selected' : ''}`} key={profile.exerciseId}>
              <label className="lift-name"><input type="checkbox" checked={profile.selected} onChange={(event) => { updateProfile(profile.exerciseId, { selected: event.target.checked }); if (event.target.checked) setSelectedPreviewId(profile.exerciseId); }} /><strong>{exercise.name}</strong></label>
              <div className="rm-grid">
                <label><span>5RM</span><input type="number" inputMode="decimal" value={profile.fiveRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { fiveRm: event.target.value })} /></label>
                <label><span>3RM</span><input type="number" inputMode="decimal" value={profile.threeRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { threeRm: event.target.value })} /></label>
                <label><span>2RM</span><input type="number" inputMode="decimal" value={profile.twoRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { twoRm: event.target.value })} /></label>
                <label><span>1RM optional</span><input type="number" inputMode="decimal" value={profile.oneRm} disabled={!profile.selected} onChange={(event) => updateProfile(profile.exerciseId, { oneRm: event.target.value })} /></label>
              </div>
            </div>;
          })}
        </div>
      </section>

      <section className="card inline-form">
        <label><span>Custom primary lift</span><input placeholder="e.g. Safety-bar squat" value={customExerciseName} onChange={(event) => setCustomExerciseName(event.target.value)} /></label>
        <button type="button" className="secondary" onClick={addCustomExercise}>Add lift</button>
      </section>

      <button className="primary-action" onClick={saveProgramme}>Save programme</button>
      {saved && <p className="success-message">Programme saved locally.</p>}

      <section className="card prescription-section">
        <div className="section-heading"><div><span className="eyebrow">12-week prescription</span><h2>Strength wave</h2></div></div>
        {selectableProfiles.length ? <>
          <label><span>Preview lift</span><select value={selectedPreviewId || selectableProfiles[0]?.exerciseId} onChange={(event) => setSelectedPreviewId(event.target.value)}>{selectableProfiles.map((profile) => <option key={profile.exerciseId} value={profile.exerciseId}>{exerciseMap.get(profile.exerciseId)?.name}</option>)}</select></label>
          {previewData.length ? <div className="prescription-grid">{previewData.map((item) => <article className={`prescription-card ${item.isDeload ? 'deload' : ''}`} key={item.weekNumber}>
            <div className="prescription-card-head"><strong>Week {item.weekNumber}</strong><span>{item.isDeload ? 'Deload' : `${Math.round(item.weeklyPercentage * 100)}%`}</span></div>
            <p>{item.phase} · Month {item.monthNumber}</p>
            <dl><div><dt>Reference</dt><dd>{item.referenceRmType} {item.referenceRmValue.toFixed(1)} kg</dd></div><div><dt>Working max</dt><dd>{item.updatedWorkingMax.toFixed(1)} kg</dd></div><div><dt>Prescription</dt><dd>{item.targetSets} × {item.targetRepetitions} @ {item.roundedPrescribedLoad} kg</dd></div><div><dt>Exact</dt><dd>{item.exactPrescribedLoad.toFixed(2)} kg</dd></div></dl>
            <small>{item.explanation}</small>
          </article>)}</div> : <p className="muted">Enter valid 5RM, 3RM and 2RM values to preview the prescription.</p>}
        </> : <p className="muted">Select at least one lift to build the prescription.</p>}
      </section>
    </div>
  );
}
