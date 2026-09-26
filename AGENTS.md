# AGENTS.md — Ndorsify App

High-level architecture map for LLM agents working in this repo. For commands see
[`CLAUDE.md`](CLAUDE.md); for the "why" behind decisions see [`docs/adr/`](docs/adr/).

## What this is

The Ndorsify web client — a React 19 + Vite frontend for a
two-sided platform connecting **brands** with **creators/influencers** for
endorsements and campaigns. After the **indigo-rebrand redesign** the app ships a
full marketplace shell for both roles: public landing, auth, role-aware
dashboards, discovery, creator profiles, a campaign brief builder, an
offer/negotiation flow, messaging, a creator earnings console, and a
collaboration board. Screens render end-to-end today by falling back to sample
data where a backend endpoint is missing (see below); the services are still
catching up.

## Stack

- React 19, built and served by Vite; Vitest + Testing Library for tests.
- Redux Toolkit + **RTK Query** (one api slice per feature) + `redux-persist`.
- `react-router-dom` for routing. Prettier for formatting.

## Architecture

- **Entry:** `src/index.js` mounts `<Provider>` → `src/App.js`, which defines the
  route table (`<BrowserRouter>` + `<Routes>`) with public routes and a
  `<RequireAuth>`-guarded protected group.
- **Feature-first:** each `src/features/<x>/` owns its screens, its RTK Query api
  slice (`authApi`, `campaignApi`, `discoveryApi`, `collaborationApi`,
  `messagingApi`, `profileApi`, `onboardingApi`) and any local slice. Each api
  targets its own service base URL from `REACT_APP_*` env (no gateway yet).
- **Design system:** theme tokens in `src/index.css`, shared classes in
  `src/styles/ndorsify.css`, React primitives in
  `src/components/common/ds.js` (`Avatar`, `Kpi`, `Meter`, `Toggle`,
  `ChartPlaceholder`, `SampleBanner`), and the role-aware top nav in
  `src/components/common/AppNav.js`.
- **Sample-data fallback:** `src/lib/sampleData.js` supplies representative rows;
  a screen prefers live query data and renders sample rows behind a
  `SampleBanner` when the backend returns nothing or has no endpoint. Full page
  inventory in
  [`docs/plans/technical-specifications/marketplace-ui.md`](docs/plans/technical-specifications/marketplace-ui.md).
- **Routing constants:** centralized in `src/routes/index.js` (`PAGE_ROUTES`,
  `buildPath`) and consumed by `App.js` and `AppNav`.

## Known issues

The legacy inert-scaffold problems (unmounted Redux, broken reducer path,
placeholder endpoint, empty thunks) documented in
[ADR 0002](docs/adr/0002-client-state-and-routing.md) have been resolved by the
RTK Query rebuild. Campaigns, discovery, and messaging are live-data,
verified E2E (see the workspace-root `MVP-ROADMAP.md`); a `SampleBanner`
still marks screens with no backend yet — earnings/escrow, checkout/campaign
funding, dashboard analytics (KPIs/CPM/activity feed), and ratings have no
service at all. Known frontend bugs (role-gate missing on `RequireAuth`,
`AppNav` dropped links to Marketplace/Invitations, a few others) are tracked
in `docs/phases/phase-1-marketplace-core.md` at the workspace root.

## Conventions

- Prettier: no semicolons, single quotes (`.prettierrc.json`). Run `npm run format`
  before committing.
- Add navigation via `react-router` driven by `src/routes/index.js` constants.

## Knowledge base

- [`docs/adr/`](docs/adr/) — architecture decisions.
- [`docs/plans/`](docs/plans/) — PRDs & tech specs (future work).
- [`docs/playbooks/`](docs/playbooks/) — operational runbooks.
