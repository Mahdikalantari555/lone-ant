# Lone Ant — Implementation Plan

Based on spec.md and feature-*.md specs. Phaser 3 + TypeScript + Vite, web-first, GitHub Pages deploy.

---

## Phase 0 — Project Setup

| Task | Description | Spec Ref |
|------|-------------|----------|
| 0.1 | Initialize Vite + TypeScript + Phaser 3 project (pin versions) | feature-web-deploy FR-3 |
| 0.2 | Configure Phaser Scale Manager: `FIT` mode, 320×576 internal, `pixelArt: true`, `roundPixels: true`, integer zoom only | feature-world-and-ambiance FR-5 |
| 0.3 | Set up GitHub Pages deploy workflow (GitHub Actions) | feature-web-deploy FR-4 |
| 0.4 | Add ESLint + Prettier + TypeScript strict config | — |
| 0.5 | Create palette swatch file (hex values from feature-world-and-ambiance §Palette) | feature-world-and-ambiance |

---

## Phase 1 — Core Infrastructure

| Task | Description | Spec Ref |
|------|-------------|----------|
| 1.1 | **Scene structure**: `Boot` → `Preload` → `Game` (main scene) | — |
| 1.2 | **Shared colony state** (singleton/service): `storage`, `workerCount`, `nestStage`, thresholds | feature-nest-and-storage FR-1, FR-3 |
| 1.3 | **Input system**: tap-to-move → world point → pathfind request | feature-controllable-ant FR-2, FR-3 |
| 1.4 | **Pathfinding**: A* on 16px grid (tilemap walkable layer) | feature-controllable-ant FR-2 |
| 1.5 | **Entity base class**: position, velocity, sprite, state machine | feature-controllable-ant, feature-foraging |
| 1.6 | **Collision system**: Phaser Arcade or custom spatial grid | feature-foraging, feature-spiders |

---

## Phase 2 — Controllable Ant (feature-controllable-ant)

| Task | Description | Spec Ref |
|------|-------------|----------|
| 2.1 | PlayerAnt class: single instance, sprite (16×16, warm palette, 14px visual), idle anim (antenna twitch + 1px halo pulse) | feature-world-and-ambiance FR-6 |
| 2.2 | Tap input → request path → follow waypoints | FR-2, AC-1 |
| 2.3 | States: `idle`, `moving`, `carrying`, `respawning` | FR-4, FR-5 |
| 2.4 | Carry state: one food item, bobbing offset above sprite | feature-foraging FR-3 |
| 2.5 | Respawn at nest on death/catch, control transfers within 1s | FR-5, AC-4 |
| 2.6 | Edge cases: boundary clamp, multi-touch → latest tap wins, input ignored during respawn | EC-1, EC-2, EC-3 |

---

## Phase 3 — Foraging & Food (feature-foraging)

| Task | Description | Spec Ref |
|------|-------------|----------|
| 3.1 | Food entity: 8×8 crumb sprites (3 palette variants), spawn in clusters near grass tufts | feature-world-and-ambiance |
| 3.2 | Pickup on overlap (player ant): item removed from world, ant enters `carrying` with food value | FR-2, AC-1 |
| 3.3 | Drop zone at nest entrance: on overlap while carrying → storage += value, clear carry state | FR-4, AC-2 |
| 3.4 | Shared colony storage singleton mutation only (no direct mutation) | Constraints ✅ |
| 3.5 | Edge cases: caught while carrying → drop at catch point (no dup); drop outside nest → reject/return to world; no food → no crash | EC-1, EC-2, EC-3 |

---

## Phase 4 — Worker Ants & Pheromones (feature-worker-ants-and-pheromones)

| Task | Description | Spec Ref |
|------|-------------|----------|
| 4.1 | WorkerAnt class: dark palette, 10–11px, no idle anim, pool/spawn from colony state | feature-world-and-ambiance FR-6 |
| 4.2 | Pheromone grid: 16px cells, two layers (to-food, to-nest), float strength, decay per tick | FR-3, FR-5 |
| 4.3 | Worker AI: wander → detect food → return to nest laying trail; bias movement toward stronger pheromone | FR-2, FR-4 |
| 4.4 | Trail rendering: pooled glow dots (ADD blend), α 0.6 → 0 over 20–40s, slow sine "breathe" | feature-world-and-ambiance |
| 4.5 | Shared storage writes (same as player) | Constraints ✅ |
| 4.6 | Performance: cap workers per A4; spatial culling; object pools | EC-3, A4 in spec.md |

---

## Phase 5 — Nest & Storage Growth (feature-nest-and-storage)

| Task | Description | Spec Ref |
|------|-------------|----------|
| 5.1 | Storage value → deterministic growth function (pure function: storage → {workerCount, nestStage}) | FR-4, AC-3 |
| 5.2 | Thresholds: 0 / 25 / 75 / 150 / 300 stored food | feature-world-and-ambiance FR-1 |
| 5.3 | Nest renderer: concentric ring tiles (16×16 stamps) around dark entrance; additive stages | feature-world-and-ambiance |
| 5.4 | HUD chips: top-left storage (crumb icon + count), top-right colony size (ant icon + count), top-center day/night icon | feature-world-and-ambiance HUD |
| 5.5 | Edge cases: zero storage → stage 0 visible; multiple thresholds crossed at once → apply in order | EC-1, EC-2 |

