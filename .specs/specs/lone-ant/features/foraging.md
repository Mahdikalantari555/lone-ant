---
title: "Feature: Foraging"
status: in-review
parent: ../spec.md
---

# Foraging

## Purpose

Carrying food from the world into the nest is the player's core activity and
the main way colony storage grows. It is the "fun loop" the whole game rests
on (see OQ-1 in [../spec.md](../spec.md)).

## Requirements

- FR-1: The world SHALL contain food items the player can perceive and reach.
- FR-2: The player ant SHALL pick up a food item on contact and enter a carrying state.
- FR-3: While carrying, the ant's movement SHALL still function (possibly slower).
- FR-4: Dropping food at the nest entrance SHALL increase colony storage by a defined amount.
- FR-5: Storage SHALL never decrease except through defined rules (no silent loss).

## Acceptance Criteria

- AC-1 (FR-2): Given the ant is not carrying and overlaps a food item, When pickup fires, Then carrying state is true and the item leaves the world.
- AC-2 (FR-4): Given the ant is carrying and reaches the nest drop zone, When drop fires, Then storage increases by the item's value and carrying state clears.
- AC-3 (FR-5): Given storage is N, When any normal action occurs, Then storage is never less than N unless a defined rule (spider drop, spend) applies.

## Constraints

- ✅ Always: all food/storage mutation goes through the shared colony state.
- ⚠️ Ask first: changing food value, drop mechanics, or adding spend rules.
- 🚫 Never: duplicate food (pickup then item still in world); negative storage.

## Edge Cases

- EC-1: Ant caught while carrying → food drops at catch location, not duplicated.
- EC-2: No food on map → no crash, storage unchanged, player can still move.
- EC-3: Drop outside nest zone → food returns to world or is rejected; storage unchanged.

## Out of Scope

Automatic worker gathering (see worker-ants-and-pheromones). Eating/consuming
food for the player's own energy (not in V1).

## Validation

- Manual: pick up, carry to nest, confirm storage counter increments.
- Automated (later): test that pickup removes the item and that drop increments storage by exact value.

## Source map

Linked to: food entity, pickup/drop handlers, colony storage (to be created).
