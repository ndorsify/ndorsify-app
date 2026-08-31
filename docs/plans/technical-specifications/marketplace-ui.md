# Marketplace UI & design system

**Status:** Implemented — core flows (campaigns, discovery, messaging) are
live-data, verified E2E; earnings/analytics/ratings remain sample-only pending
their backend phases (see below) · **Depends on:**
[ui-foundation](ui-foundation.md) · **Extends:** [p0-ui](p0-ui.md)

This spec documents the app as it actually stands after the **indigo rebrand**
redesign — the full two-sided marketplace shell for brands and creators. It goes
well beyond the five P0 screens: it adds a public landing page, role-aware
dashboards, a campaign builder, an offer/negotiation flow, a creator earnings
console, and a shared design system.

The screens render fully today by falling back to representative **sample data**
(`src/lib/sampleData.js`) wherever a backend endpoint is missing or returns
nothing. A [`SampleBanner`](../../../src/components/common/ds.js) marks any screen
showing demo rows, so "UI done" is never mistaken for "wired to live data."

---

## Design system

Derived from the "Ndorsify Canvas" design artboard. Indigo accent (`#574FE0`) on
a light canvas, teal for success/escrow-released, amber for warnings/expiry.

| Layer | Location | Contents |
| --- | --- | --- |
| Theme tokens | [`src/index.css`](../../../src/index.css) | `--accent`, `--accent-press/soft`, `--ink`, `--ink-soft`, `--canvas`, `--line`, `--success`, `--warn` |
| Component classes | [`src/styles/ndorsify.css`](../../../src/styles/ndorsify.css) | `nd-page`, `nd-card`, `nd-btn`, `nd-pill`, `nd-kpi`, `nd-meter`, `nd-topnav`, `nd-nav`, … |
| React primitives | [`src/components/common/ds.js`](../../../src/components/common/ds.js) | `Avatar`, `Kpi`, `Meter`, `Toggle`, `ChartPlaceholder`, `SampleBanner` |
| App chrome | [`src/components/common/AppNav.js`](../../../src/components/common/AppNav.js) | Brandmark + role-aware top nav + primary action |

### Role-aware navigation

The top nav switches label set and primary action by `user.role`:

| | Brand | Creator |
| --- | --- | --- |
| Nav links | Dashboard · Discover · Campaigns · Messages · Reports | Opportunities · My deals · Messages · Earnings · Profile |
| Primary action | **New campaign** button | **Open to work** availability pill |

Both point at the same routes; the labels reframe them per audience (e.g.
`/dashboard` is "Dashboard" for brands, "Opportunities" for creators;
`/collaborations-board` is "Reports" vs "My deals").

---

## Page inventory

Routing is centralized in [`src/routes/index.js`](../../../src/routes/index.js)
and mounted in [`src/App.js`](../../../src/App.js). `/` serves the public landing
for logged-out visitors and redirects authed users to `/dashboard`.

### Public

| Screen | Route | Notes |
| --- | --- | --- |
| Landing | `/` | Marketing hero (creator match cards), brand logo strip, stats, three value props, footer. `LandingPage` |
| Login | `/login` | Auth vertical slice → `users-service` |
| Register | `/register` | Role pick (brand / creator) |

### Authenticated (`<RequireAuth>`)

