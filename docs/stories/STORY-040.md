# STORY-040 — Track Decisions Across Meetings

As a user, I want the system to track decisions across meetings, so that I can see how decisions evolve over time.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** AI Engine
**Blocked by:** STORY-037, STORY-039

## The requirement this satisfies

- **REQ-055** (Functional, must) — The system must track decisions across multiple meetings.

## How to build it

Implement decision extraction from transcripts and maintain a decision log that tracks changes and confirmations across meetings.

## Failure paths you must handle

- Fails to track a decision across meetings
- Incorrectly logs decisions
- Logs incorrect decision sources

## Where this fits

**Runs headless:** Decision Tracker — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a series of meetings with decisions made, when processed, then the system should track these decisions across meetings.
- [ ] Given a meeting with no decisions, when processed, then it should not add any decision tracking entries.
- [ ] Trust: The system logs decision tracking entries and their sources.

When every box above is ticked, stop and show the demo.
