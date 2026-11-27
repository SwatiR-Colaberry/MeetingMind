# STORY-060 — User Interface for Non-Technical and Advanced Users

As a user, I want a simple interface with advanced options, so that I can use the system effectively regardless of my technical expertise.

**Release:** r3 · Dashboard and Meeting History (weeks 4–4)
**Owner:** User
**Blocked by:** STORY-018

## The requirement this satisfies

- **REQ-065** (Non-functional, must) — The system must be simple enough for non-technical users while providing advanced configuration options for experienced users.

## How to build it

Design the UI to toggle between simple and advanced modes. Ensure all changes are logged with user details.

## Failure paths you must handle

- Advanced options not visible
- Simple mode too complex
- Changes not logged

## Where this fits

**Workspace:** User Interface

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a non-technical user, When accessing the system, Then the interface should present simple options by default.
- [ ] Given an experienced user, When accessing advanced settings, Then additional configuration options should be available.
- [ ] Trust: Given any user action, When a setting is changed, Then the change is logged with user details in the audit trail.

When every box above is ticked, stop and show the demo.
