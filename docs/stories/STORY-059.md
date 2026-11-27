# STORY-059 — Implement Trust Spine for Initial Setup and Detection

As a system administrator, I want to ensure that the system's initial setup and detection processes are idempotent and auditable, so that data integrity and compliance are maintained.

**Release:** r0 · Initial Setup and Detection (weeks 1–1)
**Owner:** System Administrator
**Blocked by:** nothing — you can start this now

## The requirement this satisfies

- **REQ-001** (Functional, must) — The system must automatically detect when a meeting or voice call starts on supported platforms such as Zoom, Google Meet, Microsoft Teams, Webex, Skype, and WhatsApp Desktop.
- **REQ-002** (Functional, must) — The system must capture both microphone and system audio simultaneously where supported, ensuring both sides of the conversation are recorded.
- **REQ-018** (Safety, must) — The system must obtain the necessary permissions before accessing microphone or system audio and require appropriate participant consent before capturing conversations.
- **REQ-020** (Safety, must) — The system must never secretly record calls or bypass operating-system or application permissions.
- **REQ-027** (Functional, must) — The system must identify when a meeting ends and automatically stop capturing audio.
- **REQ-067** (Safety, must) — The system must provide clear information about what data is processed locally and what is sent to external services.

## How to build it

Implement logging for each detection process in the audit trail. Ensure idempotency by checking existing entries before creating new ones.

## Failure paths you must handle

- Duplicate meeting detection entries
- Audit trail entry missing
- Incorrect timestamp in audit trail

## Where this fits

**Runs headless:** Meeting Detection Process — no page shows this; it is background work.

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given the system is set up for the first time, When a meeting is detected, Then the detection process should be idempotent and logged in the audit trail.
- [ ] Given the system has already detected a meeting, When the detection process is triggered again, Then no duplicate entries should be created in the audit trail.
- [ ] Trust: Given any detection process, When it completes, Then an entry is created in the audit trail with a timestamp and status.

When every box above is ticked, stop and show the demo.
