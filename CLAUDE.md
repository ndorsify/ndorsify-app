# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Command reference for the Ndorsify web client. For architecture see
[`AGENTS.md`](AGENTS.md); for decisions see [`docs/adr/`](docs/adr/).

## Toolchain

Node (works on Node 24 / npm 11). Dependencies are installed with `npm install`.

## Commands

```bash
npm install                       # install dependencies
npm start                         # dev server on http://localhost:3000
npm run build                     # production build to build/
npm test                          # Jest in interactive watch mode
CI=true npm test                  # run all tests once (non-watch)
npm test -- --watchAll=false -t "renders learn react"   # run a single test by name
npm run check                     # prettier --check .   (format check)
npm run format                    # prettier --write .   (auto-format)
```

## Gotchas

- **OpenSSL error on `npm start`/`build`** — `react-scripts` 4 on modern Node can
  throw `digital envelope routines::unsupported`. Prefix the command with
  `NODE_OPTIONS=--openssl-legacy-provider`.
- `npm run eject` is a one-way operation — do not run it without an explicit ask.

## Formatting

Prettier config in `.prettierrc.json` (no semicolons, single quotes). Run
`npm run format` before committing.
