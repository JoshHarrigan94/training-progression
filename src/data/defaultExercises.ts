import type { Exercise } from '../types';

const createdAt = '2026-01-01T00:00:00.000Z';

export const defaultExercises: Exercise[] = [
  'Front squat',
  'Back squat',
  'Deadlift',
  'Bench press',
  'Overhead press',
  'Weighted dip',
  'Weighted chin-up',
].map((name, index) => ({
  id: `exercise_default_${index + 1}`,
  name,
  category: 'strength',
  isCustom: false,
  createdAt,
}));
