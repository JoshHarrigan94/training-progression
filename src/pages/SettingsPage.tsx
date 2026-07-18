import { useRef, useState } from 'react';
import { useAppState } from '../state/AppContext';
import { exportState } from '../state/storage';
import type { AppState } from '../types';

export function SettingsPage() {
  const { state, replaceState, resetState } = useAppState();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  async function importFile(file?: File) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as AppState;
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.exercises)) throw new Error('Invalid file');
      replaceState({ ...parsed, activePage: 'settings' });
      setMessage('Backup imported successfully.');
    } catch {
      setMessage('That file could not be imported.');
    }
  }

  function reset() {
    if (!window.confirm('Reset all locally saved programme and training data? This cannot be undone unless you exported a backup.')) return;
    resetState();
  }

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Local data</span><h2>Settings</h2><p>Your information stays in this browser unless you export it.</p></section>
      <section className="card settings-actions">
        <button onClick={() => exportState(state)}>Export all data as JSON</button>
        <button className="secondary" onClick={() => inputRef.current?.click()}>Import JSON backup</button>
        <input ref={inputRef} type="file" accept="application/json" hidden onChange={(event) => importFile(event.target.files?.[0])} />
        <button className="danger" onClick={reset}>Reset all application data</button>
        {message && <p className="muted">{message}</p>}
      </section>
      <section className="card"><span className="eyebrow">Storage status</span><h3>Version {state.version}</h3><p className="muted">{state.programme ? `Programme: ${state.programme.name}` : 'No active programme'} · {state.completedSessions.length} completed sessions · {state.exercises.length} exercises.</p></section>
    </div>
  );
}
