# Ndorsify App

The web client for **Ndorsify** — a community and management platform connecting
brands with creators/influencers for endorsements, campaigns, and marketing
engagement. This is the React frontend; the backend lives in
`ndorsify-backend-microservices`.

> Status: early-stage. The app currently ships the sign-in / sign-up experience.

## Prerequisites

- Node.js (tested on Node 24) and npm.

## Getting started

```bash
npm install
npm start
```

The dev server runs on http://localhost:3000.

> On modern Node, `react-scripts` 4 may fail with an OpenSSL error. If so, run
> `NODE_OPTIONS=--openssl-legacy-provider npm start`.

## Common commands

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `npm start`      | Run the dev server                                |
| `npm run build`  | Production build to `build/`                      |
| `npm test`       | Jest in watch mode (`CI=true npm test` runs once) |
| `npm run format` | Auto-format with Prettier                         |
| `npm run check`  | Check formatting                                  |

## Project structure

```
src/
├── components/    # UI: common/ primitives + feature components (SignIn, SignUp)
├── pages/         # Screen-level components (login/)
├── routes/        # Route & API path constants
├── store/         # Redux store (thunk + persist)
├── reducers/      # Reducers (combineReducers)
├── actions/       # Action creators & types
├── redux-thunk/   # Async thunks
└── assets/        # Images & logos
```

## Documentation

- [`AGENTS.md`](AGENTS.md) — architecture map (for AI agents and new devs).
- [`CLAUDE.md`](CLAUDE.md) — command reference for coding agents.
- [`docs/`](docs/) — knowledge base: [ADRs](docs/adr/), [plans](docs/plans/),
  [playbooks](docs/playbooks/).

New to the codebase? Start with `AGENTS.md` — it includes a list of known issues
in the current scaffolding worth fixing before building new screens.