---

## Phase 6 — Spiders (feature-spiders)

| Task | Description | Spec Ref |
|------|-------------|----------|
| 6.1 | Spider entity: 24×24, cool violet palette, round abdomen, 4-frame walk + 2-frame lunge telegraph | feature-world-and-ambiance FR-7 |
| 6.2 | AI: slow roam, occasional lunge toward nearest ant (telegraph 0.4–0.6s red glint) | FR-4, AC-2 |
| 6.3 | Collision: on contact → ant removed (player respawns at nest; worker despawns), carried food dropped at contact point | FR-2, FR-3, AC-1 |
| 6.4 | Configurable count (default rare, 0 = disabled) | FR-5, FR-6, AC-3 |

---

## Phase 7 — World & Ambiance (feature-world-and-ambiance)

| Task | Description | Spec Ref |
|------|-------------|----------|
| 7.1 | Tilemap: base dirt + 3–4 autotile variants (pebble, grass tuft, leaf litter, twig) via noise | FR-4 |
| 7.2 | Foliage layer: 16×24 leaf blades, Y-sorted behind/above ants | — |
| 7.3 | Day/night cycle: full-screen Graphics rect, tint tween through 4 stops over 8–12 min real time | FR-3, AC-4 |
| 7.4 | Night glow pools: additive radial sprites at nest mouth + fresh trails | — |
| 7.5 | Ambient life: grass sway (2-frame, random phase), worker antenna-touch greeting (2-frame, rare), shared 2–3px dot texture for dust/fireflies/crumb twinkle | FR-2, "Three cheap alive touches" |
| 7.6 | Tap marker: expanding ring (pheromone glow color, 2–3 frames) at tap point | HUD |
| 7.7 | Integer zoom only, no sprite rotation (flipX + distinct up/down frames) | Constraints 🚫 |

---

## Phase 8 — Web Deploy & Polish (feature-web-deploy)

| Task | Description | Spec Ref |
|------|-------------|----------|
| 8.1 | Vite build → `dist/` with hashed assets, `index.html` entry | FR-1, FR-3 |
| 8.2 | GitHub Actions: install → build → deploy to `gh-pages` branch | FR-4 |
| 8.3 | Verify on mobile: touch works, no install prompt, loads on 3G (asset budget) | AC-1, EC-1 |
| 8.4 | Capacitor config scaffold (capacitor.config.ts, android/ stub) for future APK | FR-5 |
| 8.5 | localStorage save stub (no-op in V1, wired for V2) | feature-save-and-load (deferred) |

---

## Phase 9 — Validation & Handoff

| Task | Description |
|------|-------------|
| 9.1 | Manual playthrough on phone: all AC-1 through AC-7 from spec.md pass |
| 9.2 | Automated smoke test: headless Chromium loads, Phaser boots, no console errors |
| 9.3 | Verify palette swatch file matches spec hex values exactly |
| 9.4 | Verify internal resolution 320×576, integer zoom, `pixelArt: true` |
| 9.5 | Document key source files in spec.md Source map section |

---

## Dependency Graph

```
Phase 0
  └─ Phase 1
       ├─ Phase 2 (Controllable Ant)
       │    └─ Phase 3 (Foraging) ──┐
       ├─ Phase 4 (Workers/Pheros) ─┤──→ Phase 5 (Nest/Storage Growth)
       ├─ Phase 6 (Spiders) ────────┘
       └─ Phase 7 (World/Ambiance) ←── (renders state from Phases 2–6)
            └─ Phase 8 (Deploy)
                 └─ Phase 9 (Validate)
```

---

## Estimated Effort (rough)

| Phase | Complexity | Notes |
|-------|------------|-------|
| 0–1 | Low | Boilerplate, config |
| 2–3 | Medium | Core loop, state wiring |
| 4 | High | Pheromone grid + worker AI tuning |
| 5 | Low–Medium | Pure functions + tilemap stamps |
| 6 | Low | Simple enemy, rare spawn |
| 7 | Medium | Art integration, tilemap autotiling, day/night |
| 8 | Low | CI/CD, Capacitor scaffold |
| 9 | Low | Manual + smoke test |

---

## Risks & Mitigations

| Risk | Spec Ref | Mitigation |
|------|----------|------------|
| Phaser perf with 100+ ants + trails on mid Android | A4 (spec.md) | Cap workers at 50; spatial hash for pheromones; object pools; `requestAnimationFrame` budget check |
| Fractional zoom shimmer on mobile | feature-world-and-ambiance 🚫 | Lock `FIT` + integer zoom; test on device early |
| Save/load schema drift (V2) | feature-save-and-load ⚠️ | Versioned schema, migration stub now |
| Tap-to-move feels laggy | feature-controllable-ant FR-2 | Immediate local response + server-authoritative path; test on 3G phone |

---

## Start Point

Begin with **Phase 0.1–0.5** — scaffold the repo, pinned deps, palette file, and GH Pages workflow. Then proceed sequentially.