---
title: "Feature: Web Deploy"
status: in-review
parent: spec.md
---

# Web Deploy

## Purpose

The game must be playable from a link on a phone with no install, giving the
fastest possible test loop for a phone-only, agent-built project. Later it can
be wrapped as an Android APK.

## Requirements

- FR-1: The game SHALL build to static web assets runnable in a modern mobile browser.
- FR-2: The deployed URL SHALL be playable on a phone with no app store install.
- FR-3: The build SHALL pin its stack (Phaser 3 + TypeScript) with explicit versions.
- FR-4: Changes pushed to the repo SHALL update the deployed site (CI / GitHub Pages).
- FR-5: The same codebase SHALL be wrappable later as an Android APK via Capacitor.

## Acceptance Criteria

- AC-1 (FR-1, FR-2): Given the deployed URL opened on a phone browser, When it loads, Then the game is interactive with no install step.
- AC-2 (FR-3): Given a clean checkout, When the pinned build command runs, Then it produces a runnable bundle using the specified Phaser/TS versions.
- AC-3 (FR-4): Given a merged change to the game, When CI runs, Then the live URL reflects that change within a defined window.
- AC-4 (FR-5): Given the web build, When wrapped with Capacitor, Then it installs as a home-screen app that runs the same game.

## Constraints

- ✅ Always: keep the web build as the primary artifact; use GitHub Pages for deploy.
- ⚠️ Ask first: changing host, framework, or adding a backend.
- 🚫 Never: require a backend/server to play; break offline play in the web build.

## Edge Cases

- EC-1: Slow 3G → game still loads to a playable state (asset budgeting).
- EC-2: Browser without IndexedDB → fall back to localStorage; save still works.
- EC-3: Capacitor wrapper offline → game and save work without network.

## Out of Scope

App-store publication, native UI, push notifications (later/optional).

## Validation

- Manual: open the URL on a phone, play; run the build command; confirm CI redeploys.
- Automated (later): a smoke test that the built bundle boots without console errors.

## Source map

Linked to: build config, index.html, Capacitor config (to be created).
