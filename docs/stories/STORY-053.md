# STORY-053 — Detect Active Communication via Audio Activity

As a user, I want the system to detect active communication through audio activity, so that meetings can be captured even if not on a known platform.

**Release:** r8 · Integration and Automation (weeks 9–9)
**Owner:** user
**Blocked by:** STORY-050, STORY-052

## The requirement this satisfies

- **REQ-028** (Functional, must) — The system must explore detecting active communication through system audio activity and microphone usage.
- **REQ-034** (Non-functional, must) — The system must avoid unnecessary resource consumption during audio capture and recording.
- **REQ-072** (Non-functional, must) — The system must have reliable audio synchronization.

## How to build it

Implement audio activity detection using system audio and microphone usage metrics, ensuring minimal resource consumption and reliable synchronization.

## Failure paths you must handle

- False positives from non-meeting audio.
- High CPU usage during detection.
- Audio synchronization issues.

## Where this fits

**Runs headless:** Audio Detection Service — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given system audio activity, When a meeting starts, Then the system detects and begins transcription.
- [ ] Given microphone usage, When no meeting is detected, Then the system does not start transcription.
- [ ] Trust: Given an active communication detection, When it occurs, Then the system logs the detection event with audio synchronization details.

When every box above is ticked, stop and show the demo.
