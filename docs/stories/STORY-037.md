# STORY-037 — Audio Retention Options

As a user, I want to choose whether original audio recordings are retained or deleted after transcription, so that I can manage storage and privacy.

**Release:** r5 · Advanced Transcription Features (weeks 6–6)
**Owner:** transcription_service
**Blocked by:** STORY-029

## The requirement this satisfies

- **REQ-078** (Functional, must) — The system must allow users to choose whether original audio recordings are retained or automatically deleted after transcription.

## How to build it

Provide user interface options for audio retention preferences, ensuring choices are respected and actions are logged.

## Failure paths you must handle

- Retention choice not applied
- Audio not deleted
- Action not logged

## Where this fits

**Workspace:** Audio Management · set retention preferences

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a completed transcription, when the user chooses to retain audio, then the audio is stored.
- [ ] Given a completed transcription, when the user chooses to delete audio, then the audio is deleted.
- [ ] Trust: Given a user choice on audio retention, when executed, then the action is logged.

When every box above is ticked, stop and show the demo.
