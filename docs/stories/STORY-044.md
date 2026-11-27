# STORY-044 — Identify Completed and Pending Tasks

As a user, I want the system to identify completed and pending tasks based on discussions, so that I can manage task progress effectively.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** AI Engine
**Blocked by:** STORY-037, STORY-043

## The requirement this satisfies

- **REQ-059** (Functional, must) — The system must identify tasks that have been completed or remain pending based on subsequent discussions.

## How to build it

Analyze transcripts to identify task status updates and maintain a task log reflecting these updates.

## Failure paths you must handle

- Fails to identify a completed task
- Incorrectly marks a pending task as completed
- Logs incorrect task status changes

## Where this fits

**Runs headless:** Task Status Identifier — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given tasks discussed in meetings, when processed, then the system should identify their completion status.
- [ ] Given tasks not discussed, when processed, then they should not have their status updated.
- [ ] Trust: The system logs task status changes with references to relevant discussions.

When every box above is ticked, stop and show the demo.
