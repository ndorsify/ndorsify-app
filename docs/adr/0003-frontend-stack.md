# 3. Frontend stack: Redux Toolkit + RTK Query + React Router

Date: 2026-08-27

## Status

Proposed — amends [ADR 0002](0002-client-state-and-routing.md) (which deferred
Redux Toolkit).

## Context

The backend is now five services with real APIs (auth with JWT access/refresh,
profiles, messaging, discovery). The client, however, is still a static
login/signup mockup: Redux is scaffolded but never mounted, there is no router,
no HTTP layer, and no token handling.

ADR 0002 proposed keeping raw Redux + thunks and deferring Redux Toolkit. That
made sense for a one-screen app; it does not for a multi-service client that
needs data fetching, caching, and a JWT access/refresh lifecycle across five
APIs. Hand-writing that with raw thunks is a large amount of boilerplate and a
common source of bugs.

## Decision

- **Data + state: Redux Toolkit + RTK Query.** RTK Query owns server data
  (fetching, caching, invalidation) and the auth `baseQuery` (attach access
  token, refresh on 401). Redux Toolkit slices own the little client-only state
  (auth session, UI). This replaces raw `redux` + hand-written thunks.
- **Keep `redux-persist`** for a minimal persisted slice: the refresh token and
  the current user/role. The access token is kept in memory.
- **Routing: `react-router-dom` v6**, driven by the constants in `src/routes/`.
- **HTTP: RTK Query's `fetchBaseQuery`** — no separate axios needed.
- **Stay on CRA / React 17 for now.** A Vite/Next migration is out of scope;
  revisit separately.
- **TypeScript: recommended, incremental** (CRA supports `.ts`/`.tsx`
  alongside `.js`). Not required to start.

## Consequences

- The dead Redux scaffold is replaced with a working store; ADR 0002's bugs
  (no `<Provider>`, wrong reducer import, placeholder API URL, empty login
  thunk) are resolved as part of adopting this.
- One RTK Query "api" per service (own `baseUrl` from env) until an API gateway
  collapses them — see [ui-foundation](../plans/technical-specifications/ui-foundation.md).
- New dependencies: `@reduxjs/toolkit`, `react-redux` (already transitively
  present), `react-router-dom`. `redux-thunk` is dropped (RTK bundles thunk).
- Requires **CORS on every backend service** (a browser SPA calling five
  origins) — tracked as a backend requirement in the platform spec.
