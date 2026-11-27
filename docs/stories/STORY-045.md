# STORY-045 — Remind Users About Deadlines

As a user, I want the system to remind me about deadlines extracted from conversations, so that I can meet project timelines.

**Release:** r6 · Meeting Intelligence and Organization (weeks 7–7)
**Owner:** Notification System
**Blocked by:** STORY-037, STORY-044

## The requirement this satisfies

- **REQ-061** (Functional, must) — The system must remind users about deadlines extracted from conversations.

## How to build it

Extract deadlines from transcripts and schedule reminders using the notification system.

## Failure paths you must handle

- Fails to send a reminder for a deadline
- Incorrectly sends a reminder for a non-existent deadline
- Logs incorrect reminder details

## Where this fits

**Runs headless:** Deadline Reminder System — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a deadline mentioned in a meeting, when processed, then the system should remind the user about it before the due date.
- [ ] Given no deadlines mentioned, when processed, then no reminders should be sent.
- [ ] Trust: The system logs reminders sent and their corresponding deadlines.

When every box above is ticked, stop and show the demo.
