# STORY-049 — Switch Between Local and Cloud AI Processing

As a user, I want to switch between local and cloud AI processing, so that I can choose the best option for my privacy and performance needs.

**Release:** r7 · AI Assistant and Search (weeks 8–8)
**Owner:** User
**Blocked by:** STORY-045, STORY-048

## The requirement this satisfies

- **REQ-076** (Non-functional, must) — The system must be able to switch between local and cloud AI processing.

## How to build it

Add options in the Settings section to toggle between local and cloud AI processing. Ensure the system status reflects the current mode accurately.

## Failure paths you must handle

- User selects local processing but system defaults to cloud.
- User selects cloud processing but system fails to connect to cloud services.
- System does not update processing mode status.

## Where this fits

**Workspace:** Settings · AI processing mode

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given the system settings, when I select local processing, then the system processes AI tasks locally.
- [ ] Given the system settings, when I select cloud processing, then the system processes AI tasks in the cloud.
- [ ] Trust: Given a processing mode change, when I view the system status, then it reflects the current processing mode.

When every box above is ticked, stop and show the demo.
