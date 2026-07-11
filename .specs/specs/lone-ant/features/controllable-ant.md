---
title: "Feature: Controllable Ant"
status: in-review
parent: ../spec.md
---

# Controllable Ant

## Purpose

The player must control exactly one ant in a top-down 2D world. This is the
player's body in the simulation and the anchor of the whole game.

## Requirements

- FR-1: The game SHALL present exactly one player-controlled ant at all times.
- FR-2: The player SHALL steer the ant by tapping a point; the ant pathfinds there.
- FR-3: Controls SHALL work on a touchscreen phone (tap only; no physical keyboard required).
- FR-4: The ant SHALL be able to pick up and carry one food item at a time.
- FR-5: If the player ant is removed (caught/dies), control SHALL transfer to a respawned ant at the nest.

## Acceptance Criteria

- AC-1 (FR-1, FR-2): Given the game has loaded, When the player issues a movement input, Then exactly one ant moves and no other ant responds to player input.
- AC-2 (FR-3): Given a touchscreen device, When the player taps a destination, Then the ant pathfinds toward that point with no keyboard.
- AC-3 (FR-4): Given the ant is not carrying, When it touches a food item and pickup fires, Then it enters "carrying" state with that item.
- AC-4 (FR-5): Given the player ant is caught, When removal resolves, Then a new controllable ant exists at the nest within one second and is steerable.

## Constraints

- ✅ Always: one and only one player ant; reuse existing input/vector-math utilities.
- ⚠️ Ask first: changing control scheme to anything other than tap-to-move.
- 🚫 Never: let control be lost (no ant controllable); require keyboard on mobile.

## Edge Cases

- EC-1: Input during respawn → ignored or queued, no double ant.
- EC-2: Two simultaneous touch points → treat as one tap target (latest wins).
- EC-3: Ant at map boundary → cannot leave the world bounds.

## Out of Scope

Defending the nest, steering workers, choosing dig spots (Version 2+).

## Validation

- Manual: load on phone, steer, pick up, force a catch, confirm respawn.
- Automated (later): unit test on input→velocity mapping; test that player-ant count == 1 after respawn.

## Source map

Linked to: ant controller module (to be created). See [../spec.md](../spec.md#source-map).
