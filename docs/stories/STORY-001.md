# STORY-001 — Automatic Meeting Detection and Audio Capture

As a user, I want the system to automatically detect when a meeting starts and capture audio, so that I can have a complete record of the meeting without manual intervention.

**Release:** r0 · Initial Setup and Detection (weeks 1–1)
**Owner:** system
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

- **REQ-001** (Functional, must) — The system must automatically detect when a meeting or voice call starts on supported platforms such as Zoom, Google Meet, Microsoft Teams, Webex, Skype, and WhatsApp Desktop.
- **REQ-002** (Functional, must) — The system must capture both microphone and system audio simultaneously where supported, ensuring both sides of the conversation are recorded.
- **REQ-018** (Safety, must) — The system must obtain the necessary permissions before accessing microphone or system audio and require appropriate participant consent before capturing conversations.
- **REQ-020** (Safety, must) — The system must never secretly record calls or bypass operating-system or application permissions.
- **REQ-027** (Functional, must) — The system must identify when a meeting ends and automatically stop capturing audio.

## How to build it

Implement meeting detection for Zoom, Google Meet, Microsoft Teams, Webex, Skype, and WhatsApp Desktop. Ensure audio capture uses system APIs to access microphone and system audio, respecting OS permissions.

## Failure paths you must handle

- Meeting detection fails on a supported platform.
- Audio capture does not start despite detection.
- Audio capture continues after meeting ends.

## Where this fits

**Runs headless:** Meeting Detection Engine — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a supported platform is in use, when a meeting starts, then the system detects it and begins audio capture.
- [ ] Given a meeting ends, when the system detects this, then it stops capturing audio.
- [ ] Trust: When audio capture starts, an entry is logged indicating the meeting start and consent verification.

When every box above is ticked, stop and show the demo.
