---
title: "Feature: World and Ambiance (V1 design emphasis)"
status: in-review
parent: ../spec.md
---

# World and Ambiance (V1 design emphasis)

## Purpose

You explicitly want **more world/colony design investment for V1**, not more
mechanics. The mechanics (forage, workers, storage, spiders) are simple by
design; the thing that should feel rich is the *world* — a place worth living
in and returning to. This feature owns the "does it feel alive?" half of V1,
expressed as a **simple but beautiful pixel-art** look.

OQ-6 (what "more world design" means) is answered by this brief: terrain
variety + ambient ecosystem + a visibly growing nest, all in a warm,
handmade, miniature pixel-art style. Source: the pixel-art style brief
(Claude) captured below.

## Visual style (pixel art) — brief

### Grid, canvas & scaling
- **Tile size: 16×16px.** All terrain authored on a 16px grid.
- Sprite canvases: ants 16×16 (silhouette ~10–12px); food crumbs 8×8; spider 24×24; nest built from 16×16 ring tiles, not one sprite.
- **Internal resolution: 320×576** (20×36 tiles). Phaser Scale Manager `FIT` mode to letterbox onto the device.
- Rendering: `pixelArt: true`, `roundPixels: true`, nearest-neighbor, **integer zoom only** (2×/3×, never fractional). Never rotate sprites for facing — use `flipX` + distinct up/down frames. Depth/Y-sort ants and tall foliage.
- Animation budget (whole cast): ant walk 4f, ant idle 2f, spider walk 4f + 2f lunge telegraph.

### Palette (hex) — one swatch file, pulled consistently
- Ground/dirt: shadow `#3B2A20`, base `#5A3F2B`, mid `#7A5738`, highlight `#9C7748`, sunlit `#C9A15F`.
- Grass/foliage: shadow `#2E4423`, mid `#557A34`, highlight `#8BAB4C`.
- Nest: shadow `#4A2F22`, base `#6B4530`, highlight `#8F6244`, rim glow `#D9B076`.
- Player ant: body `#A8432B`, shadow `#5C2417`, highlight `#E8935F`.
- Worker ant: body `#2B1D16`, shadow `#140D0A`, highlight `#6B4A35`.
- Food: crumb `#E8C27A`/`#C79A52`/`#FFF2C2`; seed `#B5533C`/`#7A3223`; leaf `#7FAE4A`/`#4B7028`.
- Pheromone glow: core `#7CF5C4`, mid `#2FBF91`, fade `#0B5E4A`.
- Spider: body `#241B2E`, highlight `#4A3562`, warning `#FF3B3B`.
- Day/night tints (full-screen multiply overlay): dawn `#FFD9A0` @25%, noon `#FFF6E0` @10%, dusk `#FF9D6C` @30%, night `#1A1F3D` @55%; night warm pools `#FFB347` (additive).

### How each element reads
- **Terrain variety:** one base dirt tile + 3–4 autotile variants (pebble, grass tuft, leaf litter, twig) via tilemap noise; occasional 16×24 leaf-blade sprites the ant walks behind (Y-sorted) for fake depth. Dirt ~70% of ground.
- **Nest growth:** concentric ring tiles around a dark entrance, not a swapped asset. Author 4–5 stages at **0 / 25 / 75 / 150 / 300 stored food** as additive ring stamps; higher stages add a side-tunnel mouth.
- **Player vs worker (color-blind safe, redundant cues):** player warm amber-red, ~15% larger (14px vs 10–11px), idle antenna-twitch + subtle 1px pulsing halo. Workers dark, small, uniform, never idle-animate.
- **Food:** 8×8 irregular crumb blobs, scattered in clusters of 2–4 near grass tufts (never isolated). Carried crumb bobs above the body.
- **Pheromone trail:** chain of small glow dots (pooled sprites / particle emitter, `ADD` blend) dropped by workers; alpha ~0.6 decaying to 0 over 20–40s, with slow ±10% sine "breathe."
- **Spider:** only cool-violet, high-contrast creature; bigger (24×24), round abdomen; 0.4–0.6s red-glint flash telegraph before a lunge (fair warning).
- **Day/night:** one camera-covering `Graphics` rect tweened through the four tints on a slow loop (**8–12 real minutes per full day**); at night, soft-radial glow sprites at the nest mouth and fresh trails (lantern-lit den, not blackout).

