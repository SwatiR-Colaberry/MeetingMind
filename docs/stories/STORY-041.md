# STORY-041 — Identify Changes in Agreed Plans

As a user, I want the system to identify changes in previously agreed plans, so that I can manage project adjustments effectively.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** AI Engine
**Blocked by:** STORY-037, STORY-040

## The requirement this satisfies

- **REQ-056** (Functional, must) — The system must identify changes in previously agreed plans.

## How to build it

Analyze meeting transcripts for changes in language indicating plan adjustments and compare against logged decisions.

## Failure paths you must handle

- Fails to identify a change in plans
- Incorrectly identifies a change where none exists
- Logs incorrect change references

## Where this fits

**Runs headless:** Plan Change Identifier — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a meeting where a previously agreed plan is changed, when processed, then the system should identify and log the change.
- [ ] Given a meeting with no changes to plans, when processed, then it should not log any changes.
- [ ] Trust: The system logs changes with references to the original agreements.

When every box above is ticked, stop and show the demo.