| Screen | Route | Role | What it shows | Backend |
| --- | --- | --- | --- | --- |
| Dashboard | `/dashboard` | both | **Brand:** KPIs (active campaigns, creators booked, budget used, blended CPM), campaign table (spend/reach/status), activity feed. **Creator:** tiles (new invites, in negotiation, avg offer, response rate), invite cards, profile-completion to-dos, weekly schedule. | `campaign-service` (`/campaigns/mine`, `/invitations/mine`); KPIs are sample |
| Onboarding | `/onboarding` | both | Server-driven role questionnaire | `dynamic-content-service` |
| Profile editor | `/profile/edit` | both | Sectioned editor (Basics, Rate card, Portfolio, Platforms, Audience, Availability) + completion meter; connected-socials state | `profile-service` |
| Discover | `/discover` | brand | Filter rail (platform, audience size, verification), search chips, creator result cards (followers, engagement, rate, verified), add-to-shortlist, message | `discovery-service` |
| Creator profile | `/creators/:id` | both | Stat header, portfolio grid, past-campaign performance table, audience breakdown, rate-card packages | `profile-service` / `discovery-service` |
| Campaigns | `/campaigns` | brand | Manage campaigns (draft/open/closed), publish/close | `campaign-service` |
| Campaign builder | `/campaigns/new` | brand | Multi-step brief: Basics → Audience → Deliverables → Timeline → Shortlist; deliverable lines + rates, budget summary (rates, usage add-on, service fee, escrow hold), shortlist invite | `campaign-service` (`POST /campaigns`, publish, invite) |
| Marketplace | `/marketplace` | creator | Browse/filter open campaigns; apply with proposal + proposed rate | `campaign-service` (`/marketplace`, `apply`) |
| Invitations | `/invitations` | creator | Brand invite list; accept / decline | `campaign-service` (`/invitations/mine`) |
| Offer / invitation detail | `/invitations/:id` | creator | Offer breakdown (deliverable lines, your rate vs offered, usage rights), brand-trust stats, accept / counter / decline | `campaign-service` (`respondInvitation`) |
| Messages | `/messages`, `/messages/:id` | both | Campaign-tagged inbox + thread with composer (`MessagesLayout` shell) | `messaging-service` (poll-based) |
| Earnings | `/earnings` | creator | Tiles (paid YTD, in escrow, available, avg per deal), payouts table with escrow states (in escrow / releasing / paid), tax & invoice documents | **No backend yet** — sample-only |
| Collaboration board | `/collaborations-board` | both | Pipeline tracking (invited → accepted → in progress → submitted → approved → live); "Reports" for brands, "My deals" for creators | `collaboration-service` |

---

## Data-loading contract

1. Every feature owns an RTK Query api slice (`campaignApi`, `discoveryApi`,
   `collaborationApi`, `messagingApi`, `profileApi`, `onboardingApi`, `authApi`),
   each pointed at its service base URL from env (see
   [ui-foundation §3](ui-foundation.md)). Current ports in `.env`:
   users `1000`, profile `6060`, messaging `3000`, discovery `9000`,
   dynamic-content `5001`, campaign `2000`, collaboration `4000`.
2. A screen prefers live rows. If the query is empty (or the endpoint doesn't
   exist yet), it renders the matching block from `sampleData.js` and shows a
   `SampleBanner`.
3. Analytics that have **no** service (dashboard KPIs, earnings/escrow, blended
   CPM) are sample-only and stay that way until a metrics/payments backend lands.

## Status per screen (2026-08-30)

Since this doc was first written, **Discovery, Creator profile, Messaging,
and the Campaign builder→publish flow have all shipped live-data wiring**,
verified end-to-end through the browser — they no longer render sample data
in normal operation. See
[`MVP-ROADMAP.md`](../../../../MVP-ROADMAP.md) and
[`docs/phases/phase-1-marketplace-core.md`](../../../../docs/phases/phase-1-marketplace-core.md)
for what's verified and a punch-list of bugs found in the 2026-08-30 code
review (notably: `AppNav` dropped the links to Marketplace/Invitations, and
`RequireAuth` has no role gate).

## Gaps vs. backend

These screens are visually complete but still await backend work — tracked
per-phase in [`MVP-ROADMAP.md`](../../../../MVP-ROADMAP.md):

- **Earnings / escrow / payouts / checkout funding** — no service exists;
  entirely sample data. [Phase 5](../../../../docs/phases/phase-5-payments-earnings.md).
- **Dashboard analytics** (KPIs, CPM, reach, activity feed) — no metrics
  service; not yet scoped into a phase (revisit once Phase 5 payment data
  exists to compute real spend/CPM from).
- **Rate cards, media kit, connected-socials stats** — currently fake; even
  "Publish changes" on the profile editor silently drops these fields today.
  [Phase 3](../../../../docs/phases/phase-3-profile-discovery-depth.md).
- **Ratings** (brand rating, avg creator rating) — no service.
  [Phase 4](../../../../docs/phases/phase-4-endorsements-reviews.md).
- **Offers / counter-offers** as a first-class model — currently folded into
  invitations; may need its own negotiation state on `campaign-service`.
- **In-app notifications** — no bell/feed yet.
  [Phase 6](../../../../docs/phases/phase-6-notifications-outreach.md).
