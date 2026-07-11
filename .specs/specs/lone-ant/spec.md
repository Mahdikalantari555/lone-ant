---
title: "Lone Ant — Product Specification"
date: 2026-07-11
status: in-review
source_idea: ideas/lone-ant/
---

# Lone Ant — Product Specification

This is the product/overview contract. It states the *what* and *why*. Each
behavioral area is broken into its own feature spec under
[features/](features/) with binary, testable acceptance criteria. Code is
built against those feature specs, not against this prose.

## Purpose (why)

A small, finishable web/Android game where you **live as one ant** in a colony
that keeps living and growing around you. The player controls a single ant,
forages and carries food home, and watches automatic worker ants keep the
colony alive. Progress may persist on the device (offline save is optional for
V1). The point is a cozy, low-pressure "tiny living world" that a
hobbyist can actually ship with AI agents doing most of the build, developed
from a phone with a fast test loop.

## Audience

Hobby game tinkerers — people who enjoy poking at games and game-making more
than being a passive user. They want a world that feels alive, something they
can finish and show a friend, and a short loop they return to across days.
Simple graphics/sound are fine; the feeling of being one small ant in a bigger
living thing is what matters. See [ideas/lone-ant/application.md](../../ideas/lone-ant/application.md).

## Goals

- G1: Controllable single ant whose main activity is foraging and carrying food home.
- G2: A colony that visibly grows and stores food because of what ants (player + workers) do.
- G3 (deferred to V2): Progress persistence between sessions is **not** in V1. The game starts fresh each session; save/load moves to Version 2.
- G4: Runs in a web browser with no install; later wrappable as an Android APK.
- G5: Buildable mostly by AI agents, from a phone, with a fast build-and-test loop.

## Non-goals (Version 1)

- Multiplayer, accounts, or any server.
- Real-time simulation while the game is closed (the world is *saved*, not *running*).
- Rival colonies, genetics, seasons, larvae, queens, procedural worlds, multiple insect species.
- Polished art or music; simple shapes and simple sound are acceptable.
- A native-only build path requiring Android Studio up front.
- Offline save / progress persistence between sessions (deferred to V2).

## Core loop

The player's normal session is **forage & carry**: tap-to-move the ant (tap a point, it pathfinds there) → find food →
pick it up → carry it back along (or laying) a pheromone trail → drop it in the
nest → storage increases → repeat. Worker ants do the same in the background.
Persistence is **save-my-progress**: on return, colony size, stored food, and
unlocks are as left; the world does not advance on its own.

## Design emphasis (V1)

You want **more world/colony design investment for V1**, not more mechanics.
Concretely, V1 should make the world *feel* alive and worth looking at: a
visible, growing nest; ambient activity beyond the player (workers, drifting
pheromones, small ecosystem motion); a day/night mood cycle; and some
terrain/visual variety so the map isn't flat. The chosen direction is a
**simple but beautiful pixel-art** style — see the full brief in
[features/world-and-ambiance.md](features/world-and-ambiance.md) (OQ-6
resolved).

## Platform & tech approach

- **Stack:** Browser game, Phaser 3 + TypeScript. (Exact versions pinned when implementation starts — see [features/web-deploy.md](features/web-deploy.md).)
- **Deploy:** Web first (hosted, opens from a link, playable on a phone). Later wrapped as an Android APK with Capacitor.
- **Tooling:** Kilo Code edits the project; push to GitHub; GitHub Pages updates; open URL on phone to test; repeat.
- **Offline:** No server, no account required to play. (Save/load deferred to V2.)

## Constraints (three-tier)

- ✅ Always: keep the player controllable as exactly one ant; steer via tap-to-move (tap target, ant pathfinds); keep all food/storage logic in shared colony state.
- ⚠️ Ask first: changing the core fun loop (e.g. adding defense/steering jobs before Version 2); adding a new dependency; changing the save schema.
- 🚫 Never: require a network connection or account to play or save; simulate the world while the game is closed; add features listed in Non-goals; delete or weaken tests to make them pass.

## Assumptions (risk-tagged)

