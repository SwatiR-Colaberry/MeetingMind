# STORY-007 — Manual Transcript Correction and Audio Replay

As a user, I want to replay audio segments and manually correct transcript errors, so that I can ensure the transcript's accuracy.

**Release:** r1 · Real-Time Transcription (weeks 2–2)
**Owner:** transcription_service
**Blocked by:** STORY-005, STORY-006

## The requirement this satisfies

- **REQ-021** (Functional, must) — The system must allow users to replay audio segments and manually correct transcript errors.

## How to build it

Provide an interface for users to select and replay audio segments. Allow text editing of the transcript and save changes to the database.

## Failure paths you must handle

- Audio segment fails to replay.
- Transcript corrections are not saved.
- User interface does not allow text selection.

## Where this fits

**Workspace:** Meeting Details · correct transcript

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a transcript with errors, when a user selects an audio segment, then they can replay the audio and correct the transcript.
- [ ] Given a corrected transcript, when the user saves changes, then the updated transcript is stored with the corrections.
- [ ] Trust: Given a correction is made, when the transcript is saved, then the system logs the correction for audit purposes.

When every box above is ticked, stop and show the demo.
