import type { ReactNode } from 'react';

import { useAppState } from '../state/AppContext';

import type { NavigationPage } from '../types';

const navItems: Array<{
  id: NavigationPage;
  label: string;
}> = [
  {
    id: 'dashboard',
    label: 'Dashboard',
  },
  {
    id: 'programme',
    label: 'Programme',
  },
  {
    id: 'session',
    label: 'Session',
  },
  {
    id: 'progress',
    label: 'Progress',
  },
  {
    id: 'exercise-library',
    label: 'Exercises',
  },
  {
    id: 'settings',
    label: 'Settings',
  },
];

export function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const {
    state,
    setActivePage,
  } = useAppState();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">
            Local training system
          </span>

          <h1>Training Cycle</h1>
        </div>

        <div className="status-pill">
          Saved locally
        </div>
      </header>

      <main className="content">
        {children}
      </main>

      <nav
        className="bottom-nav"
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              state.activePage === item.id
                ? 'active'
                : ''
            }
            onClick={() =>
              setActivePage(item.id)
            }
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
