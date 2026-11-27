# STORY-036 — Support Offline Transcription

As a user, I want the system to support offline transcription, so that I can transcribe audio without an internet connection.

**Release:** r5 · Advanced Transcription Features (weeks 6–6)
**Owner:** transcription_service
**Blocked by:** STORY-029

## The requirement this satisfies

- **REQ-075** (Non-functional, must) — The system must support offline transcription where technically feasible.

## How to build it

Implement offline transcription capabilities using local processing resources, ensuring the transcription engine can operate without internet connectivity.

## Failure paths you must handle

- Offline processing fails
- Transcription not completed
- Process not logged

## Where this fits

**Runs headless:** Offline Transcription Module — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given an audio file, when processed offline, then the system transcribes it without internet access.
- [ ] Given a lack of internet connection, when transcription is requested, then the system processes the audio offline.
- [ ] Trust: Given an offline transcription, when completed, then the process is logged.

When every box above is ticked, stop and show the demo.
