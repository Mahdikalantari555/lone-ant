---
title: "Feature: Spiders (Threat)"
status: in-review
parent: ../spec.md
---

# Spiders (Threat)

## Purpose

A spider provides real but simple tension: avoid being caught, and avoid
leading danger home. Spiders are **rare by default** (OQ-3 resolved).

## Requirements

- FR-1: The world SHALL contain zero or more spider entities that roam.
- FR-2: A spider SHALL be able to catch an ant on contact.
- FR-3: When a player or worker ant is caught, it SHALL be removed (or returned to nest) and drop any carried food.
- FR-4: Spider behavior SHALL be simple and predictable enough to be avoidable.
- FR-5: Spider count/presence SHALL be configurable (for balancing).
- FR-6: By default, spiders SHALL be RARE (infrequent spawns), tuned for tension without constant stress.

## Acceptance Criteria

- AC-1 (FR-2, FR-3): Given a spider overlaps an ant, When contact resolves, Then the ant is removed/returned and any carried food drops to the world.
- AC-2 (FR-4): Given a spider at position P moving toward target, When the player steers away, Then the ant can reach the nest without forced contact.
- AC-3 (FR-5): Given a config with spider count = 0, When the game runs, Then no spiders exist and ants are never caught.

## Constraints

- ✅ Always: spider contact uses the same collision path as other entities; drops go through shared storage rules.
- ⚠️ Ask first: changing spider speed, count, or catch severity.
- 🚫 Never: let a spider destroy the nest or the save; let catch be unavoidable.

## Edge Cases

- EC-1: Spider catches player ant → control respawns at nest (see controllable-ant).
- EC-2: Spider and food drop coincide → food and spider resolve independently, no duplication.
- EC-3: Multiple ants caught same frame → each handled once.

## Out of Scope

Other enemy species, spider nests, boss spiders (Version 3).

## Validation

- Manual: spawn a spider, confirm catch removes ant and drops food, confirm respawn.
- Automated (later): collision test asserting caught ant count decreases by exactly one.

## Source map

Linked to: spider entity, collision system, ant lifecycle (to be created).
