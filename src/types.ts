export type PlateIncrement = 0.5 | 1 | 1.25 | 2.5 | number;
export type ExerciseCategory = 'strength' | 'chipper' | 'emom' | 'general';
export type TrainingPhase = '5-rep' | '3-rep' | '2-rep' | 'deload';
export type ReferenceRmType = '5RM' | '3RM' | '2RM';
export type E1RmFormula = 'epley' | 'brzycki' | 'average';
export type WeightedLoadMode = 'external-only' | 'bodyweight-plus-external';
export type SetStatus = 'planned' | 'completed' | 'modified' | 'skipped';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  isCustom: boolean;
  createdAt: string;
}

export interface StrengthExerciseProfile {
  id: string;
  exerciseId: string;
  fiveRm: number;
  threeRm: number;
  twoRm: number;
  oneRm?: number;
}

export interface DeloadSettings {
  percentage: number;
  targetSets: number;
  guidance: string;
}

export interface StrengthSettings {
  monthlyIncrease: number;
  defaultTargetSets: number;
  deload: DeloadSettings;
  e1rmFormula: E1RmFormula;
  weightedLoadMode: WeightedLoadMode;
  currentBodyweight?: number;
}

export interface StrengthPrescription {
  weekNumber: number;
  monthNumber: 1 | 2 | 3;
  phase: TrainingPhase;
  referenceRmType: ReferenceRmType;
  referenceRmValue: number;
  initialWorkingMax: number;
  updatedWorkingMax: number;
  monthlyMultiplier: number;
  weeklyPercentage: number;
  targetRepetitions: number;
  targetSets: number;
  exactPrescribedLoad: number;
  roundedPrescribedLoad: number;
  isDeload: boolean;
  explanation: string;
}

export interface TrainingWeek {
  id: string;
  weekNumber: number;
  monthNumber: 1 | 2 | 3;
  phase: TrainingPhase;
  percentage: 75 | 85 | 95 | null;
  isDeload: boolean;
}

export interface TrainingCycle {
  id: string;
  name: string;
  startDate: string;
  weeks: TrainingWeek[];
}

export interface Programme {
  id: string;
  name: string;
  startDate: string;
  plateIncrement: PlateIncrement;
  customPlateIncrement?: number;
  selectedExerciseIds: string[];
  strengthProfiles: StrengthExerciseProfile[];
  cycle: TrainingCycle;
  createdAt: string;
  updatedAt: string;
}

export interface StrengthSet {
  id: string;
  exerciseId: string;
  weekNumber?: number;
  setNumber: number;
  prescribedLoad?: number;
  actualLoad: number;
  targetReps?: number;
  actualReps: number;
  rpe?: number;
  rir?: number;
  bodyweight?: number;
  status: SetStatus;
  notes?: string;
  e1rm?: number;
  completed: boolean;
}

export interface ChipperExercise {
  id: string;
  exerciseId: string;
  repetitions: number;
  load?: number;
  order: number;
}

export interface ChipperWorkout {
  id: string;
  name: string;
  exercises: ChipperExercise[];
  targetTimeMinutes?: number;
  notes?: string;
}

export interface EmomStation {
  id: string;
  exerciseId: string;
  repetitions?: number;
  durationSeconds?: number;
  load?: number;
  order: number;
}

export interface EmomWorkout {
  id: string;
  name: string;
  intervalSeconds: number;
  rounds: number;
  stations: EmomStation[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  scheduledDate: string;
  name: string;
  strengthSets: StrengthSet[];
  chipperWorkoutId?: string;
  emomWorkoutId?: string;
  notes?: string;
}

export interface CompletedSession extends WorkoutSession {
  completedAt: string;
  durationMinutes?: number;
  sessionRpe?: number;
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  type: '1RM' | '3RM' | '5RM' | 'volume' | 'time';
  value: number;
  achievedAt: string;
  sessionId?: string;
}

export interface AppState {
  version: number;
  programme: Programme | null;
  exercises: Exercise[];
  plannedSessions: WorkoutSession[];
  completedSessions: CompletedSession[];
  chipperWorkouts: ChipperWorkout[];
  emomWorkouts: EmomWorkout[];
  personalRecords: PersonalRecord[];
  strengthSettings: StrengthSettings;
  activePage: NavigationPage;
}

export type NavigationPage =
  | 'dashboard'
  | 'programme'
  | 'session'
  | 'progress'
  | 'library'
  | 'settings';
