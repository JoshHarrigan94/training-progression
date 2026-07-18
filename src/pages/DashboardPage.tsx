import { useAppState } from '../state/AppContext';
import { getCurrentWeek } from '../utils/cycle';
import { EmptyState } from '../components/EmptyState';

export function DashboardPage() {
  const { state, setActivePage } = useAppState();
  const programme = state.programme;

  if (!programme) {
    return (
      <EmptyState
        title="Build your first 12-week cycle"
        body="Set your primary lifts and RM values to unlock weekly prescriptions, session planning and progress tracking."
        action={<button onClick={() => setActivePage('programme')}>Create programme</button>}
      />
    );
  }

  const currentWeek = getCurrentWeek(programme.startDate);
  const week = programme.cycle.weeks[currentWeek - 1];
  const recentSessions = [...state.completedSessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 3);
  const nextSession = state.plannedSessions
    .filter((session) => session.scheduledDate >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))[0];

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div>
          <span className="eyebrow">{programme.name}</span>
          <h2>Week {week.weekNumber} of 12</h2>
          <p>Month {week.monthNumber} · {week.phase}</p>
        </div>
        <div className="hero-metric">
          <strong>{week.isDeload ? 'Deload' : `${week.percentage}%`}</strong>
          <span>weekly target</span>
        </div>
      </section>

      <section className="metric-grid">
        <article className="card metric-card"><span>Current month</span><strong>{week.monthNumber}</strong></article>
        <article className="card metric-card"><span>Strength phase</span><strong>{week.phase}</strong></article>
        <article className="card metric-card"><span>Primary lifts</span><strong>{programme.selectedExerciseIds.length}</strong></article>
        <article className="card metric-card"><span>Sessions logged</span><strong>{state.completedSessions.length}</strong></article>
      </section>

      <section className="card">
        <div className="section-heading"><div><span className="eyebrow">Next up</span><h2>Planned session</h2></div></div>
        {nextSession ? (
          <div className="list-row"><div><strong>{nextSession.name}</strong><span>{nextSession.scheduledDate}</span></div><button onClick={() => setActivePage('session')}>Open</button></div>
        ) : (
          <p className="muted">No session is currently planned.</p>
        )}
      </section>

      <section className="card chart-placeholder">
        <span className="eyebrow">Coming next</span>
        <h2>Strength progression</h2>
        <div className="placeholder-graph" aria-label="Strength chart placeholder">
          {[28, 44, 62, 24, 52, 70, 86, 30, 58, 78, 94, 34].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}
        </div>
        <p className="muted">The prescription wave and ongoing E1RM will be added in the analytics stage.</p>
      </section>

      <section className="card">
        <div className="section-heading"><div><span className="eyebrow">History</span><h2>Recent sessions</h2></div></div>
        {recentSessions.length ? recentSessions.map((session) => (
          <div className="list-row" key={session.id}><div><strong>{session.name}</strong><span>{new Date(session.completedAt).toLocaleDateString()}</span></div><span>{session.durationMinutes ? `${session.durationMinutes} min` : 'Complete'}</span></div>
        )) : <p className="muted">Your completed sessions will appear here.</p>}
      </section>
    </div>
  );
}