- A1 (RESOLVED): Pure forage-&-carry accepted for V1 — no extra player job. *But see Design emphasis: invest more in world/colony liveliness for V1.*
- A2 (RESOLVED): Reward for storing food = more workers + bigger visible nest. No player-ant unlock in V1.
- A3 (Low): On-device web storage (localStorage/IndexedDB) is sufficient and persists between sessions on the target phones.
- A4 (Low): Phaser can render hundreds of ants at acceptable frame rate on mid-range Android. *If false, cap worker count / use spatial culling.*

## Acceptance criteria (Version 1, whole-product)

These are the binary, checkable conditions for "V1 is done." Each maps to a
feature spec.

- AC-1: Given the game loads, When the player steers, Then exactly one ant responds and moves on the 2D map (controllable-ant).
- AC-2: Given the player taps the ant onto/near a food item (tap-to-move), When it arrives and pickup fires, Then the ant carries it and storage increases on drop at the nest (foraging).
- AC-3: Given the game runs, When workers exist, Then they follow pheromone trails and deliver food to storage without player input (worker-ants-and-pheromones).
- AC-4: Given storage crosses a threshold, When the colony updates, Then worker count and/or nest size increases and is visible (nest-and-storage).
- AC-5: Given a (rare) spider is present, When it contacts an ant, Then the ant is removed/returned and (if carrying) drops food (spiders).
- AC-6 (deferred to V2): Save/load acceptance criteria move to Version 2; V1 starts fresh each session.
- AC-7: Given the deployed URL, When opened on a phone browser, Then the game is playable with no install (web-deploy).

## Edge cases (cross-cutting)

- E1: Player ant dies/caught → respawns at nest; control is never lost.
- E2: No food on map → workers idle, no crash, storage unchanged.
- E3: Storage at zero → no negative values, no divide-by-zero in growth math.
- E4 (V2): Save corrupted or absent → start a fresh colony, do not crash.
- E5 (V2): Page closed mid-carry → on reopen, food is at nest or back in world, never duplicated.

## Open questions (unresolved — human decides)

- OQ-1 (RESOLVED): Pure forage-&-carry loop accepted for V1; no extra player job. World-design emphasis added instead (see Design emphasis).
- OQ-2 (RESOLVED): Reward = more workers + bigger nest.
- OQ-3 (RESOLVED): Spiders are rare by default.
- OQ-4 (RESOLVED): Phaser 3 + TypeScript, web-first, Capacitor APK later.
- OQ-5 (RESOLVED): Offline save is **deferred to V2**. V1 has no persistence; the save-and-load feature moves to Version 2.
- OQ-6 (RESOLVED): "More world design" = a **simple but beautiful pixel-art** look with terrain variety (autotiles + foliage), ambient ecosystem motion (grass sway, worker greetings, reusable particles), and a visibly growing nest. Captured in [features/world-and-ambiance.md](features/world-and-ambiance.md) as a concrete style brief (16px grid, 320×576, warm limited palette, nest ring-growth, player/worker cues, violet spider with telegraph, day/night tint, diegetic HUD).

## Feature specs

- [features/controllable-ant.md](features/controllable-ant.md)
- [features/foraging.md](features/foraging.md)
- [features/worker-ants-and-pheromones.md](features/worker-ants-and-pheromones.md)
- [features/nest-and-storage.md](features/nest-and-storage.md)
- [features/spiders.md](features/spiders.md)
- [features/save-and-load.md](features/save-and-load.md) — **deferred to V2**
- [features/web-deploy.md](features/web-deploy.md)
- [features/world-and-ambiance.md](features/world-and-ambiance.md)

## Source map

Grew from:

- [ideas/lone-ant/concept.md](../../ideas/lone-ant/concept.md)
- [ideas/lone-ant/application.md](../../ideas/lone-ant/application.md)
- [ideas/lone-ant/questions.md](../../ideas/lone-ant/questions.md)

When implementation begins, link the key source files here (ant controller, pheromone system, storage, save/load, spider AI, deploy config).

## Related docs

- Source idea: [ideas/lone-ant/](../../ideas/lone-ant/)
- Forge workflow: `README.md`, and the `/new-idea`, `/new-spec`, `/archive` commands.

## Status & approval

Status: **in-review — all open questions resolved.** The spec is now
approval-ready. Do not start implementation until the human approves this
overview and the linked feature specs. When a decision changes, update the
relevant section *first*, then implement.
