---
title: "Feature: Worker Ants and Pheromones"
status: in-review
parent: lone-ant-spec.md
---

# Worker Ants and Pheromones

## Purpose

Automatic worker ants and pheromone trails make the world feel alive even when
the player only watches, and they contribute to the same colony storage.

## Requirements

- FR-1: The colony SHALL maintain worker ants the player does not control.
- FR-2: Worker ants SHALL gather food and deliver it to storage autonomously.
- FR-3: Ants SHALL leave pheromone trails between food and the nest.
- FR-4: Worker movement SHALL be influenced by pheromone trails (toward food or nest).
- FR-5: Trails SHALL persist for the duration of a session and decay over time.

## Acceptance Criteria

- AC-1 (FR-2): Given at least one worker and reachable food, When the game runs unattended for a fixed interval, Then storage increases without player input.
- AC-2 (FR-3, FR-4): Given a food source is found, When ants travel, Then a detectable trail exists and subsequent ants bias movement along it.
- AC-3 (FR-5): Given no ants traverse a trail for a decay period, When checked, Then the trail strength is below its initial value.

## Constraints

- ✅ Always: workers write to the same shared storage as the player; reuse the pheromone grid module.
- ⚠️ Ask first: changing worker count formula or trail decay rate.
- 🚫 Never: let workers require player commands; let trails persist across sessions (session-only in V1).

## Edge Cases

- EC-1: No food found → workers wander/return, no crash, storage unchanged.
- EC-2: Trail grid full → oldest/weakest cells decay; no overflow crash.
- EC-3: Many workers → frame rate stays acceptable (see A4 in [lone-ant-spec.md](lone-ant-spec.md)).

## Out of Scope

Player steering of workers, pheromone types other than food/nest, evolved
pheromone chemistry.

## Validation

- Manual: watch workers deliver food; observe trails forming and fading.
- Automated (later): simulation test asserting storage delta > 0 over N ticks with food present.

## Source map

Linked to: worker AI, pheromone grid, pathing (to be created).
