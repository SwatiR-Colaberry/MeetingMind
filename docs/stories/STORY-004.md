# STORY-004 — Clear Indicator for Active Audio Capture and Transcription

As a user, I want a clear indicator when audio capture or transcription is active, so that I am aware of the system's operations and can ensure privacy compliance.

**Release:** r0 · Initial Setup and Detection (weeks 1–1)
**Owner:** system
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

- **REQ-019** (Safety, must) — The system must provide a clear indicator whenever audio capture or transcription is active.

## How to build it

Design and implement a UI element that changes state based on audio capture and transcription activity. Ensure it is visible in the system tray or application interface.

## Failure paths you must handle

- Indicator does not appear when audio capture is active.
- Indicator does not appear when transcription is active.
- Indicator remains on after activity stops.

## Where this fits

**Workspace:** System Tray · view indicator

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given audio capture is active, when the user checks the application, then a clear indicator is visible.
- [ ] Given transcription is active, when the user checks the application, then a clear indicator is visible.
- [ ] Trust: When the indicator changes state, an entry is logged with the current state and timestamp.

When every box above is ticked, stop and show the demo.
