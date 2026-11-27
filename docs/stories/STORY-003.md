# STORY-003 — Notification System for Meeting Detection and Transcript Readiness

As a user, I want to receive notifications when a meeting is detected and when its transcript is ready, so that I am informed about the system's activities.

**Release:** r0 · Initial Setup and Detection (weeks 1–1)
**Owner:** system
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

- **REQ-005** (Functional, must) — The system must provide notifications when a new meeting is detected and when its transcript is ready.

## How to build it

Implement notification system using OS notification APIs. Ensure notifications are sent for meeting detection and transcript readiness. Ask before building: "OS notification API" is not among the tools this project names. Check with the project owner whether to use it or where that data already lives.

## Failure paths you must handle

- Notification fails to appear for meeting detection.
- Notification fails to appear for transcript readiness.
- Notifications are sent multiple times for the same event.

## Where this fits

**Workspace:** Notification System

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a meeting is detected, when it starts, then the user receives a notification about the detection.
- [ ] Given a transcript is ready, when the processing completes, then the user receives a notification about the transcript availability.
- [ ] Trust: When a notification is sent, an entry is logged with the notification type and timestamp.

When every box above is ticked, stop and show the demo.
