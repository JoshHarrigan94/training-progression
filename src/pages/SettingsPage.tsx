import { useRef, useState } from 'react';
import { useAppState } from '../state/AppContext';
import { exportState } from '../state/storage';
import type { E1RmFormula, WeightedLoadMode } from '../types';

export function SettingsPage() {
  const { state, setState, replaceState, resetState } = useAppState();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  async function importFile(file?: File) {
    if (!file) return;
    try {
      replaceState(JSON.parse(await file.text()));
      setMessage('Backup imported and migrated successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'That file could not be imported.');
    }
  }

  function reset() {
    if (!window.confirm('Reset all locally saved programme and training data? This cannot be undone unless you exported a backup.')) return;
    resetState();
  }

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Training configuration</span><h2>Settings</h2><p>Configure prescription, deload and E1RM behaviour. Your information remains in this browser.</p></section>
      <section className="card form-grid">
        <label><span>Monthly working-max increase</span><input type="number" min="0" step="0.005" value={state.strengthSettings.monthlyIncrease} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, monthlyIncrease: Number(event.target.value) } }))} /></label>
        <label><span>Standard target sets</span><input type="number" min="1" step="1" value={state.strengthSettings.defaultTargetSets} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, defaultTargetSets: Number(event.target.value) } }))} /></label>
        <label><span>Deload percentage</span><input type="number" min="0.1" max="1" step="0.05" value={state.strengthSettings.deload.percentage} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, deload: { ...current.strengthSettings.deload, percentage: Number(event.target.value) } } }))} /></label>
        <label><span>Deload sets</span><input type="number" min="1" step="1" value={state.strengthSettings.deload.targetSets} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, deload: { ...current.strengthSettings.deload, targetSets: Number(event.target.value) } } }))} /></label>
        <label><span>E1RM formula</span><select value={state.strengthSettings.e1rmFormula} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, e1rmFormula: event.target.value as E1RmFormula } }))}><option value="epley">Epley</option><option value="brzycki">Brzycki</option><option value="average">Average of both</option></select></label>
        <label><span>Weighted dip/chin-up calculation</span><select value={state.strengthSettings.weightedLoadMode} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, weightedLoadMode: event.target.value as WeightedLoadMode } }))}><option value="external-only">External load only</option><option value="bodyweight-plus-external">Bodyweight plus external load</option></select></label>
        <label><span>Current bodyweight, optional</span><input type="number" inputMode="decimal" value={state.strengthSettings.currentBodyweight ?? ''} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, currentBodyweight: event.target.value ? Number(event.target.value) : undefined } }))} /></label>
        <label className="full-width"><span>Deload guidance</span><input value={state.strengthSettings.deload.guidance} onChange={(event) => setState((current) => ({ ...current, strengthSettings: { ...current.strengthSettings, deload: { ...current.strengthSettings.deload, guidance: event.target.value } } }))} /></label>
      </section>
      <section className="card settings-actions">
        <button onClick={() => exportState(state)}>Export all data as JSON</button>
        <button className="secondary" onClick={() => inputRef.current?.click()}>Import JSON backup</button>
        <input ref={inputRef} type="file" accept="application/json" hidden onChange={(event) => importFile(event.target.files?.[0])} />
        <button className="danger" onClick={reset}>Reset all application data</button>
        {message && <p className="muted">{message}</p>}
      </section>
      <section className="card"><span className="eyebrow">Storage status</span><h3>Schema version {state.version}</h3><p className="muted">{state.programme ? `Programme: ${state.programme.name}` : 'No active programme'} · {state.completedSessions.length} completed sessions · {state.exercises.length} exercises.</p></section>
    </div>
  );
}
