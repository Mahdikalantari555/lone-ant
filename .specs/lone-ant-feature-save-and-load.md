---
title: "Feature: Save and Load"
status: deferred-v2
parent: lone-ant-spec.md
---

# Save and Load

> **Status: DEFERRED to V2 (OQ-5 resolved).** Offline persistence is not in V1.
> V1 starts fresh each session. The criteria below apply when this feature is
> built in Version 2.

## Purpose

Progress persists on the device so closing and reopening resumes exactly where
the player left off. The world is *saved*, not *simulated*, while closed.

## Requirements

- FR-1: On close/unload, the game SHALL persist colony size, stored food, unlocks, and world layout to device storage.
- FR-2: On open, the game SHALL restore exactly that state.
- FR-3: Reopened state SHALL equal saved state with no silent drift.
- FR-4: Saving SHALL require no network and no account.
- FR-5: If no save exists or it is corrupted, the game SHALL start a fresh colony rather than crash.

## Acceptance Criteria

- AC-1 (FR-1, FR-2): Given a known colony state S, When the game saves then reopens, Then the loaded state equals S (size, food, unlocks, layout).
- AC-2 (FR-3): Given storage N before close, When reopened, Then storage == N exactly (no off-by-one, no decay).
- AC-3 (FR-5): Given a corrupted or missing save, When the game opens, Then a valid fresh colony starts and is playable.
- AC-4 (FR-4): Given airplane mode / no network, When saving and loading, Then both succeed.

## Constraints

- ✅ Always: serialize through one save module; save on the unload event.
- ⚠️ Ask first: changing the save schema (breaks old saves) or switching storage backend.
- 🚫 Never: require a server/account; simulate the world while closed; write secrets to storage.

## Edge Cases

- EC-1: Closed mid-carry → food at nest or back in world on reopen, never duplicated.
- EC-2: Storage quota exceeded → fail gracefully, keep last good save.
- EC-3: Two tabs/open sessions → last write wins; no corruption.

## Out of Scope

Cloud sync, multiple save slots, cross-device continuity (not in V1).

## Validation

- Manual: play, close, reopen, confirm exact resume; delete save, confirm fresh start.
- Automated (later): snapshot state → serialize → deserialize → deep-equal assertion.

## Source map

Linked to: save/load module, serialization schema (to be created).
