# STORY-017 — Support for Different Audio Formats

As a user, I want the system to support different audio formats, so that I can choose the best format for my needs.

**Release:** r2 · Audio Management and Enhancement (weeks 3–3)
**Owner:** development_team
**Blocked by:** STORY-010, STORY-011, STORY-013

## The requirement this satisfies

- **REQ-033** (Functional, must) — The system must support different audio formats.

## How to build it

Implement support for multiple audio formats in the recording module. Ensure format selection is user-friendly and persists across sessions.

## Failure paths you must handle

- Format not supported
- Recording saved in wrong format
- Format change not applied

## Where this fits

**Workspace:** settings · select_audio_format

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a user selects an audio format, when the system captures audio, then it must save the recording in the chosen format.
- [ ] Given a user changes the audio format setting, when a new recording is made, then it must reflect the new format.
- [ ] Trust: The system logs the selected audio format for each recording session.

When every box above is ticked, stop and show the demo.
