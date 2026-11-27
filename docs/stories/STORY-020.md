# STORY-020 — Meeting Data Management

As a user, I want to manage my meeting data, so that I can control my information and privacy.

**Release:** r3 · Dashboard and Meeting History (weeks 4–4)
**Owner:** Data Management Team
**Blocked by:** STORY-017, STORY-018

## The requirement this satisfies

- **REQ-017** (Safety, must) — The system must allow users to delete their data permanently and provide data export functionality.
- **REQ-049** (Functional, must) — The system must allow users to delete individual meetings or their associated recordings.

## How to build it

Implement functionality for permanent data deletion and data export. Ensure compliance with privacy requirements.

## Failure paths you must handle

- Data deletion fails or is incomplete.
- Exported data is incorrect or incomplete.
- User is unable to initiate data export.

## Where this fits

**Workspace:** Meeting Dashboard · manage data

## Acceptance — your stop condition

Tick each box as it genuinely passes. This file is yours — the platform reads
the same criteria out of `.colaberry/progress.json`, which Claude Code keeps in
step (see the managed block in CLAUDE.md). Ticking something you have not
actually met only misleads you.

- [ ] Given a user wants to delete a meeting, when they confirm the deletion, then the meeting and its recordings should be permanently removed.
- [ ] Given a user wants to export their data, when they choose the export option, then they should receive their data in a downloadable format.
- [ ] Trust: Given a data deletion or export action, then the system must log the action and user ID for audit purposes.

When every box above is ticked, stop and show the demo.
