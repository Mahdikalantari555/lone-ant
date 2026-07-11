---
title: "Feature: Nest and Storage"
status: in-review
parent: ../spec.md
---

# Nest and Storage

## Purpose

Stored food is the concrete feedback that the player's actions matter and is
the main growth signal in Version 1.

## Requirements

- FR-1: The colony SHALL maintain a single stored-food value (storage).
- FR-2: Storage SHALL increase when food is delivered by the player or workers.
- FR-3: When storage crosses defined thresholds, the colony SHALL grow (more workers and/or larger visible nest).
- FR-4: Growth SHALL be deterministic from storage (same storage → same colony state).
- FR-5: Storage SHALL be visible to the player in the UI.

## Acceptance Criteria

- AC-1 (FR-1, FR-2): Given delivery of value V, When it lands, Then storage == previous + V.
- AC-2 (FR-3): Given storage reaches threshold T, When the colony update runs, Then worker count and/or nest size increases and the change is visible.
- AC-3 (FR-4): Given identical storage values across two sessions, When the colony rebuilds, Then worker count and nest size are identical.

## Constraints

- ✅ Always: storage is the single source of growth; no hidden multipliers.
- ⚠️ Ask first: changing thresholds, growth formula, or adding spend mechanics.
- 🚫 Never: let storage go negative; let growth depend on wall-clock time.

## Edge Cases

- EC-1: Storage at zero → no growth, no divide-by-zero.
- EC-2: Many thresholds crossed at once → apply all growth steps in order, deterministically.
- EC-3: Storage displayed during a save/load → matches underlying value exactly.

## Out of Scope

Larvae, queen, brood chambers, multiple nests (Version 2+).

## Validation

- Manual: deliver food, watch counter and nest/worker count change at thresholds.
- Automated (later): unit test growth function is pure (storage → colony state).

## Source map

Linked to: colony state, growth/thresholds, nest renderer (to be created).