### HUD (portrait, minimal, diegetic-leaning)
- Top-left: storage counter (crumb icon + number) in pixel bitmap font, cream `#F4E9D8` with 1px dark outline, in a nest-brown rounded chip.
- Top-right: colony size (ant icon + count), same chip.
- Top-center/minor: day/night sun→moon icon (glanceable confirmation only).
- **No buttons.** Tap-to-move shows a small expanding-ring marker (2–3 frames, pheromone-glow color) at the tap point, reinforcing the glow motif.

### Three cheap "alive" touches
1. Grass tufts: lazy 2-frame sway, random per-tile phase.
2. Workers occasionally do a 2-frame "antenna touch" greeting when passing — sells a living colony.
3. One reusable 2–3px soft dot texture tinted for: footstep dust, night fireflies near nest, food-crumb twinkle.

### Mood reference
Warm pixel-farm glow of *Stardew Valley*/*Sprout Lands* × gentle wandering of *A Short Hike* × "tiny creature, huge world" wonder of *Pikmin* × colony charm of *SimAnt*, with *Eco*/*Terraria*-style bloom on pheromone trails and *Alto's Odyssey*-style day/night skies. Handmade, warm, miniature — like a real ant colony through a magnifying glass on a summer afternoon.

## Requirements

- FR-1: The nest SHALL be visibly present and SHALL grow as the colony grows, via additive ring stages at defined storage thresholds.
- FR-2: The world SHALL show ambient activity beyond the player (workers, fading pheromone trails, grass sway, small ecosystem motion).
- FR-3: The game SHALL include a day/night cycle that changes light/mood via a full-screen tint tween.
- FR-4: The map SHALL have terrain variety (autotiles + foliage) so it is not a flat uniform field.
- FR-5: The visual style SHALL be pixel art on a 16px grid at 320×576 internal resolution, integer-zoom only, `pixelArt: true`.
- FR-6: The player ant SHALL be distinguishable from workers by redundant cues (color + size + idle halo), not color alone.
- FR-7: Spiders SHALL be visually distinct (cool violet, larger) and SHALL telegraph a lunge with a red-glint flash before contact.

## Acceptance Criteria

- AC-1 (FR-1): Given storage reaches 25/75/150/300, When the colony updates, Then the nest shows the corresponding additional ring/tunnel stage.
- AC-2 (FR-5): Given the game boots, When the renderer initializes, Then it uses `pixelArt: true`, a 16px tile grid, 320×576 internal resolution, and integer zoom only (no fractional scale).
- AC-3 (FR-2): Given the game runs unattended, When observed, Then worker motion, fading pheromone glow dots, and grass sway are visible.
- AC-4 (FR-3): Given the day timer advances, When the tint tweens, Then lighting shifts through dawn/noon/dusk/night over ~8–12 minutes, and night shows warm glow pools at the nest.
- AC-5 (FR-4): Given the map renders, When inspected, Then at least two distinct terrain variants (e.g. dirt + grass tuft + pebble) are present.
- AC-6 (FR-6): Given player and worker ants on screen, When compared, Then the player is larger, warm-colored, and idle-animates, while workers are dark/small/never idle.
- AC-7 (FR-7): Given a spider about to lunge, When the telegraph plays, Then a red-glint flash precedes contact by 0.4–0.6s.

## Constraints

- ✅ Always: drive visuals from the shared colony/world state; keep the palette to one swatch file; respect the animation budget.
- ⚠️ Ask first: adding audio/music beyond simple sound; art beyond the brief's palette/tiles.
- 🚫 Never: fractional zoom (shimmer); rotate pixel sprites for facing; let ambiance break the frame budget (see A4 in [../spec.md](../spec.md)); require accounts/network to render the world.

## Edge Cases

- EC-1: Start (storage 0) → nest still visibly present at stage 0.
- EC-2: Many entities → effects stay within frame budget; pheromone dots pooled.
- EC-3: Day/night boundary → no flicker; tint tween is continuous.
- EC-4: Color-blind player → player/worker still distinguishable via size + halo, not hue alone.

## Out of Scope

Full biomes, weather, interior nest exploration, narrative, non-pixel art styles (Version 2+).

## Validation

- Manual: watch a minute with no input — confirm it feels alive, nest grows, day/night reads, player distinct from workers.
- Automated (later): assert palette swatch file exists and matches brief hexes; assert internal resolution 320×576; assert nest stage == f(storage) is deterministic.

## Source map

Linked to: palette/swatch file, tilemap + autotiles, nest ring renderer, ant sprites (player/worker), food sprites, pheromone emitter, spider sprite + telegraph, day/night tint overlay, HUD chips, ambient spawner (to be created).
