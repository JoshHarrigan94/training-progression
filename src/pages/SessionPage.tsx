import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { useAppState } from '../state/AppContext';
import type { CompletedSession } from '../types';
import { createId } from '../utils/id';

export function SessionPage() {
  const { state, setState, setActivePage } = useAppState();
  const [name, setName] = useState('Training session');
  const [duration, setDuration] = useState('');
  const [rpe, setRpe] = useState('');
  const [notes, setNotes] = useState('');

  if (!state.programme) {
    return <EmptyState title="Create a programme first" body="A programme is required before sessions can be planned and logged." action={<button onClick={() => setActivePage('programme')}>Open programme</button>} />;
  }

  function completeSession() {
    const now = new Date().toISOString();
    const session: CompletedSession = {
      id: createId('session'),
      name: name.trim() || 'Training session',
      scheduledDate: now.slice(0, 10),
      completedAt: now,
      durationMinutes: duration ? Number(duration) : undefined,
      sessionRpe: rpe ? Number(rpe) : undefined,
      notes: notes.trim() || undefined,
      strengthSets: [],
    };
    setState((current) => ({ ...current, completedSessions: [session, ...current.completedSessions] }));
    setDuration(''); setRpe(''); setNotes('');
    window.alert('Session saved locally. Strength, chipper and EMOM execution will be added in the next build stage.');
  }

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Session log</span><h2>Record today’s work</h2><p>This first release provides a stable session record. Detailed prescription execution comes next.</p></section>
      <section className="card form-grid">
        <label><span>Session name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label><span>Duration in minutes</span><input type="number" inputMode="numeric" value={duration} onChange={(event) => setDuration(event.target.value)} /></label>
        <label><span>Session RPE</span><input type="number" min="1" max="10" step="0.5" value={rpe} onChange={(event) => setRpe(event.target.value)} /></label>
        <label className="full-width"><span>Notes</span><textarea rows={5} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
      </section>
      <section className="three-part-preview">
        <article className="card"><span className="eyebrow">A</span><h3>Strength</h3><p>Prescription-based primary lift work.</p></article>
        <article className="card"><span className="eyebrow">B</span><h3>Chipper</h3><p>Fixed workload, quality and pacing.</p></article>
        <article className="card"><span className="eyebrow">C</span><h3>EMOM</h3><p>Density, skill and accessory quality.</p></article>
      </section>
      <button className="primary-action" onClick={completeSession}>Complete and save session</button>
    </div>
  );
}
