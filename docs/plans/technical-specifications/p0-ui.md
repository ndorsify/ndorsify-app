# P0 · UI screens

**Status:** Proposed · **Depends on:** [ui-foundation](ui-foundation.md).

The frontend counterpart to the backend's
[p0-foundation](https://github.com/ndorsify/ndorsify-backend-microservices/blob/master/docs/plans/technical-specifications/p0-foundation.md).
These screens turn the five P0 services into a usable product.

Build order mirrors the backend: **auth → onboarding → profile → discovery →
messaging**. Auth is the vertical slice that proves the whole foundation.

> **Now superseded in scope.** The app has since had an indigo-rebrand redesign
> that ships a much larger shell (landing, role-aware dashboards, campaign
> builder, offers, earnings, collaboration board). This doc still describes the
> P0 backend wiring; for the full implemented page inventory and design system
> see [marketplace-ui](marketplace-ui.md). Route names below are updated to match
> the code.

---

## App shell

Nav + role-aware layout, `<RequireAuth>` / `<RequireRole>` guards, a global
error/toast surface, and the post-login routing logic from
[ui-foundation §5](ui-foundation.md).

## 1. Auth → `users-service`

Reuses the existing SignIn/SignUp components; wires them to `authApi`.

| Screen                                   | Route                    | Calls                        |
| ---------------------------------------- | ------------------------ | ---------------------------- |
| Login                                    | `/login`                 | `POST /auth/login`           |
| Register (with role pick: brand/creator) | `/register`              | `POST /auth/register`        |
| Forgot password                          | `/forgot-password`       | `POST /auth/forgot-password` |
| Reset password                           | `/reset-password?token=` | `POST /auth/reset-password`  |
| Verify email (landing)                   | `/verify-email?token=`   | `POST /auth/verify-email`    |

- Social buttons (Google/FB/Twitter) point at `/auth/oauth/{provider}/start` —
  **disabled/hidden** until the backend OAuth stubs are implemented.
- On login, store tokens (ui-foundation §4) and route by
  `email_verified` / onboarding state / role.

## 2. Onboarding → `dynamic-content-service`

| Screen                             | Route         | Calls                                                     |
| ---------------------------------- | ------------- | --------------------------------------------------------- |
| Role questionnaire (server-driven) | `/onboarding` | `GET /onboard/creator/questions` (+ brand set when added) |

- Renders questions from the server; on submit, writes answers to the profile
  (profile-service). Progressive completion drives a meter (P0/E6).

## 3. Profile → `profile-service`

| Screen                                    | Route           | Role    | Calls                                                      |
| ----------------------------------------- | --------------- | ------- | ---------------------------------------------------------- |
| Creator profile editor + completion meter | `/profile/edit` | creator | `PUT /profiles/creators/me`, `GET /profiles/creators/{id}` |
| Brand profile editor                      | `/profile/edit` | brand   | `PUT /profiles/brands/me`                                  |
| Public creator profile view               | `/creators/:id` | any     | `GET /profiles/{creators\|brands}/{id}`                    |

- Completion meter reads `completion_pct`; nudge to finish required fields.

## 4. Discovery → `discovery-service`

| Screen                             | Route                             | Role  | Calls                                                      |
| ---------------------------------- | --------------------------------- | ----- | ---------------------------------------------------------- |
| Creator search (filters + results) | `/discover`                       | brand | `GET /discovery/creators?q&niche[]&min_followers…&sort`    |
| Shortlists (create, view)          | `/shortlists`, `/shortlists/{id}` | brand | `POST /discovery/shortlists`, `POST …/items`, `GET …/{id}` |

- Filter bar: text, niche multi-select, follower range, engagement, sort.
- "Add to shortlist" action on each result card (idempotent).
- Result cards link to the public profile (§3) and to "Message" (§5).

## 5. Messaging → `messaging-service`

| Screen                                        | Route            | Calls                                                                |
| --------------------------------------------- | ---------------- | -------------------------------------------------------------------- |
| Inbox (conversation list)                     | `/messages`      | `GET /conversations`                                                 |
| Thread (messages + composer)                  | `/messages/{id}` | `GET /conversations/{id}/messages`, `POST …/messages`, `POST …/read` |
| Start conversation (from a profile/shortlist) | —                | `POST /conversations {recipient_id}`                                 |

- No real-time yet (backend is poll-based in P0): poll the open thread on an
  interval; mark-read on open. WebSocket/SSE is a fast-follow.

---

## Definition of done (P0 UI)

- [ ] Register/login works end-to-end against `users-service` (the foundation slice).
- [ ] A creator can complete onboarding and edit their profile to 100%.
- [ ] A brand can search creators, shortlist them, and open a public profile.
- [ ] Either party can start a conversation and exchange messages.
- [ ] Every screen has loading / empty / error states.
