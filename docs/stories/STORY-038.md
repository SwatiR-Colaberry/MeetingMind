# STORY-038 — Identify Related Meetings

As a user, I want the system to identify related meetings, so that I can easily track ongoing discussions across multiple sessions.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** AI Engine
**Blocked by:** STORY-037

## The requirement this satisfies

- **REQ-053** (Functional, must) — The system must identify related meetings.

## How to build it

Use the AI engine to analyze meeting transcripts and metadata to identify related meetings based on participant overlap and topic similarity.

## Failure paths you must handle

- Incorrectly identifies unrelated meetings as related
- Fails to identify related meetings
- Logs incorrect criteria for relationships

## Where this fits

**Runs headless:** Meeting Relationship Processor — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a series of meetings with overlapping participants and topics, when the system processes these meetings, then it should identify them as related.
- [ ] Given a meeting with no similar topics or participants, when processed, then it should not be marked as related to others.
- [ ] Trust: The system logs the criteria used to determine meeting relationships.

When every box above is ticked, stop and show the demo.
