# STORY-025 — Support Post-Meeting Transcription

As a user, I want the system to support post-meeting transcription, so that I can have a transcript even if real-time processing was unavailable.

**Release:** r4 · AI-Powered Summaries (weeks 5–5)
**Owner:** Transcription Engine
**Blocked by:** STORY-022

## The requirement this satisfies

- **REQ-035** (Functional, must) — The system must support post-meeting transcription when real-time processing is unavailable.
- **REQ-074** (Non-functional, must) — The system must automatically save transcription progress.

## How to build it

Use the transcription engine to process audio files post-meeting. Ensure progress is saved to the local database periodically.

## Failure paths you must handle

- Transcription fails to start
- Progress is not saved
- Transcript is incomplete

## Where this fits

**Runs headless:** Transcription Job — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a completed meeting without real-time transcription, when the meeting ends, then the system processes and generates a transcript.
- [ ] Given an ongoing transcription, when the system is interrupted, then it automatically saves the transcription progress.
- [ ] Trust: Given a transcription process, when it completes, then it is logged with a timestamp and meeting ID.

When every box above is ticked, stop and show the demo.
