# STORY-010 — Network and Application Crash Recovery

As a user, I want the system to handle network interruptions and recover from application crashes, so that transcription continues without data loss.

**Release:** r1 · Real-Time Transcription (weeks 2–2)
**Owner:** system_resilience_service
**Blocked by:** STORY-005, STORY-006

## The requirement this satisfies

- **REQ-073** (Non-functional, must) — The system must recover from unexpected application crashes.
- **REQ-083** (Non-functional, must) — The system must handle network interruptions during transcription and continue processing.

## How to build it

Implement checkpointing to save transcription state periodically. Use local storage to resume transcription after network or application recovery.

## Failure paths you must handle

- Network interruption causes data loss.
- Application crash results in incomplete transcription.
- State checkpointing fails to save progress.

## Where this fits

**Runs headless:** Recovery Service — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a network interruption occurs, when the connection is restored, then transcription resumes from the last saved point.
- [ ] Given an application crash occurs, when the application restarts, then transcription resumes from the last saved point.
- [ ] Trust: Given a recovery event, when transcription resumes, then the system logs the event for audit purposes.

When every box above is ticked, stop and show the demo.
