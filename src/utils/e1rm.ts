import type {
  E1RmFormula,
  WeightedLoadMode,
} from '../types';

const MINIMUM_QUALIFYING_REPS = 1;
const MAXIMUM_QUALIFYING_REPS = 12;

export function calculateE1Rm(
  load: number,
  repetitions: number,
  formula: E1RmFormula,
): number | null {
  if (
    !Number.isFinite(load) ||
    load <= 0 ||
    !Number.isFinite(repetitions)
  ) {
    return null;
  }

  const wholeRepetitions = Math.trunc(repetitions);

  if (
    wholeRepetitions < MINIMUM_QUALIFYING_REPS ||
    wholeRepetitions > MAXIMUM_QUALIFYING_REPS
  ) {
    return null;
  }

  if (wholeRepetitions === 1) {
    return roundToTwoDecimals(load);
  }

  const epleyEstimate = calculateEpley(
    load,
    wholeRepetitions,
  );

  const brzyckiEstimate = calculateBrzycki(
    load,
    wholeRepetitions,
  );

  switch (formula) {
    case 'epley':
      return roundToTwoDecimals(epleyEstimate);

    case 'brzycki':
      return roundToTwoDecimals(brzyckiEstimate);

    case 'average':
    default:
      return roundToTwoDecimals(
        (epleyEstimate + brzyckiEstimate) / 2,
      );
  }
}

export function calculateEpley(
  load: number,
  repetitions: number,
): number {
  if (repetitions === 1) {
    return load;
  }

  return load * (1 + repetitions / 30);
}

export function calculateBrzycki(
  load: number,
  repetitions: number,
): number {
  if (repetitions === 1) {
    return load;
  }

  const denominator = 37 - repetitions;

  if (denominator <= 0) {
    return load;
  }

  return load * (36 / denominator);
}

export function resolveCalculationLoad(
  exerciseName: string,
  externalLoad: number,
  bodyweight: number | undefined,
  weightedLoadMode: WeightedLoadMode,
): number {
  const safeExternalLoad =
    Number.isFinite(externalLoad) &&
    externalLoad > 0
      ? externalLoad
      : 0;

  if (
    weightedLoadMode === 'external-only' ||
    !isBodyweightStrengthExercise(exerciseName)
  ) {
    return safeExternalLoad;
  }

  const safeBodyweight =
    bodyweight !== undefined &&
    Number.isFinite(bodyweight) &&
    bodyweight > 0
      ? bodyweight
      : 0;

  return safeBodyweight + safeExternalLoad;
}

export function isBodyweightStrengthExercise(
  exerciseName: string,
): boolean {
  const normalisedName = exerciseName
    .trim()
    .toLowerCase();

  const bodyweightStrengthTerms = [
    'dip',
    'chin-up',
    'chin up',
    'pull-up',
    'pull up',
  ];

  return bodyweightStrengthTerms.some((term) =>
    normalisedName.includes(term),
  );
}

function roundToTwoDecimals(
  value: number,
): number {
  return Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;
}
