import { AppProvider, useAppState } from './state/AppContext';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ProgrammePage } from './pages/ProgrammePage';
import { SessionPage } from './pages/SessionPage';
import { ProgressPage } from './pages/ProgressPage';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { SettingsPage } from './pages/SettingsPage';

function ActivePage() {
  const { state } = useAppState();
  switch (state.activePage) {
    case 'programme': return <ProgrammePage />;
    case 'session': return <SessionPage />;
    case 'progress': return <ProgressPage />;
    case 'library': return <ExerciseLibraryPage />;
    case 'settings': return <SettingsPage />;
    default: return <DashboardPage />;
  }
}

export default function App() {
  return <AppProvider><AppShell><ActivePage /></AppShell></AppProvider>;
}
