# Technical Specifications

One file per feature or system. A tech spec answers **how** it will be built.

## Frontend specs

| Spec | Covers |
|---|---|
| [ui-foundation](ui-foundation.md) | Frontend architecture: store, routing, API client, JWT lifecycle, config |
| [p0-ui](p0-ui.md) | P0 screens (auth, onboarding, profile, discovery, messaging) mapped to the backend |

Backend service specs live in the `ndorsify-backend-microservices` repo under the
same path. See [ADR 0003](../../adr/0003-frontend-stack.md) for the stack.

## Writing new specs

Suggested sections: Overview · Data model · API surface · Service boundaries ·
Sequence / flow · Trade-offs & alternatives · Rollout · Testing.

Name files `feature-name.md` (kebab-case). Reference the paired PRD in
`../product-requirements/` and any decisions captured as [ADRs](../../adr/).
