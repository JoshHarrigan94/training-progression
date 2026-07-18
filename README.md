# Training Cycle App

A local-first React and TypeScript application for running a repeating 12-week strength, chipper and EMOM training cycle.

## Strength engine

The strength engine uses separate 5RM, 3RM and 2RM reference values:

- Weeks 1–4: 5RM working max
- Weeks 5–8: 3RM working max with one compounded monthly increase
- Weeks 9–12: 2RM working max with two compounded monthly increases
- Weeks 1/2/3 of each month: 75%, 85% and 95%
- Weeks 4, 8 and 12: configurable deload

Working max is `reference RM × 0.90`. Final training loads are rounded only after the full calculation, using the programme's selected load increment.

Completed strength sets store prescribed load, actual load, repetitions, status, RPE/RIR and historical bodyweight independently. E1RM can use Epley, Brzycki or the average of both. Weighted dips and chin-ups can use external load only or bodyweight plus external load.

## Install

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck
npm test
npm run build
```

## GitHub Pages

The GitHub Pages build assumes the repository is named `training-cycle-app`.

```bash
npm run deploy
```

For a different repository name, edit the GitHub-mode `base` value in `vite.config.ts`.

## Local data

Application state is stored in localStorage under the original v1 storage key. Schema migration upgrades old data to schema version 2 without intentionally deleting valid existing records. Settings includes JSON export, validated import and reset controls.
