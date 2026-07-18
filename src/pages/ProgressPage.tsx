import { useMemo, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState } from '../components/EmptyState';
import { useAppState } from '../state/AppContext';
import { generateTwelveWeekPrescriptions } from '../utils/strengthEngine';

export function ProgressPage() {
  const { state, setActivePage } = useAppState();
  const programme = state.programme;
  const [selectedExerciseId, setSelectedExerciseId] = useState(programme?.selectedExerciseIds[0] ?? '');

  if (!programme) return <EmptyState title="No progress data yet" body="Create a programme and begin logging sessions to populate your analytics." action={<button onClick={() => setActivePage('programme')}>Create programme</button>} />;

  const profile = programme.strengthProfiles.find((item) => item.exerciseId === selectedExerciseId) ?? programme.strengthProfiles[0];
  const exercise = state.exercises.find((item) => item.id === profile?.exerciseId);
  const prescriptions = profile ? generateTwelveWeekPrescriptions(profile, programme.plateIncrement, state.strengthSettings) : [];
  const relevantSets = state.completedSessions.flatMap((session) => session.strengthSets.map((set) => ({ ...set, completedAt: session.completedAt }))).filter((set) => set.exerciseId === profile?.exerciseId && set.completed);
  const latestSet = [...relevantSets].sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
  const bestE1Rm = Math.max(0, ...relevantSets.map((set) => set.e1rm ?? 0));
  const latestE1Rm = latestSet?.e1rm;

  const chartData = useMemo(() => prescriptions.map((item) => {
    const weekSets = relevantSets.filter((set) => set.weekNumber === item.weekNumber);
    const bestLoad = Math.max(0, ...weekSets.map((set) => set.actualLoad));
    const bestWeekE1Rm = Math.max(0, ...weekSets.map((set) => set.e1rm ?? 0));
    return {
      week: `W${item.weekNumber}`,
      exact: Number(item.exactPrescribedLoad.toFixed(2)),
      prescribed: item.roundedPrescribedLoad,
      actual: bestLoad || undefined,
      e1rm: bestWeekE1Rm || undefined,
    };
  }), [prescriptions, relevantSets]);

  const currentWorkingMax = prescriptions[0]?.updatedWorkingMax ?? 0;
  const theoretical = profile?.oneRm ?? Math.max(profile?.fiveRm ?? 0, profile?.threeRm ?? 0, profile?.twoRm ?? 0);
  const difference = latestE1Rm ? latestE1Rm - theoretical : undefined;

  return (
    <div className="page-stack">
      <section className="page-header"><span className="eyebrow">Strength analytics</span><h2>Progress</h2><p>Theoretical values are projections. Logged performance remains the observed source of truth.</p></section>
      <section className="card"><label><span>Exercise</span><select value={profile?.exerciseId ?? ''} onChange={(event) => setSelectedExerciseId(event.target.value)}>{programme.selectedExerciseIds.map((id) => <option key={id} value={id}>{state.exercises.find((item) => item.id === id)?.name}</option>)}</select></label></section>
      <section className="metric-grid">
        <article className="card metric-card"><span>5RM</span><strong>{profile?.fiveRm ?? '—'} kg</strong></article><article className="card metric-card"><span>3RM</span><strong>{profile?.threeRm ?? '—'} kg</strong></article><article className="card metric-card"><span>2RM</span><strong>{profile?.twoRm ?? '—'} kg</strong></article><article className="card metric-card"><span>1RM</span><strong>{profile?.oneRm ? `${profile.oneRm} kg` : 'Not entered'}</strong></article>
        <article className="card metric-card"><span>Current WM</span><strong>{currentWorkingMax.toFixed(1)} kg</strong></article><article className="card metric-card"><span>Latest load</span><strong>{latestSet ? `${latestSet.actualLoad} kg` : '—'}</strong></article><article className="card metric-card"><span>Latest E1RM</span><strong>{latestE1Rm ? `${latestE1Rm.toFixed(1)} kg` : '—'}</strong></article><article className="card metric-card"><span>Best E1RM</span><strong>{bestE1Rm ? `${bestE1Rm.toFixed(1)} kg` : '—'}</strong></article>
      </section>
      <section className="card"><span className="eyebrow">Observed vs theoretical</span><h3>{exercise?.name}</h3><p className="muted">{difference === undefined ? 'Log a qualifying set of 1–12 repetitions to calculate this comparison.' : `${difference >= 0 ? '+' : ''}${difference.toFixed(1)} kg versus the current theoretical reference.`}</p></section>
      <section className="card chart-card"><ResponsiveContainer width="100%" height={340}><LineChart data={chartData} margin={{ top: 12, right: 10, left: -18, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" opacity={0.2} /><XAxis dataKey="week" /><YAxis unit=" kg" /><Tooltip /><Legend /><Line type="monotone" dataKey="exact" name="Exact prescription" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="prescribed" name="Rounded prescription" strokeWidth={3} /><Line type="monotone" dataKey="actual" name="Completed load" strokeWidth={3} connectNulls /><Line type="monotone" dataKey="e1rm" name="Observed E1RM" strokeWidth={3} connectNulls /></LineChart></ResponsiveContainer></section>
    </div>
  );
}
