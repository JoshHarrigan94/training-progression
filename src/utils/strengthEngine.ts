import type {
  PlateIncrement,
  ReferenceRmType,
  StrengthExerciseProfile,
  StrengthPrescription,
  StrengthSettings,
  TrainingPhase,
} from '../types';

interface RmValidationResult {
  valid: boolean;
  errors: string[];
}

interface WeekStructure {
  weekNumber: number;
  monthNumber: 1 | 2 | 3;
  phase: TrainingPhase;
  percentage: number;
  targetRepetitions: number;
  isDeload: boolean;
}

const WORKING_MAX_FACTOR = 0.9;

const twelveWeekStructure: WeekStructure[] = [
  {
    weekNumber: 1,
    monthNumber: 1,
    phase: '5-rep',
    percentage: 0.75,
    targetRepetitions: 5,
    isDeload: false,
  },
  {
    weekNumber: 2,
    monthNumber: 1,
    phase: '5-rep',
    percentage: 0.85,
    targetRepetitions: 5,
    isDeload: false,
  },
  {
    weekNumber: 3,
    monthNumber: 1,
    phase: '5-rep',
    percentage: 0.95,
    targetRepetitions: 5,
    isDeload: false,
  },
  {
    weekNumber: 4,
    monthNumber: 1,
    phase: 'deload',
    percentage: 0,
    targetRepetitions: 5,
    isDeload: true,
  },
  {
    weekNumber: 5,
    monthNumber: 2,
    phase: '3-rep',
    percentage: 0.75,
    targetRepetitions: 3,
    isDeload: false,
  },
  {
    weekNumber: 6,
    monthNumber: 2,
    phase: '3-rep',
    percentage: 0.85,
    targetRepetitions: 3,
    isDeload: false,
  },
  {
    weekNumber: 7,
    monthNumber: 2,
    phase: '3-rep',
    percentage: 0.95,
    targetRepetitions: 3,
    isDeload: false,
  },
  {
    weekNumber: 8,
    monthNumber: 2,
    phase: 'deload',
    percentage: 0,
    targetRepetitions: 5,
    isDeload: true,
  },
  {
    weekNumber: 9,
    monthNumber: 3,
    phase: '2-rep',
    percentage: 0.75,
    targetRepetitions: 2,
    isDeload: false,
  },
  {
    weekNumber: 10,
    monthNumber: 3,
    phase: '2-rep',
    percentage: 0.85,
    targetRepetitions: 2,
    isDeload: false,
  },
  {
    weekNumber: 11,
    monthNumber: 3,
    phase: '2-rep',
    percentage: 0.95,
    targetRepetitions: 2,
    isDeload: false,
  },
  {
    weekNumber: 12,
    monthNumber: 3,
    phase: 'deload',
    percentage: 0,
    targetRepetitions: 5,
    isDeload: true,
  },
];

