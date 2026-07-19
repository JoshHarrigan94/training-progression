import type {
  Equipment,
  Exercise,
  ExerciseCategory,
  ExerciseType,
  MovementPattern,
  MuscleGroup,
} from '../types';

const createdAt = '2026-01-01T00:00:00.000Z';

interface ExerciseSeed {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  movementPattern: MovementPattern;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  exerciseType: ExerciseType;
  unilateral?: boolean;
  loadable?: boolean;
  bodyweight?: boolean;
  strengthEligible?: boolean;
  chipperEligible?: boolean;
  emomEligible?: boolean;
  notes?: string;
}

function createExercise(seed: ExerciseSeed): Exercise {
  return {
    id: seed.id,
    name: seed.name,
    description: seed.description,
    category: seed.category,
    movementPattern: seed.movementPattern,
    primaryMuscles: seed.primaryMuscles,
    secondaryMuscles: seed.secondaryMuscles ?? [],
    equipment: seed.equipment,
    exerciseType: seed.exerciseType,
    unilateral: seed.unilateral ?? false,
    loadable: seed.loadable ?? true,
    bodyweight: seed.bodyweight ?? false,
    strengthEligible: seed.strengthEligible ?? false,
    chipperEligible: seed.chipperEligible ?? true,
    emomEligible: seed.emomEligible ?? true,
    notes: seed.notes ?? '',
    archived: false,
    isCustom: false,
    createdAt,
  };
}

