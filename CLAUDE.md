# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Command reference for the Ndorsify web client. For architecture see
[`AGENTS.md`](AGENTS.md); for decisions see [`docs/adr/`](docs/adr/).

## Implementing from the design system

Screens come from the **Ndorsify design-system artboards** (the "Ndorsify Canvas"
artifact). Each artboard is drawn as a rounded card floating on a grey canvas,
grouped into "Turns" (e.g. `3a Sign up`, `2b Offer detail`).

**The artboard's outer card frame is design reference only — never reproduce it.**
The grey canvas, the rounded card border/radius/shadow, and the artboard chrome
around each screen are just how the design tool presents mocks. **The content
inside the card is the actual full-bleed web window** — it must fill the viewport
edge to edge (no centered floating card, no outer gutter/border/radius/shadow)
unless the design explicitly shows an inner card as part of the UI.

Match everything _inside_ the frame faithfully — layout, spacing, colours, copy,
component structure — using the shared design system in
[`src/styles/ndorsify.css`](src/styles/ndorsify.css) (`nd-*` classes) and
[`src/components/common/ds.js`](src/components/common/ds.js).

## Toolchain

Node 24 LTS (pinned in `.nvmrc`, enforced by `engines`). Dependencies are
installed with `npm install`.

## Commands

```bash
npm install                       # install dependencies
npm start                         # dev server on http://localhost:3000
npm run build                     # production build to dist/
npm test                          # Vitest, single run
npm run test:watch                # Vitest in watch mode
npm test -- -t "adds a package"   # run a single test by name
npm run check                     # prettier --check .   (format check)
npm run format                    # prettier --write .   (auto-format)
```

## Gotchas

- **JSX lives in `.jsx` files.** Vite picks its parser by extension, so a
  component written into a `.js` file fails to build. Plain modules (api
  slices, helpers) stay `.js`.
- **Env vars keep the `REACT_APP_` prefix** (`envPrefix` in `vite.config.js`),
  read through `import.meta.env`, not `process.env`.

## Formatting

Prettier config in `.prettierrc.json` (no semicolons, single quotes). Run
`npm run format` before committing.
