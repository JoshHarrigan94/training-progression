import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { ProgrammePage } from './pages/ProgrammePage';
import { ProgressPage } from './pages/ProgressPage';
import { SessionPage } from './pages/SessionPage';
import { SettingsPage } from './pages/SettingsPage';
import {
  AppProvider,
  useAppState,
} from './state/AppContext';

function ActivePage() {
  const { state } = useAppState();

  switch (state.activePage) {
    case 'programme':
      return <ProgrammePage />;

    case 'session':
      return <SessionPage />;

    case 'progress':
      return <ProgressPage />;

    case 'exercise-library':
      return <ExerciseLibraryPage />;

    case 'settings':
      return <SettingsPage />;

    case 'dashboard':
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <ActivePage />
      </AppShell>
    </AppProvider>
  );
}
