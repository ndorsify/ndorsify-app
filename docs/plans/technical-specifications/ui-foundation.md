# UI Foundation

**Status:** Proposed · **Blocks:** every UI screen.

The frontend architecture the feature screens sit on. Per
[ADR 0003](../../adr/0003-frontend-stack.md): React 17 (CRA) · Redux Toolkit +
RTK Query · React Router v6 · redux-persist.

This spec exists because the per-feature specs list screens but not the plumbing
that makes any screen work. Build this first.

---

## 1. Fix the broken scaffold (prerequisite)

The current scaffold is inert. As part of standing up the store:

- Mount `<Provider store={store}>` in `src/index.js` (currently missing).
- Fix `src/store` to import the real root reducer (was `../reducer`, a bad path).
- Replace the placeholder `endpoint = 'API BASE URL'` with real config (§3).
- Remove/replace the empty `redux-thunk/userLogin.js` (RTK Query replaces it).

## 2. Project structure

```
src/
├── app/
│   ├── store.js            # configureStore: RTK Query reducers + slices + persist
│   └── hooks.js            # typed useDispatch/useSelector
├── lib/
│   ├── baseQuery.js        # fetchBaseQuery + reauth wrapper (§4)
│   └── config.js           # service base URLs from env (§3)
├── features/
│   ├── auth/               # authSlice + authApi + Login/Register/Reset screens
│   ├── onboarding/
│   ├── profile/
│   ├── discovery/
│   └── messaging/
├── components/common/      # existing Button, InputBox, + Spinner, ErrorText, Guard
├── routes/                 # route constants + <AppRoutes>
└── App.js                  # RouterProvider / <BrowserRouter>
```

Feature-first: each `features/<x>/` owns its RTK Query api slice, any local slice,
and its screens.

## 3. Configuration & multiple service base URLs

Five services on five ports and **no gateway yet**. Each RTK Query api gets its
own `baseUrl` from env (CRA reads `REACT_APP_*` at build time):

```
REACT_APP_USERS_URL=http://localhost:1000
REACT_APP_PROFILE_URL=http://localhost:6000
REACT_APP_MESSAGING_URL=http://localhost:3000
REACT_APP_DISCOVERY_URL=http://localhost:9000
REACT_APP_DYNAMIC_CONTENT_URL=http://localhost:5000
```

`lib/config.js` centralizes these. **When the API gateway lands, collapse to one
`REACT_APP_API_URL` and drop the per-service vars** — the api slices are the only
place that changes.

> Depends on **CORS** being enabled on each service (backend requirement — see
> the platform spec's CORS section). Without it, every browser call fails.

## 4. Auth token lifecycle (the core of the foundation)

users-service issues a short-lived **access JWT** + a rotating **refresh token**.

- **Storage:** access token in memory (Redux `authSlice`); refresh token in the
  **persisted** slice (redux-persist) so a reload stays logged in. Do not persist
  the access token.
- **Attach:** a `prepareHeaders` on each api's baseQuery reads the access token
  from state and sets `Authorization: Bearer <token>`.
- **Refresh on 401:** a `baseQueryWithReauth` wrapper — on a 401, call
  `POST /auth/refresh` once (single-flight, so concurrent 401s don't stampede),
  store the new pair, retry the original request. If refresh fails, dispatch
  `loggedOut` and redirect to `/login`.
- **Login/Register:** `authApi` mutations store `{access, refresh, user}` into
  `authSlice` on success.
- **Logout:** `POST /auth/logout` with the refresh token, then clear the slice
  and purge persist.

```
authSlice: { accessToken (memory), refreshToken (persisted),
             user: {id, email, role}, status }
```

## 5. Routing & guards

- `react-router-dom` v6, routes from `src/routes/`.
- **Public:** `/login`, `/register`, `/forgot-password`, `/reset-password`,
  `/verify-email`.
- **Protected:** a `<RequireAuth>` wrapper redirects to `/login` when no session.
- **Role-aware:** `<RequireRole role="brand|creator">` for role-specific areas
  (e.g. brand-only campaign creation, creator-only profile editor).
- **Post-login routing:** if `email_verified` is false → verification nudge; if
  onboarding incomplete → onboarding; else → role home.

## 6. Cross-cutting UI concerns

- **Loading/empty/error states** are first-class: RTK Query's
  `isLoading/isError` drive a shared `<Spinner>` / `<ErrorText>` / empty states.
  No screen ships without all three.
- **Error mapping:** surface backend messages (422 field errors, 401/403) as
  human copy; never show raw JSON.
- **Forms:** controlled components now; adopt `react-hook-form` if validation
  grows.
- **Design tokens:** extract the existing inline colors (e.g. brand orange
  `#FF914D`) into CSS variables / a theme module before building more screens.

## 7. Build & deploy

- CRA build (`npm run build`); note the react-scripts 4 + modern Node OpenSSL
  flag (`NODE_OPTIONS=--openssl-legacy-provider`).
- Host on Vercel/Netlify; env vars per environment. Point the `REACT_APP_*_URL`
  vars at the deployed services (or the gateway).

## 8. Testing

- Component/integration tests with React Testing Library (already present).
- Mock RTK Query endpoints (msw or RTK's `fakeBaseQuery`) — no live backend in
  unit tests.

## Definition of done (foundation)

- [ ] Store mounted; scaffold bugs fixed.
- [ ] Router with public/protected/role guards.
- [ ] `baseQueryWithReauth` attaches tokens and refreshes on 401.
- [ ] A user can register/login and land on an authenticated route that makes a
      real call to `users-service` (`/auth/me`).