export function validateRmInputs(
  profile: StrengthExerciseProfile,
): RmValidationResult {
  const errors: string[] = [];

  if (!isPositiveNumber(profile.fiveRm)) {
    errors.push('5RM must be greater than zero.');
  }

  if (!isPositiveNumber(profile.threeRm)) {
    errors.push('3RM must be greater than zero.');
  }

  if (!isPositiveNumber(profile.twoRm)) {
    errors.push('2RM must be greater than zero.');
  }

  if (
    profile.oneRm !== undefined &&
    !isPositiveNumber(profile.oneRm)
  ) {
    errors.push(
      'Optional 1RM must be greater than zero.',
    );
  }

  if (
    isPositiveNumber(profile.fiveRm) &&
    isPositiveNumber(profile.threeRm) &&
    profile.threeRm < profile.fiveRm
  ) {
    errors.push(
      '3RM should be equal to or greater than 5RM.',
    );
  }

  if (
    isPositiveNumber(profile.threeRm) &&
    isPositiveNumber(profile.twoRm) &&
    profile.twoRm < profile.threeRm
  ) {
    errors.push(
      '2RM should be equal to or greater than 3RM.',
    );
  }

  if (
    profile.oneRm !== undefined &&
    isPositiveNumber(profile.oneRm) &&
    isPositiveNumber(profile.twoRm) &&
    profile.oneRm < profile.twoRm
  ) {
    errors.push(
      '1RM should be equal to or greater than 2RM.',
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function generateWeeklyPrescription(
  profile: StrengthExerciseProfile,
  weekNumber: number,
  plateIncrement: PlateIncrement,
  settings: StrengthSettings,
): StrengthPrescription {
  const validation = validateRmInputs(profile);

  if (!validation.valid) {
    throw new Error(validation.errors[0]);
  }

  const structure =
    twelveWeekStructure.find(
      (week) => week.weekNumber === weekNumber,
    ) ?? twelveWeekStructure[0];

  const referenceRmType =
    getReferenceRmType(structure.monthNumber);

  const referenceRmValue = getReferenceRmValue(
    profile,
    referenceRmType,
  );

  const initialWorkingMax =
    referenceRmValue * WORKING_MAX_FACTOR;

  const monthlyMultiplier =
    1 +
    settings.monthlyIncrease *
      (structure.monthNumber - 1);

  const updatedWorkingMax =
    initialWorkingMax * monthlyMultiplier;

  const weeklyPercentage = structure.isDeload
    ? settings.deload.percentage
    : structure.percentage;

  const exactPrescribedLoad =
    updatedWorkingMax * weeklyPercentage;

  const roundedPrescribedLoad =
    roundToIncrement(
      exactPrescribedLoad,
      plateIncrement,
    );

  const targetSets = structure.isDeload
    ? settings.deload.targetSets
    : settings.defaultTargetSets;

  return {
    weekNumber: structure.weekNumber,
    monthNumber: structure.monthNumber,
    phase: structure.phase,
    referenceRmType,
    referenceRmValue,
    initialWorkingMax,
    updatedWorkingMax,
    monthlyMultiplier,
    weeklyPercentage,
    targetRepetitions:
      structure.targetRepetitions,
    targetSets,
    exactPrescribedLoad,
    roundedPrescribedLoad,
    isDeload: structure.isDeload,
    explanation: buildExplanation({
      structure,
      referenceRmType,
      referenceRmValue,
      initialWorkingMax,
      updatedWorkingMax,
      weeklyPercentage,
      targetSets,
      settings,
    }),
  };
}

export function generateTwelveWeekPrescriptions(
  profile: StrengthExerciseProfile,
  plateIncrement: PlateIncrement,
  settings: StrengthSettings,
): StrengthPrescription[] {
  return twelveWeekStructure.map((week) =>
    generateWeeklyPrescription(
      profile,
      week.weekNumber,
      plateIncrement,
      settings,
    ),
  );
}

export function roundToIncrement(
  value: number,
  increment: PlateIncrement,
): number {
  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    return 0;
  }

  if (
    !Number.isFinite(increment) ||
    increment <= 0
  ) {
    return roundToTwoDecimals(value);
  }

  const rounded =
    Math.round(value / increment) * increment;

  return roundToTwoDecimals(rounded);
}

function getReferenceRmType(
  monthNumber: 1 | 2 | 3,
): ReferenceRmType {
  switch (monthNumber) {
    case 2:
      return '3RM';

    case 3:
      return '2RM';

    case 1:
    default:
      return '5RM';
  }
}

function getReferenceRmValue(
  profile: StrengthExerciseProfile,
  referenceRmType: ReferenceRmType,
): number {
  switch (referenceRmType) {
    case '3RM':
      return profile.threeRm;

    case '2RM':
      return profile.twoRm;

    case '5RM':
    default:
      return profile.fiveRm;
  }
}

function buildExplanation({
  structure,
  referenceRmType,
  referenceRmValue,
  initialWorkingMax,
  updatedWorkingMax,
  weeklyPercentage,
  targetSets,
  settings,
}: {
  structure: WeekStructure;
  referenceRmType: ReferenceRmType;
  referenceRmValue: number;
  initialWorkingMax: number;
  updatedWorkingMax: number;
  weeklyPercentage: number;
  targetSets: number;
  settings: StrengthSettings;
}): string {
  const percentageLabel = Math.round(
    weeklyPercentage * 100,
  );

  const increaseLabel = Math.round(
    settings.monthlyIncrease *
      (structure.monthNumber - 1) *
      1000,
  ) / 10;

  if (structure.isDeload) {
    return [
      `Deload prescription: ${targetSets} sets of ${structure.targetRepetitions} repetitions.`,
      `Load is ${percentageLabel}% of the month ${structure.monthNumber} working max.`,
      settings.deload.guidance,
    ].join(' ');
  }

  const progressionText =
    structure.monthNumber === 1
      ? 'No monthly increase is applied in month 1.'
      : `The original working max is increased by ${increaseLabel}% for month ${structure.monthNumber}.`;

  return [
    `${referenceRmType} reference: ${formatWeight(referenceRmValue)} kg.`,
    `Working max: 90% = ${formatWeight(initialWorkingMax)} kg.`,
    progressionText,
    `Updated working max: ${formatWeight(updatedWorkingMax)} kg.`,
    `Week ${structure.weekNumber} uses ${percentageLabel}% for ${targetSets} sets of ${structure.targetRepetitions}.`,
  ].join(' ');
}

function formatWeight(value: number): string {
  return roundToTwoDecimals(value).toString();
}

function roundToTwoDecimals(
  value: number,
): number {
  return Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;
}

function isPositiveNumber(
  value: number,
): boolean {
  return (
    Number.isFinite(value) &&
    value > 0
  );
}