export const defaultExercises: Exercise[] = [
  createExercise({
    id: 'exercise_default_1',
    name: 'Front Squat',
    description:
      'Barbell squat held in the front rack, emphasising an upright torso, quadriceps and trunk strength.',
    category: 'strength',
    movementPattern: 'squat',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes', 'core', 'upper-back'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_2',
    name: 'Back Squat',
    description:
      'Traditional barbell squat performed with the bar supported across the upper back.',
    category: 'strength',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_3',
    name: 'High-Bar Back Squat',
    description:
      'Back squat performed with a high bar position to encourage greater knee flexion and an upright torso.',
    category: 'strength',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_4',
    name: 'Low-Bar Back Squat',
    description:
      'Back squat performed with a lower bar position and increased hip contribution.',
    category: 'strength',
    movementPattern: 'squat',
    primaryMuscles: ['glutes', 'quads'],
    secondaryMuscles: ['hamstrings', 'core', 'upper-back'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_5',
    name: 'Box Squat',
    description:
      'Barbell squat performed to a box to standardise depth and reinforce posterior-chain loading.',
    category: 'strength',
    movementPattern: 'squat',
    primaryMuscles: ['glutes', 'quads'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_6',
    name: 'Zercher Squat',
    description:
      'Squat performed with the bar held in the crooks of the elbows.',
    category: 'strength',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['core', 'upper-back', 'biceps'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_7',
    name: 'Goblet Squat',
    description:
      'Squat performed while holding a dumbbell or kettlebell in front of the chest.',
    category: 'accessory',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['core'],
    equipment: 'kettlebell',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_8',
    name: 'Bulgarian Split Squat',
    description:
      'Rear-foot-elevated split squat used to develop unilateral leg strength and stability.',
    category: 'accessory',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
    unilateral: true,
  }),

  createExercise({
    id: 'exercise_default_9',
    name: 'Reverse Lunge',
    description:
      'Unilateral squat pattern performed by stepping backward into a lunge.',
    category: 'accessory',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
    unilateral: true,
  }),

  createExercise({
    id: 'exercise_default_10',
    name: 'Walking Lunge',
    description:
      'Alternating forward lunges performed continuously across distance.',
    category: 'conditioning',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
    unilateral: true,
  }),

  createExercise({
    id: 'exercise_default_11',
    name: 'Step-Up',
    description:
      'Unilateral leg exercise performed by stepping onto an elevated platform.',
    category: 'accessory',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
    unilateral: true,
  }),

  createExercise({
    id: 'exercise_default_12',
    name: 'Pistol Squat',
    description:
      'Single-leg bodyweight squat requiring strength, balance and mobility.',
    category: 'skill',
    movementPattern: 'squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'skill',
    unilateral: true,
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_13',
    name: 'Conventional Deadlift',
    description:
      'Barbell hinge performed from the floor with a conventional stance.',
    category: 'strength',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['upper-back', 'forearms', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
    emomEligible: false,
  }),

  createExercise({
    id: 'exercise_default_14',
    name: 'Sumo Deadlift',
    description:
      'Wide-stance deadlift with the hands positioned inside the knees.',
    category: 'strength',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings', 'quads'],
    secondaryMuscles: ['upper-back', 'forearms', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
    emomEligible: false,
  }),

  createExercise({
    id: 'exercise_default_15',
    name: 'Romanian Deadlift',
    description:
      'Controlled barbell hinge initiated from standing to load the hamstrings and glutes.',
    category: 'strength',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['upper-back', 'forearms', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_16',
    name: 'Stiff-Leg Deadlift',
    description:
      'Barbell hinge performed with limited knee flexion to emphasise the hamstrings.',
    category: 'accessory',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['glutes', 'upper-back', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_17',
    name: 'Trap-Bar Deadlift',
    description:
      'Deadlift performed inside a hex bar with a more upright torso.',
    category: 'strength',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'quads'],
    secondaryMuscles: ['hamstrings', 'upper-back', 'forearms'],
    equipment: 'other',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_18',
    name: 'Single-Leg Romanian Deadlift',
    description:
      'Unilateral hip hinge used to develop hamstring strength and balance.',
    category: 'accessory',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['core', 'calves'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
    unilateral: true,
  }),

  createExercise({
    id: 'exercise_default_19',
    name: 'Barbell Hip Thrust',
    description:
      'Loaded hip extension performed with the upper back supported on a bench.',
    category: 'strength',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_20',
    name: 'Glute Bridge',
    description:
      'Hip extension performed from the floor to target the glutes.',
    category: 'bodyweight',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_21',
    name: 'Kettlebell Swing',
    description:
      'Ballistic hip hinge used to develop power and repeated-work capacity.',
    category: 'conditioning',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['core', 'forearms', 'upper-back'],
    equipment: 'kettlebell',
    exerciseType: 'power',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_22',
    name: 'Reverse Hyperextension',
    description:
      'Dynamic hip extension performed on a reverse hyper machine or supported bench.',
    category: 'accessory',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['core'],
    equipment: 'machine',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_23',
    name: 'Good Morning',
    description:
      'Barbell hip hinge performed with the load supported across the upper back.',
    category: 'accessory',
    movementPattern: 'hinge',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['core', 'upper-back'],
    equipment: 'barbell',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_24',
    name: 'Bench Press',
    description:
      'Flat barbell press used to develop maximal horizontal pressing strength.',
    category: 'strength',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'delts'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_25',
    name: 'Close-Grip Bench Press',
    description:
      'Bench press performed with a narrower grip to increase triceps contribution.',
    category: 'strength',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['delts'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_26',
    name: 'Incline Bench Press',
    description:
      'Barbell press performed on an incline bench.',
    category: 'strength',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest', 'delts'],
    secondaryMuscles: ['triceps'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_27',
    name: 'Dumbbell Bench Press',
    description:
      'Horizontal press performed with dumbbells to allow independent arm movement.',
    category: 'accessory',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'delts'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_28',
    name: 'Incline Dumbbell Press',
    description:
      'Incline press performed with dumbbells to target the upper chest and shoulders.',
    category: 'accessory',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest', 'delts'],
    secondaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_29',
    name: 'Push-Up',
    description:
      'Bodyweight horizontal press performed from a plank position.',
    category: 'bodyweight',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'delts', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_30',
    name: 'Ring Push-Up',
    description:
      'Push-up performed on gymnastics rings to increase stability demands and range of motion.',
    category: 'bodyweight',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'delts', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_31',
    name: 'Cable Chest Fly',
    description:
      'Cable isolation exercise performed by bringing the arms together across the chest.',
    category: 'accessory',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['delts'],
    equipment: 'cable',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_32',
    name: 'Ring Fly',
    description:
      'Bodyweight chest fly performed on rings with high stability and control demands.',
    category: 'bodyweight',
    movementPattern: 'horizontal-push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['delts', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'skill',
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_33',
    name: 'Overhead Press',
    description:
      'Standing strict barbell press used to develop vertical pressing strength.',
    category: 'strength',
    movementPattern: 'vertical-push',
    primaryMuscles: ['delts'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_34',
    name: 'Push Press',
    description:
      'Overhead press assisted by a rapid leg drive.',
    category: 'strength',
    movementPattern: 'vertical-push',
    primaryMuscles: ['delts', 'triceps'],
    secondaryMuscles: ['quads', 'glutes', 'core'],
    equipment: 'barbell',
    exerciseType: 'power',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_35',
    name: 'Dumbbell Shoulder Press',
    description:
      'Vertical press performed with dumbbells from a seated or standing position.',
    category: 'accessory',
    movementPattern: 'vertical-push',
    primaryMuscles: ['delts'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_36',
    name: 'Single-Arm Kettlebell Press',
    description:
      'Unilateral overhead press performed with a kettlebell.',
    category: 'accessory',
    movementPattern: 'vertical-push',
    primaryMuscles: ['delts'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'kettlebell',
    exerciseType: 'compound',
    unilateral: true,
  }),

  createExercise({
    id: 'exercise_default_37',
    name: 'Weighted Dip',
    description:
      'Parallel-bar dip performed with additional external load.',
    category: 'strength',
    movementPattern: 'vertical-push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['delts'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    bodyweight: true,
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_38',
    name: 'Bodyweight Dip',
    description:
      'Parallel-bar dip performed using bodyweight only.',
    category: 'bodyweight',
    movementPattern: 'vertical-push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['delts'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_39',
    name: 'Pike Push-Up',
    description:
      'Bodyweight vertical press performed with the hips elevated.',
    category: 'bodyweight',
    movementPattern: 'vertical-push',
    primaryMuscles: ['delts'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_40',
    name: 'Handstand Push-Up',
    description:
      'Inverted bodyweight press requiring overhead strength, balance and control.',
    category: 'skill',
    movementPattern: 'vertical-push',
    primaryMuscles: ['delts', 'triceps'],
    secondaryMuscles: ['core', 'upper-back'],
    equipment: 'bodyweight',
    exerciseType: 'skill',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_41',
    name: 'Barbell Row',
    description:
      'Horizontal barbell pull performed from a hinged position.',
    category: 'strength',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['upper-back', 'lats'],
    secondaryMuscles: ['biceps', 'forearms', 'core'],
    equipment: 'barbell',
    exerciseType: 'compound',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_42',
    name: 'Pendlay Row',
    description:
      'Barbell row performed explosively from a dead stop on the floor.',
    category: 'strength',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['upper-back', 'lats'],
    secondaryMuscles: ['biceps', 'forearms', 'core'],
    equipment: 'barbell',
    exerciseType: 'power',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_43',
    name: 'Single-Arm Dumbbell Row',
    description:
      'Unilateral horizontal pull performed with one dumbbell.',
    category: 'accessory',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['lats', 'upper-back'],
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
    unilateral: true,
  }),

  createExercise({
    id: 'exercise_default_44',
    name: 'Chest-Supported Row',
    description:
      'Horizontal row performed with the torso supported to reduce lower-back fatigue.',
    category: 'accessory',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['upper-back', 'lats'],
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'dumbbell',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_45',
    name: 'Seated Cable Row',
    description:
      'Horizontal cable pull performed from a seated position.',
    category: 'accessory',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['upper-back', 'lats'],
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'cable',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_46',
    name: 'Inverted Row',
    description:
      'Bodyweight horizontal pull performed beneath a fixed bar or rings.',
    category: 'bodyweight',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['upper-back', 'lats'],
    secondaryMuscles: ['biceps', 'forearms', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_47',
    name: 'Face Pull',
    description:
      'Cable pull toward the face used to train the upper back and rear shoulders.',
    category: 'accessory',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['upper-back', 'delts'],
    secondaryMuscles: ['biceps'],
    equipment: 'cable',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_48',
    name: 'Band Pull-Apart',
    description:
      'Band exercise used to develop upper-back endurance and shoulder control.',
    category: 'accessory',
    movementPattern: 'horizontal-pull',
    primaryMuscles: ['upper-back', 'delts'],
    equipment: 'band',
    exerciseType: 'isolation',
    loadable: false,
  }),

  createExercise({
    id: 'exercise_default_49',
    name: 'Weighted Chin-Up',
    description:
      'Supinated vertical pull performed with additional external load.',
    category: 'strength',
    movementPattern: 'vertical-pull',
    primaryMuscles: ['lats', 'biceps'],
    secondaryMuscles: ['forearms', 'upper-back'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    bodyweight: true,
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_50',
    name: 'Weighted Pull-Up',
    description:
      'Pronated vertical pull performed with additional external load.',
    category: 'strength',
    movementPattern: 'vertical-pull',
    primaryMuscles: ['lats', 'upper-back'],
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    bodyweight: true,
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_51',
    name: 'Chin-Up',
    description:
      'Supinated bodyweight vertical pull.',
    category: 'bodyweight',
    movementPattern: 'vertical-pull',
    primaryMuscles: ['lats', 'biceps'],
    secondaryMuscles: ['forearms', 'upper-back'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_52',
    name: 'Pull-Up',
    description:
      'Pronated bodyweight vertical pull.',
    category: 'bodyweight',
    movementPattern: 'vertical-pull',
    primaryMuscles: ['lats', 'upper-back'],
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_53',
    name: 'Neutral-Grip Pull-Up',
    description:
      'Bodyweight vertical pull performed with the palms facing one another.',
    category: 'bodyweight',
    movementPattern: 'vertical-pull',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'forearms', 'upper-back'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_54',
    name: 'Lat Pulldown',
    description:
      'Machine or cable vertical pull performed toward the upper chest.',
    category: 'accessory',
    movementPattern: 'vertical-pull',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'upper-back'],
    equipment: 'cable',
    exerciseType: 'compound',
  }),

  createExercise({
    id: 'exercise_default_55',
    name: 'Straight-Arm Pulldown',
    description:
      'Cable shoulder-extension exercise used to isolate the lats.',
    category: 'accessory',
    movementPattern: 'vertical-pull',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['core'],
    equipment: 'cable',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_56',
    name: 'Power Clean',
    description:
      'Explosive Olympic-lifting derivative received above a full squat.',
    category: 'skill',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings', 'quads'],
    secondaryMuscles: ['upper-back', 'core', 'forearms'],
    equipment: 'barbell',
    exerciseType: 'power',
    strengthEligible: true,
  }),

  createExercise({
    id: 'exercise_default_57',
    name: 'Hang Power Clean',
    description:
      'Power clean initiated from a hanging position above the floor.',
    category: 'skill',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings', 'quads'],
    secondaryMuscles: ['upper-back', 'core', 'forearms'],
    equipment: 'barbell',
    exerciseType: 'power',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_58',
    name: 'Clean Pull',
    description:
      'Explosive barbell pull using the first and second pulls of the clean.',
    category: 'skill',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings', 'quads'],
    secondaryMuscles: ['upper-back', 'forearms', 'core'],
    equipment: 'barbell',
    exerciseType: 'power',
  }),

  createExercise({
    id: 'exercise_default_59',
    name: 'Power Snatch',
    description:
      'Explosive Olympic-lifting derivative received overhead above a full squat.',
    category: 'skill',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings', 'quads'],
    secondaryMuscles: ['delts', 'upper-back', 'core'],
    equipment: 'barbell',
    exerciseType: 'power',
  }),

  createExercise({
    id: 'exercise_default_60',
    name: 'Hang Power Snatch',
    description:
      'Power snatch initiated from a hanging position.',
    category: 'skill',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings', 'quads'],
    secondaryMuscles: ['delts', 'upper-back', 'core'],
    equipment: 'barbell',
    exerciseType: 'power',
  }),

  createExercise({
    id: 'exercise_default_61',
    name: 'High Pull',
    description:
      'Explosive pull that continues vertically after rapid hip and knee extension.',
    category: 'skill',
    movementPattern: 'hinge',
    primaryMuscles: ['glutes', 'hamstrings', 'upper-back'],
    secondaryMuscles: ['quads', 'delts', 'forearms'],
    equipment: 'barbell',
    exerciseType: 'power',
  }),

  createExercise({
    id: 'exercise_default_62',
    name: 'Broad Jump',
    description:
      'Standing horizontal jump used to develop lower-body power.',
    category: 'skill',
    movementPattern: 'jump',
    primaryMuscles: ['glutes', 'quads'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'power',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_63',
    name: 'Box Jump',
    description:
      'Vertical jump onto an elevated platform.',
    category: 'skill',
    movementPattern: 'jump',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: 'other',
    exerciseType: 'power',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_64',
    name: 'Countermovement Jump',
    description:
      'Maximal vertical jump using a rapid countermovement.',
    category: 'skill',
    movementPattern: 'jump',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    equipment: 'bodyweight',
    exerciseType: 'power',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_65',
    name: 'Pogo Jump',
    description:
      'Fast repeated ankle-dominant jumps used to train stiffness and elastic reactivity.',
    category: 'skill',
    movementPattern: 'jump',
    primaryMuscles: ['calves'],
    secondaryMuscles: ['quads', 'hamstrings'],
    equipment: 'bodyweight',
    exerciseType: 'power',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_66',
    name: 'Jump Squat',
    description:
      'Explosive squat jump performed with bodyweight or light external load.',
    category: 'conditioning',
    movementPattern: 'jump',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'power',
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_67',
    name: 'Split Jump',
    description:
      'Alternating explosive lunge jump used for unilateral power and conditioning.',
    category: 'conditioning',
    movementPattern: 'jump',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'power',
    unilateral: true,
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_68',
    name: 'Farmer Carry',
    description:
      'Loaded carry performed with weights held at the sides.',
    category: 'conditioning',
    movementPattern: 'carry',
    primaryMuscles: ['forearms', 'core'],
    secondaryMuscles: ['upper-back', 'glutes', 'calves'],
    equipment: 'dumbbell',
    exerciseType: 'conditioning',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_69',
    name: 'Suitcase Carry',
    description:
      'Single-sided loaded carry that challenges grip and lateral trunk stability.',
    category: 'conditioning',
    movementPattern: 'carry',
    primaryMuscles: ['core', 'forearms'],
    secondaryMuscles: ['upper-back', 'glutes'],
    equipment: 'kettlebell',
    exerciseType: 'conditioning',
    unilateral: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_70',
    name: 'Front-Rack Carry',
    description:
      'Loaded carry performed with one or two weights supported in the front rack.',
    category: 'conditioning',
    movementPattern: 'carry',
    primaryMuscles: ['core', 'upper-back'],
    secondaryMuscles: ['forearms', 'glutes', 'quads'],
    equipment: 'kettlebell',
    exerciseType: 'conditioning',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_71',
    name: 'Overhead Carry',
    description:
      'Loaded carry performed with the weight stabilised overhead.',
    category: 'conditioning',
    movementPattern: 'carry',
    primaryMuscles: ['delts', 'core'],
    secondaryMuscles: ['triceps', 'upper-back', 'forearms'],
    equipment: 'kettlebell',
    exerciseType: 'conditioning',
    unilateral: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_72',
    name: 'Sandbag Bear-Hug Carry',
    description:
      'Loaded carry performed while securing a sandbag against the torso.',
    category: 'conditioning',
    movementPattern: 'carry',
    primaryMuscles: ['core', 'upper-back'],
    secondaryMuscles: ['biceps', 'forearms', 'glutes', 'quads'],
    equipment: 'sandbag',
    exerciseType: 'conditioning',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_73',
    name: 'Sled Push',
    description:
      'Horizontal conditioning exercise performed by driving a weighted sled forward.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['calves', 'core', 'delts'],
    equipment: 'sled',
    exerciseType: 'conditioning',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_74',
    name: 'Sled Drag',
    description:
      'Weighted sled drag performed forward, backward or laterally.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: 'sled',
    exerciseType: 'conditioning',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_75',
    name: 'Burpee',
    description:
      'Full-body conditioning movement combining a floor transition, push-up position and jump.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['quads', 'chest'],
    secondaryMuscles: ['glutes', 'triceps', 'delts', 'core'],
    equipment: 'bodyweight',
    exerciseType: 'conditioning',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_76',
    name: 'Mountain Climber',
    description:
      'Dynamic plank exercise alternating rapid knee drives.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['core'],
    secondaryMuscles: ['quads', 'delts', 'chest'],
    equipment: 'bodyweight',
    exerciseType: 'conditioning',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_77',
    name: 'Battle Rope Waves',
    description:
      'Repeated rope waves used for upper-body conditioning and power endurance.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['delts', 'forearms'],
    secondaryMuscles: ['upper-back', 'core', 'biceps'],
    equipment: 'other',
    exerciseType: 'conditioning',
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_78',
    name: 'Rowing Ergometer',
    description:
      'Whole-body cyclical conditioning performed on a rowing machine.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['quads', 'upper-back'],
    secondaryMuscles: ['glutes', 'hamstrings', 'biceps', 'core'],
    equipment: 'cardio',
    exerciseType: 'conditioning',
    loadable: false,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_79',
    name: 'Assault Bike',
    description:
      'Air-bike conditioning using coordinated upper- and lower-body effort.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['quads', 'delts'],
    secondaryMuscles: ['glutes', 'hamstrings', 'triceps', 'core'],
    equipment: 'cardio',
    exerciseType: 'conditioning',
    loadable: false,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_80',
    name: 'Ski Ergometer',
    description:
      'Cyclical upper-body-dominant conditioning performed on a ski ergometer.',
    category: 'conditioning',
    movementPattern: 'conditioning',
    primaryMuscles: ['lats', 'triceps'],
    secondaryMuscles: ['core', 'delts', 'quads'],
    equipment: 'cardio',
    exerciseType: 'conditioning',
    loadable: false,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_81',
    name: 'Plank',
    description:
      'Static anti-extension trunk exercise performed from the forearms or hands.',
    category: 'bodyweight',
    movementPattern: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['delts', 'glutes'],
    equipment: 'bodyweight',
    exerciseType: 'isolation',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_82',
    name: 'Side Plank',
    description:
      'Static lateral trunk exercise performed while supported on one arm.',
    category: 'bodyweight',
    movementPattern: 'anti-rotation',
    primaryMuscles: ['core'],
    secondaryMuscles: ['delts', 'glutes'],
    equipment: 'bodyweight',
    exerciseType: 'isolation',
    unilateral: true,
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_83',
    name: 'Dead Bug',
    description:
      'Supine trunk-control exercise performed while alternating arm and leg extension.',
    category: 'accessory',
    movementPattern: 'core',
    primaryMuscles: ['core'],
    equipment: 'bodyweight',
    exerciseType: 'skill',
    unilateral: true,
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_84',
    name: 'Bird Dog',
    description:
      'Quadruped trunk-control exercise performed by extending opposite arm and leg.',
    category: 'accessory',
    movementPattern: 'anti-rotation',
    primaryMuscles: ['core'],
    secondaryMuscles: ['glutes', 'delts'],
    equipment: 'bodyweight',
    exerciseType: 'skill',
    unilateral: true,
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_85',
    name: 'Pallof Press',
    description:
      'Cable or band anti-rotation press performed perpendicular to the resistance.',
    category: 'accessory',
    movementPattern: 'anti-rotation',
    primaryMuscles: ['core'],
    secondaryMuscles: ['delts', 'chest'],
    equipment: 'cable',
    exerciseType: 'isolation',
    unilateral: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_86',
    name: 'Hanging Knee Raise',
    description:
      'Core exercise performed by raising the knees while hanging from a bar.',
    category: 'bodyweight',
    movementPattern: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['forearms', 'lats'],
    equipment: 'bodyweight',
    exerciseType: 'compound',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_87',
    name: 'Hanging Leg Raise',
    description:
      'Advanced hanging core exercise performed with straighter legs and greater lever length.',
    category: 'bodyweight',
    movementPattern: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['forearms', 'lats'],
    equipment: 'bodyweight',
    exerciseType: 'skill',
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_88',
    name: 'Ab-Wheel Rollout',
    description:
      'Kneeling or standing anti-extension exercise performed with an ab wheel.',
    category: 'accessory',
    movementPattern: 'core',
    primaryMuscles: ['core'],
    secondaryMuscles: ['lats', 'delts', 'triceps'],
    equipment: 'other',
    exerciseType: 'compound',
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_89',
    name: 'Cable Wood Chop',
    description:
      'Rotational cable exercise moving the hands diagonally across the body.',
    category: 'accessory',
    movementPattern: 'rotation',
    primaryMuscles: ['core'],
    secondaryMuscles: ['delts', 'glutes'],
    equipment: 'cable',
    exerciseType: 'compound',
    unilateral: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_90',
    name: 'Russian Twist',
    description:
      'Seated rotational trunk exercise performed with bodyweight or external load.',
    category: 'conditioning',
    movementPattern: 'rotation',
    primaryMuscles: ['core'],
    equipment: 'bodyweight',
    exerciseType: 'conditioning',
    unilateral: true,
    loadable: true,
    bodyweight: true,
    strengthEligible: false,
  }),

  createExercise({
    id: 'exercise_default_91',
    name: 'Dumbbell Lateral Raise',
    description:
      'Shoulder isolation exercise raising dumbbells laterally to approximately shoulder height.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['delts'],
    equipment: 'dumbbell',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_92',
    name: 'Rear-Delt Fly',
    description:
      'Shoulder isolation exercise targeting the rear deltoids and upper back.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['delts'],
    secondaryMuscles: ['upper-back'],
    equipment: 'dumbbell',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_93',
    name: 'Barbell Curl',
    description:
      'Elbow-flexion isolation exercise performed with a barbell.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: 'barbell',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_94',
    name: 'Hammer Curl',
    description:
      'Neutral-grip dumbbell curl targeting the elbow flexors and forearms.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['biceps', 'forearms'],
    equipment: 'dumbbell',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_95',
    name: 'Cable Triceps Pressdown',
    description:
      'Cable elbow-extension exercise used to isolate the triceps.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['triceps'],
    equipment: 'cable',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_96',
    name: 'Overhead Triceps Extension',
    description:
      'Elbow-extension exercise performed with the arms positioned overhead.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['triceps'],
    equipment: 'dumbbell',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_97',
    name: 'Leg Extension',
    description:
      'Machine knee-extension exercise used to isolate the quadriceps.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['quads'],
    equipment: 'machine',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_98',
    name: 'Leg Curl',
    description:
      'Machine knee-flexion exercise used to isolate the hamstrings.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['hamstrings'],
    equipment: 'machine',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_99',
    name: 'Standing Calf Raise',
    description:
      'Ankle plantar-flexion exercise performed from a standing position.',
    category: 'accessory',
    movementPattern: 'isolation',
    primaryMuscles: ['calves'],
    equipment: 'machine',
    exerciseType: 'isolation',
  }),

  createExercise({
    id: 'exercise_default_100',
    name: 'Couch Stretch',
    description:
      'Hip-flexor and quadriceps mobility drill performed with the rear shin supported against a wall or bench.',
    category: 'mobility',
    movementPattern: 'squat',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes'],
    equipment: 'bodyweight',
    exerciseType: 'mobility',
    unilateral: true,
    loadable: false,
    bodyweight: true,
    strengthEligible: false,
    chipperEligible: false,
    emomEligible: false,
  }),
];
