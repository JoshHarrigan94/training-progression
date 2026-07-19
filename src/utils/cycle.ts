import type {
  TrainingCycle,
  TrainingPhase,
  TrainingWeek,
} from '../types';

import { createId } from './id';

interface WeekDefinition {
  phase: TrainingPhase;
  percentage: 75 | 85 | 95 | null;
  isDeload: boolean;
}

const twelveWeekStructure: WeekDefinition[] = [
  {
    phase: '5-rep',
    percentage: 75,
    isDeload: false,
  },
  {
    phase: '5-rep',
    percentage: 85,
    isDeload: false,
  },
  {
    phase: '5-rep',
    percentage: 95,
    isDeload: false,
  },
  {
    phase: 'deload',
    percentage: null,
    isDeload: true,
  },
  {
    phase: '3-rep',
    percentage: 75,
    isDeload: false,
  },
  {
    phase: '3-rep',
    percentage: 85,
    isDeload: false,
  },
  {
    phase: '3-rep',
    percentage: 95,
    isDeload: false,
  },
  {
    phase: 'deload',
    percentage: null,
    isDeload: true,
  },
  {
    phase: '2-rep',
    percentage: 75,
    isDeload: false,
  },
  {
    phase: '2-rep',
    percentage: 85,
    isDeload: false,
  },
  {
    phase: '2-rep',
    percentage: 95,
    isDeload: false,
  },
  {
    phase: 'deload',
    percentage: null,
    isDeload: true,
  },
];

export function createTwelveWeekCycle(
  programmeName: string,
  startDate: string,
): TrainingCycle {
  const weeks: TrainingWeek[] =
    twelveWeekStructure.map(
      (definition, index) => ({
        id: createId('week'),
        weekNumber: index + 1,
        monthNumber: Math.ceil(
          (index + 1) / 4,
        ) as 1 | 2 | 3,
        phase: definition.phase,
        percentage: definition.percentage,
        isDeload: definition.isDeload,
      }),
    );

  return {
    id: createId('cycle'),
    name: `${programmeName} — 12 Week Cycle`,
    startDate,
    weeks,
  };
}

export function getCurrentWeek(
  startDate: string,
  referenceDate = new Date(),
): number {
  const cycleStart = parseLocalDate(startDate);
  const currentDate = stripTime(referenceDate);

  const elapsedMilliseconds =
    currentDate.getTime() - cycleStart.getTime();

  const elapsedDays = Math.floor(
    elapsedMilliseconds /
      (1000 * 60 * 60 * 24),
  );

  if (elapsedDays < 0) {
    return 1;
  }

  return Math.min(
    12,
    Math.floor(elapsedDays / 7) + 1,
  );
}

export function getCurrentWeekNumber(
  startDate: string,
  referenceDate = new Date(),
): number {
  return getCurrentWeek(
    startDate,
    referenceDate,
  );
}

export function getWeekStartDate(
  startDate: string,
  weekNumber: number,
): Date {
  const date = parseLocalDate(startDate);

  date.setDate(
    date.getDate() +
      (clampWeekNumber(weekNumber) - 1) * 7,
  );

  return date;
}

export function getWeekEndDate(
  startDate: string,
  weekNumber: number,
): Date {
  const date = getWeekStartDate(
    startDate,
    weekNumber,
  );

  date.setDate(date.getDate() + 6);

  return date;
}

export function getTrainingWeek(
  cycle: TrainingCycle,
  weekNumber: number,
): TrainingWeek | undefined {
  return cycle.weeks.find(
    (week) =>
      week.weekNumber ===
      clampWeekNumber(weekNumber),
  );
}

export function formatCycleDate(
  date: Date,
): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function parseLocalDate(
  value: string,
): Date {
  const [year, month, day] = value
    .split('-')
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return stripTime(new Date());
  }

  return new Date(
    year,
    month - 1,
    day,
  );
}

function stripTime(
  date: Date,
): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
}

function clampWeekNumber(
  weekNumber: number,
): number {
  if (!Number.isFinite(weekNumber)) {
    return 1;
  }

  return Math.min(
    12,
    Math.max(
      1,
      Math.trunc(weekNumber),
    ),
  );
}
