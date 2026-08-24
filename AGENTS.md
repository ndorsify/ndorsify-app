# AGENTS.md — Ndorsify App

High-level architecture map for LLM agents working in this repo. For commands see
[`CLAUDE.md`](CLAUDE.md); for the "why" behind decisions see [`docs/adr/`](docs/adr/).

## What this is

The Ndorsify web client — a React (Create React App, React 17) frontend for a
two-sided platform connecting **brands** with **creators/influencers** for
endorsements and campaigns. Currently early-stage: the app ships the sign-in /
sign-up screens; everything past auth is greenfield.

## Stack

- React 17 via Create React App (`react-scripts` 4).
- Redux + `redux-thunk` + `redux-persist` (localStorage) for state.
- Prettier for formatting. No router in use yet.

## Architecture

- **Entry:** `src/index.js` → `src/App.js`, which currently renders only
  `pages/login/login.js` (a class component toggling `SignIn` / `SignUp`).
- **State (scaffolded):** `src/store/` (redux + thunk + persist), `src/reducers/`
  (`combineReducers` → `userData`), `src/actions/`, `src/redux-thunk/`. Thunks
  receive the API base URL via `thunk.withExtraArgument(endpoint)`.
- **UI:** shared primitives in `src/components/common/` (`button/`,
  `inputTextbox/`); feature components in `src/components/SignIn`, `SignUp`.
- **Routing constants:** centralized in `src/routes/index.js` (`API_ROUTES`,
  `PAGE_ROUTES`) — a router is not yet wired to them.

## Known issues (verify before relying on these paths)

Real inconsistencies in the current code — fix, don't copy. See
[ADR 0002](docs/adr/0002-client-state-and-routing.md):

- Redux is **not mounted** — `src/index.js` renders `<App/>` with no `<Provider>`.
- `src/store/index.js` imports the reducer from `../reducer` (singular); the
  reducers live in `src/reducers/` — path does not resolve.
- `store/index.js` sets `endpoint = 'API BASE URL'` (placeholder, not a real URL).
- `src/reducers/userStates.js` imports from a missing `./actionTypes`.
- `src/redux-thunk/userLogin.js` is empty — login is not wired end to end.

## Conventions

- Prettier: no semicolons, single quotes (`.prettierrc.json`). Run `npm run format`
  before committing.
- Add navigation via `react-router` driven by `src/routes/index.js` constants.

## Knowledge base

- [`docs/adr/`](docs/adr/) — architecture decisions.
- [`docs/plans/`](docs/plans/) — PRDs & tech specs (future work).
- [`docs/playbooks/`](docs/playbooks/) — operational runbooks.
