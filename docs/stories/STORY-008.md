# STORY-008 — Post-Meeting Transcript Generation

As a user, I want the system to generate transcripts immediately after a meeting ends if real-time processing is unavailable, so that I have access to the meeting content.

**Release:** r1 · Real-Time Transcription (weeks 2–2)
**Owner:** transcription_service
**Blocked by:** STORY-005, STORY-006

## The requirement this satisfies

- **REQ-085** (Functional, must) — The system must generate transcripts immediately after a meeting ends if real-time processing is unavailable.

## How to build it

Trigger post-meeting transcription using stored audio data if real-time processing was not completed. Ensure transcripts are saved with timestamps and speaker identification.

## Failure paths you must handle

- Audio data is corrupted or missing.
- Post-meeting transcription fails to start.
- Generated transcript lacks speaker identification.

## Where this fits

**Runs headless:** Post-Meeting Transcription Job — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a meeting has ended, when real-time transcription was unavailable, then the system generates the transcript immediately.
- [ ] Given a generated transcript, when the user accesses it, then it is available in the meeting history.
- [ ] Trust: Given a transcript is generated post-meeting, when it is saved, then it includes timestamps and speaker identification for audit purposes.

When every box above is ticked, stop and show the demo.
