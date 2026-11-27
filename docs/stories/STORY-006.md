# STORY-006 — Real-Time Transcription with Speaker Identification

As a user, I want the system to generate real-time transcripts with speaker identification, so that I can follow the conversation accurately during a live meeting.

**Release:** r1 · Real-Time Transcription (weeks 2–2)
**Owner:** transcription_service
**Blocked by:** STORY-005

## The requirement this satisfies

- **REQ-003** (Functional, must) — The system must generate real-time transcripts with minimal delay (ideally 2–5 seconds) while a meeting is happening.
- **REQ-004** (Functional, must) — The system must identify individual speakers and distinguish their statements in the transcript.
- **REQ-039** (Functional, must) — The system must include timestamps for individual statements in the transcript.
- **REQ-040** (Functional, must) — The system must maintain the chronological order of conversations in the transcript.
- **REQ-041** (Functional, must) — The system must handle interruptions, pauses, and overlapping conversations during transcription.

## How to build it

Implement real-time transcription using the existing audio capture engine. Use speaker diarization to identify speakers and insert timestamps. Ensure the system handles overlapping conversations and maintains order.

## Failure paths you must handle

- Audio capture fails due to device issues.
- Speaker diarization fails to distinguish speakers.
- Timestamps are not aligned with audio segments.

## Where this fits

**Workspace:** Live Meeting View

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a live meeting is in progress, when the system captures audio, then it generates a real-time transcript with speaker identification and timestamps.
- [ ] Given overlapping conversations occur, when the system processes the audio, then it maintains the chronological order and identifies speakers correctly.
- [ ] Trust: Given a meeting is transcribed, when the transcript is saved, then it includes timestamps and speaker identification for audit purposes.

When every box above is ticked, stop and show the demo.
