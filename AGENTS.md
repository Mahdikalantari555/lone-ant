# AGENTS.md — Lone Ant

Guidance for AI agents (and humans) working on the **Lone Ant** codebase.

## What this project is

A small, finishable, browser-first pixel-art game where the player lives as **one
ant** in a colony that keeps living and growing around them. The core loop is
*forage & carry*: tap-to-move the ant → find food → pick it up → carry it back →
drop it in the nest → storage grows → repeat. Worker ants do the same in the
background, laying pheromone trails. A day/night mood cycle, ambient ecosystem
motion, and a visibly growing nest make the world feel alive.

- **Source of truth:** the prose overview is `IMPLEMENTATION_PLAN.md` plus the
  specs under `.specs/` (`spec.md` and the `feature-*.md` files). Code is built
  against the *feature specs' acceptance criteria*, not the prose.
- **Status:** specs are `in-review` / approval-ready. Implementation follows
  `IMPLEMENTATION_PLAN.md` phase-by-phase (Phase 0 → 9).

## Tech stack

- **Phaser 3** (pinned version — see `package.json`), **TypeScript** (strict),
  **Vite** for the dev server and static build.
- **Web-first deploy** to **GitHub Pages** via GitHub Actions. Later wrappable as
  an Android APK with **Capacitor** (Phase 8 scaffold only).
- **No backend, no account, no network required to play.** Offline save is
  **deferred to V2** — V1 always starts a fresh colony.

## Core rendering & style constraints (do not violate)

These come from `feature-world-and-ambiance` and are hard constraints:

- Internal resolution **320×576** (20×36 tiles of 16px).
- Phaser Scale Manager **`FIT`** mode, **`pixelArt: true`**, **`roundPixels: true`**,
  **integer zoom only** (2×/3×, never fractional — fractional zoom causes shimmer).
- **Never rotate pixel sprites** for facing — use `flipX` + distinct up/down frames.
- 16px tile grid. Sprite canvases: ants 16×16 (player visual ~14px, worker ~10–11px),
  food 8×8, spider 24×24, nest built from 16×16 ring tiles.
- Y-sort ants and tall foliage for fake depth.
- **One palette swatch file** holds all hex colors (see `src/config/palette.ts`
  when created; hex values are enumerated in `feature-world-and-ambiance.md`).
- Keep within the animation budget: ant walk 4f, ant idle 2f, spider walk 4f + 2f
  lunge telegraph.

## Architecture (target, follow when building)

- **Scene structure:** `Boot` → `Preload` → `Game` (main scene).
- **Shared colony state** (singleton/service): `storage`, `workerCount`,
  `nestStage`, thresholds. ALL food/storage mutation goes through this service —
  never mutate shared state directly from an entity.
- **Tilemap-based world** on a 16px grid with a walkable layer used for A* pathfinding.
- **Entity base class:** position, velocity, sprite, simple state machine.
- **Pheromone grid:** 16px cells, two layers (to-food, to-nest), float strength
  with per-tick decay. Cap workers (~50) and pool glow dots to stay in frame budget.

Key state machine states for the player ant: `idle` → `moving` → `carrying` →
`respawning`.

## Conventions

- TypeScript **strict mode**. No `any` without a reason.
- **No comments unless asked.** Write self-documenting code; name things clearly.
- **No `console.log` left in committed code** (except behind a debug flag).
- Pin all dependency versions in `package.json`.
- Respect the **three-tier constraints** from `spec.md`:
  - ✅ Always: one controllable ant, tap-to-move pathfinding, all food/storage in
    shared colony state.
  - ⚠️ Ask first: changing the core fun loop, adding a dependency, changing the
    save schema.
  - 🚫 Never: require network/account to play or save, simulate while closed,
    add Non-goals features, weaken tests to make them pass.

## Build, lint & test commands

Run from the project root after the scaffold exists (Phase 0). If a command is
missing, add it to `package.json` and document it here.

- `npm install` — install pinned deps.
- `npm run dev` — Vite dev server (local play / phone testing via forwarded URL).
- `npm run build` — production build to `dist/` (hashed assets).
- `npm run lint` — ESLint (run after every change).
- `npm run typecheck` — `tsc --noEmit` (strict).
- `npm run preview` — serve the built `dist/` locally.

Phase 9 adds an automated smoke test (headless Chromium boots Phaser, no console
errors).

## Implementation plan

Follow `IMPLEMENTATION_PLAN.md` sequentially:

- **Phase 0** — Project setup (Vite + TS + Phaser, Scale config, GH Pages
  workflow, ESLint/Prettier, palette swatch file).
- **Phase 1** — Core infra (scenes, colony state, input, A* pathfinding, entity
  base, collision).
- **Phase 2** — Controllable ant. **Phase 3** — Foraging & food.
- **Phase 4** — Worker ants & pheromones. **Phase 5** — Nest & storage growth.
- **Phase 6** — Spiders. **Phase 7** — World & ambiance (tilemap, foliage,
  day/night, HUD, ambient life).
- **Phase 8** — Web deploy & Capacitor scaffold. **Phase 9** — Validation & handoff.

Each phase references its spec `FR-*` / `AC-*` lines. Implement against those.

## Working with the specs

- Before implementing a feature, read the matching `feature-*.md` and the relevant
  `IMPLEMENTATION_PLAN.md` task row.
- Acceptance criteria (`AC-*`) are binary; aim to make each pass.
- Edge cases (`EC-*` / `E*`) must be handled without crashing.
- `feature-save-and-load.md` is **deferred to V2** — do not implement persistence
  in V1 (only wire a no-op stub if Phase 8 calls for it).
