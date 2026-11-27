# STORY-042 — Track Recurring Action Items

As a user, I want the system to track recurring action items, so that I can ensure ongoing tasks are completed.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** AI Engine
**Blocked by:** STORY-037, STORY-041

## The requirement this satisfies

- **REQ-057** (Functional, must) — The system must track recurring action items.

## How to build it

Identify action items in transcripts and track their recurrence using pattern recognition and historical data.

## Failure paths you must handle

- Fails to track a recurring action item
- Incorrectly logs non-recurring items as recurring
- Logs incorrect recurrence patterns

## Where this fits

**Runs headless:** Action Item Tracker — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a recurring action item discussed in multiple meetings, when processed, then the system should track its recurrence.
- [ ] Given a non-recurring action item, when processed, then it should not be tracked as recurring.
- [ ] Trust: The system logs recurrence patterns and action item status.

When every box above is ticked, stop and show the demo.
