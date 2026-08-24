# 2. Client state management and routing

Date: 2026-08-24

## Status

Proposed

## Context

The client is a Create React App (React 17). It already depends on
`redux`, `redux-thunk`, and `redux-persist`, and has a scaffolded store,
reducers, actions, and thunks. However, in the current code:

- `src/index.js` renders `<App/>` with **no `<Provider>`**, so the store is
  never mounted.
- `src/store/index.js` imports the root reducer from `../reducer` (singular)
  while the reducers live in `src/reducers/` — the path does not resolve.
- The API base URL is a placeholder string (`'API BASE URL'`).
- There is no router; `App.js` renders the login screen directly, even though
  `src/routes/` and `src/pages/` scaffolding exists.

As the app grows past the login screen (dashboards, campaigns, profiles), it
needs real navigation and a working store.

## Decision

- **Keep** Redux with `redux-thunk` and `redux-persist` as the state stack
  (already in place); do not introduce a second state library.
- **Mount** the store: wrap the app in `<Provider>` and fix the reducer import
  path and the thunk API base URL (from an environment variable).
- **Adopt `react-router`** for client-side routing, driven by the constants in
  `src/routes/index.js`.

Migrating to Redux Toolkit is deferred to a later ADR if boilerplate becomes a
burden.

## Consequences

- The scaffolded Redux code becomes functional rather than dead.
- Routing unblocks multi-screen features (Phase 0+ of the feature plan).
- A small, contained refactor of `index.js`, `store/index.js`, and `App.js` is
  required before new screens are added.
