# Training Cycle

A local-first React application for a repeating 12-week strength, chipper and EMOM training system.

## Install

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

1. Create a GitHub repository named `training-cycle-app`.
2. Push this project to the repository.
3. Run:

```bash
npm run deploy
```

The Vite base path is configured for `/training-cycle-app/` when Vite runs in `github` mode.

If your repository has a different name, update the `base` value in `vite.config.ts`.

## Data

All data is stored in browser `localStorage`. Use Settings to export a JSON backup before clearing browser data or changing devices.
