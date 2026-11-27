# STORY-046 — Manual Control of Transcription

As a user, I want to manually start, pause, resume, or stop transcription, so that I have control over when my meetings are transcribed.

**Release:** r7 · AI Assistant and Search (weeks 8–8)
**Owner:** User
**Blocked by:** STORY-045

## The requirement this satisfies

- **REQ-006** (Functional, must) — The system must allow users to manually start, pause, resume, or stop transcription.

## How to build it

Implement manual controls in the meeting interface to start, pause, resume, and stop transcription. Ensure these controls are accessible during any detected meeting.

## Failure paths you must handle

- User attempts to start transcription without a detected meeting.
- User pauses transcription and forgets to resume.
- User stops transcription and expects it to resume automatically.

## Where this fits

**Workspace:** Live Meeting View · transcription controls

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a meeting is detected, when I manually start transcription, then the system begins transcribing the meeting.
- [ ] Given transcription is ongoing, when I pause transcription, then the system stops transcribing until resumed.
- [ ] Trust: Given transcription is paused, when I resume transcription, then the system continues transcribing from where it left off.

When every box above is ticked, stop and show the demo.
