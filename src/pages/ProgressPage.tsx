import { EmptyState } from '../components/EmptyState';
import { useAppState } from '../state/AppContext';

export function ProgressPage() {
  const { state, setActivePage } = useAppState();
  if (!state.programme) return <EmptyState title="No progress data yet" body="Create a programme and begin logging sessions to populate your analytics." action={<button onClick={() => setActivePage('programme')}>Create programme</button>} />;

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Analytics foundation</span><h2>Progress</h2><p>The application is ready to receive the prescription wave, theoretical trend and ongoing E1RM graph.</p></section>
      <section className="card chart-placeholder large"><div className="placeholder-graph">{[22, 34, 48, 30, 52, 64, 76, 42, 68, 80, 92, 56].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div></section>
      <section className="metric-grid">
        <article className="card metric-card"><span>Completed sessions</span><strong>{state.completedSessions.length}</strong></article>
        <article className="card metric-card"><span>Personal records</span><strong>{state.personalRecords.length}</strong></article>
        <article className="card metric-card"><span>Chipper templates</span><strong>{state.chipperWorkouts.length}</strong></article>
        <article className="card metric-card"><span>EMOM templates</span><strong>{state.emomWorkouts.length}</strong></article>
      </section>
    </div>
  );
}
