# STORY-015 — Handling OS-Specific Audio Capture Restrictions

As a developer, I want the system to handle OS-specific audio capture restrictions, so that it functions correctly across platforms.

**Release:** r2 · Audio Management and Enhancement (weeks 3–3)
**Owner:** development_team
**Blocked by:** STORY-010, STORY-011

## The requirement this satisfies

- **REQ-031** (Functional, must) — The system must handle operating-system-specific audio capture restrictions.
- **REQ-084** (Non-functional, must) — The system must use a modular architecture with separate audio-capture components for different operating systems while sharing the same transcription, AI processing, storage, and user-interface layers.

## How to build it

Develop separate audio capture components for Windows, macOS, and Linux. Ensure compliance with each OS's restrictions and integrate with the shared layers.

## Failure paths you must handle

- OS restriction not handled
- Audio capture fails on specific OS
- Non-compliance with OS policies

## Where this fits

**Runs headless:** os_specific_audio_capture — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a user on Windows, when the system captures audio, then it must comply with Windows-specific restrictions.
- [ ] Given a user on macOS, when the system captures audio, then it must comply with macOS-specific restrictions.
- [ ] Trust: The system logs compliance with OS-specific restrictions for each audio capture session.

When every box above is ticked, stop and show the demo.
